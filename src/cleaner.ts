// ── Cleaner — Surgical Persona Removal ──

import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import type { RemovalResult, RemoveOptions } from './types.js';
import {
  MARKER_START,
  MARKER_END,
  MANIFEST_MARKER_START,
  MANIFEST_MARKER_END,
  COPILOT_INSTRUCTIONS_PATH,
  UNIVERSAL_PERSONA_PATH,
  CLAUDE_RULES_DIR,
  README_PATH,
  README_MARKER_START,
  README_MARKER_END,
  CLAUDE_PERSONA_PREFIX,
  CLAUDE_MANIFEST_FILE,
} from './constants.js';
import { readFileSafe, writeFileSafe, deleteFile, removeDirIfEmpty, fileExists } from './fs-utils.js';

/**
 * Remove one or more personas from all targets.
 */
export async function removePersonas(
  personaNames: string[],
  options: RemoveOptions = {}
): Promise<RemovalResult[]> {
  const cwd = options.cwd ?? process.cwd();
  const results: RemovalResult[] = [];

  // Remove from single-file targets (copilot, universal)
  for (const { path, targetId } of [
    { path: COPILOT_INSTRUCTIONS_PATH, targetId: 'copilot' },
    { path: UNIVERSAL_PERSONA_PATH, targetId: 'universal' },
  ]) {
    const filePath = join(cwd, path);
    const singleResults = await removeFromSingleFile(personaNames, filePath, targetId);
    results.push(...singleResults);
  }

  // Remove from Claude multi-file
  const claudeResults = await removeFromClaude(personaNames, join(cwd, CLAUDE_RULES_DIR));
  results.push(...claudeResults);

  // Clean up README pointer if no personas remain
  await cleanReadme(cwd, results);

  return results;
}

/**
 * Surgically remove persona blocks from a single-file target.
 */
async function removeFromSingleFile(
  personaNames: string[],
  filePath: string,
  targetId: string
): Promise<RemovalResult[]> {
  const results: RemovalResult[] = [];
  const content = await readFileSafe(filePath);

  if (!content) {
    for (const name of personaNames) {
      results.push({
        target: targetId,
        persona: name,
        status: 'skipped',
        filePath,
        message: 'File does not exist',
      });
    }
    return results;
  }

  let updatedContent = content;

  for (const name of personaNames) {
    const startMarker = MARKER_START(name);
    const endMarker = MARKER_END(name);

    if (!updatedContent.includes(startMarker)) {
      results.push({
        target: targetId,
        persona: name,
        status: 'skipped',
        filePath,
        message: 'Persona not found in file',
      });
      continue;
    }

    // Remove the persona block (including markers and surrounding whitespace)
    const regex = new RegExp(
      `\\n*${escapeRegex(startMarker)}[\\s\\S]*?${escapeRegex(endMarker)}\\n*`,
      'g'
    );
    updatedContent = updatedContent.replace(regex, '\n');

    results.push({
      target: targetId,
      persona: name,
      status: 'removed',
      filePath,
    });
  }

  // Check if any personas remain
  const remainingPersonas = extractRemainingPersonas(updatedContent);

  if (remainingPersonas.length === 0) {
    // Remove manifest markers too
    const manifestRegex = new RegExp(
      `\\n*${escapeRegex(MANIFEST_MARKER_START)}[\\s\\S]*?${escapeRegex(MANIFEST_MARKER_END)}\\n*`,
      'g'
    );
    updatedContent = updatedContent.replace(manifestRegex, '');
  }

  // If file is now empty (only whitespace), delete it
  if (updatedContent.trim() === '') {
    await deleteFile(filePath);
    // Update status to 'deleted' for the last removal
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].status === 'removed' && results[i].filePath === filePath) {
        results[i].status = 'deleted';
        results[i].message = 'File deleted (no remaining content)';
        break;
      }
    }
  } else {
    await writeFileSafe(filePath, updatedContent.trim() + '\n');
  }

  // Clean up empty .github directory
  if (filePath.includes('.github')) {
    await removeDirIfEmpty(join(filePath, '..'));
  }

  return results;
}

/**
 * Remove persona files from Claude's rules directory.
 */
async function removeFromClaude(
  personaNames: string[],
  rulesDir: string
): Promise<RemovalResult[]> {
  const results: RemovalResult[] = [];

  if (!(await fileExists(rulesDir))) {
    for (const name of personaNames) {
      results.push({
        target: 'claude',
        persona: name,
        status: 'skipped',
        filePath: rulesDir,
        message: 'Claude rules directory does not exist',
      });
    }
    return results;
  }

  const entries = await readdir(rulesDir);

  for (const name of personaNames) {
    const prefix = `${CLAUDE_PERSONA_PREFIX}${name}`;
    const matchingFiles = entries.filter(
      (e) => e.startsWith(prefix) && e.endsWith('.md')
    );

    if (matchingFiles.length === 0) {
      results.push({
        target: 'claude',
        persona: name,
        status: 'skipped',
        filePath: rulesDir,
        message: 'No Claude rule files found for this persona',
      });
      continue;
    }

    for (const file of matchingFiles) {
      const filePath = join(rulesDir, file);
      await deleteFile(filePath);
      results.push({
        target: 'claude',
        persona: name,
        status: 'deleted',
        filePath,
      });
    }
  }

  // Check if any persona files remain; if not, remove manifest and clean dir
  const remainingEntries = await readdir(rulesDir);
  const remainingPersonaFiles = remainingEntries.filter(
    (e) => e.startsWith(CLAUDE_PERSONA_PREFIX) && e.endsWith('.md')
  );

  if (remainingPersonaFiles.length === 0) {
    // Delete manifest
    const manifestPath = join(rulesDir, CLAUDE_MANIFEST_FILE);
    await deleteFile(manifestPath);

    // Try to clean up empty directories
    await removeDirIfEmpty(rulesDir);
    await removeDirIfEmpty(join(rulesDir, '..'));
  }

  return results;
}

/**
 * Remove README persona pointer if no personas remain.
 */
async function cleanReadme(
  cwd: string,
  _removalResults: RemovalResult[]
): Promise<void> {
  // Check if any persona files still exist
  const copilotPath = join(cwd, COPILOT_INSTRUCTIONS_PATH);
  const universalPath = join(cwd, UNIVERSAL_PERSONA_PATH);
  const copilotContent = await readFileSafe(copilotPath);
  const universalContent = await readFileSafe(universalPath);

  const hasRemainingPersonas =
    (copilotContent && extractRemainingPersonas(copilotContent).length > 0) ||
    (universalContent && extractRemainingPersonas(universalContent).length > 0);

  if (hasRemainingPersonas) return;

  const readmePath = join(cwd, README_PATH);
  const readmeContent = await readFileSafe(readmePath);

  if (!readmeContent || !readmeContent.includes(README_MARKER_START)) return;

  const regex = new RegExp(
    `\\n*${escapeRegex(README_MARKER_START)}[\\s\\S]*?${escapeRegex(README_MARKER_END)}\\n*`,
    'g'
  );
  const cleanedContent = readmeContent.replace(regex, '\n');
  await writeFileSafe(readmePath, cleanedContent.trim() + '\n');
}

function extractRemainingPersonas(content: string): string[] {
  const regex = /<!-- PERSONA-INJECTOR:(\w+):START -->/g;
  const names: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    if (name !== 'MANIFEST' && name !== 'README') {
      names.push(name);
    }
  }

  return names;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
