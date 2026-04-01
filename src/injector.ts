// ── File System Injector ──
// Writes composed persona content to target files with marker-based idempotent operations.

import { join } from 'node:path';
import type { InjectionResult, InstallOptions } from './types.js';
import {
  MANIFEST_MARKER_START,
  MANIFEST_MARKER_END,
  COPILOT_INSTRUCTIONS_PATH,
  UNIVERSAL_PERSONA_PATH,
  CLAUDE_RULES_DIR,
  README_PATH,
  README_POINTER,
  README_MARKER_START,
} from './constants.js';
import { readFileSafe, writeFileSafe, fileExists } from './fs-utils.js';
import { composeForSingleFile, composeForClaudeMultiFile } from './composer.js';
import { resolveTargets } from './targets.js';

/**
 * Inject personas into all configured targets.
 */
export async function injectPersonas(
  personaNames: string[],
  options: InstallOptions = {}
): Promise<InjectionResult[]> {
  const cwd = options.cwd ?? process.cwd();
  const targets = resolveTargets(options.targets);
  const results: InjectionResult[] = [];

  for (const target of targets) {
    switch (target.id) {
      case 'copilot': {
        const copilotResults = await injectSingleFile(
          personaNames,
          join(cwd, COPILOT_INSTRUCTIONS_PATH),
          'copilot',
          options
        );
        results.push(...copilotResults);
        break;
      }
      case 'claude': {
        const claudeResults = await injectClaudeMultiFile(
          personaNames,
          join(cwd, CLAUDE_RULES_DIR),
          options
        );
        results.push(...claudeResults);
        break;
      }
      case 'universal': {
        const universalResults = await injectSingleFile(
          personaNames,
          join(cwd, UNIVERSAL_PERSONA_PATH),
          'universal',
          options
        );
        results.push(...universalResults);
        break;
      }
    }
  }

  // Update README.md
  await updateReadme(cwd, options.dryRun);

  return results;
}

/**
 * Inject into a single-file target (copilot, universal).
 * Uses markers for idempotent add/replace.
 */
async function injectSingleFile(
  personaNames: string[],
  filePath: string,
  targetId: string,
  options: InstallOptions
): Promise<InjectionResult[]> {
  const results: InjectionResult[] = [];

  if (options.dryRun) {
    for (const name of personaNames) {
      results.push({
        target: targetId,
        persona: name,
        status: 'skipped',
        filePath,
        message: 'Dry run — no files written',
      });
    }
    return results;
  }

  // Read existing content
  let existingContent = await readFileSafe(filePath);

  if (options.force || !existingContent) {
    // Full write — compose all personas fresh
    const composed = await composeForSingleFile(personaNames);
    await writeFileSafe(filePath, composed.content);

    for (const name of personaNames) {
      results.push({
        target: targetId,
        persona: name,
        status: existingContent ? 'replaced' : 'created',
        filePath,
      });
    }
    return results;
  }

  // Incremental mode — add/replace individual persona blocks
  let content = existingContent;

  // Collect all currently-installed persona names from markers
  const installedNames = extractInstalledPersonas(content);
  const allNames = [...new Set([...installedNames, ...personaNames])];

  // Rebuild the full file with all personas
  const composed = await composeForSingleFile(allNames);

  // If existing content has manifest markers, replace everything
  if (
    content.includes(MANIFEST_MARKER_START) &&
    content.includes(MANIFEST_MARKER_END)
  ) {
    await writeFileSafe(filePath, composed.content);
    for (const name of personaNames) {
      results.push({
        target: targetId,
        persona: name,
        status: installedNames.includes(name) ? 'replaced' : 'appended',
        filePath,
      });
    }
  } else {
    // No existing persona content — append
    const newContent = content.trimEnd() + '\n\n' + composed.content;
    await writeFileSafe(filePath, newContent);
    for (const name of personaNames) {
      results.push({
        target: targetId,
        persona: name,
        status: 'appended',
        filePath,
      });
    }
  }

  return results;
}

/**
 * Inject into Claude Code's multi-file structure.
 */
async function injectClaudeMultiFile(
  personaNames: string[],
  rulesDir: string,
  options: InstallOptions
): Promise<InjectionResult[]> {
  const results: InjectionResult[] = [];
  const { files } = await composeForClaudeMultiFile(personaNames);

  for (const [fileName, content] of files) {
    const filePath = join(rulesDir, fileName);

    if (options.dryRun) {
      results.push({
        target: 'claude',
        persona: extractPersonaFromFileName(fileName),
        status: 'skipped',
        filePath,
        message: 'Dry run — no files written',
      });
      continue;
    }

    const existed = await fileExists(filePath);
    await writeFileSafe(filePath, content);

    results.push({
      target: 'claude',
      persona: extractPersonaFromFileName(fileName),
      status: existed ? 'replaced' : 'created',
      filePath,
    });
  }

  return results;
}

/**
 * Update README.md with a persona pointer.
 */
async function updateReadme(cwd: string, dryRun?: boolean): Promise<void> {
  if (dryRun) return;

  const readmePath = join(cwd, README_PATH);
  const content = await readFileSafe(readmePath);

  if (!content) return; // No README — skip

  // Already has our marker
  if (content.includes(README_MARKER_START)) {
    return;
  }

  const updated = content.trimEnd() + '\n' + README_POINTER + '\n';
  await writeFileSafe(readmePath, updated);
}

/**
 * Extract persona names from markers in existing content.
 */
function extractInstalledPersonas(content: string): string[] {
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

/**
 * Extract persona name from Claude rule file name.
 */
function extractPersonaFromFileName(fileName: string): string {
  if (fileName.startsWith('_')) return 'manifest';
  // persona-developer.md → developer
  // persona-developer-workflows.md → developer
  const match = fileName.match(/^persona-([^-]+)/);
  return match ? match[1] : fileName;
}
