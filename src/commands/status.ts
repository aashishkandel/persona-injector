// ── Status Command Handler ──

import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import { log, pc } from '../logger.js';
import { readFileSafe, fileExists } from '../fs-utils.js';
import {
  COPILOT_INSTRUCTIONS_PATH,
  UNIVERSAL_PERSONA_PATH,
  CLAUDE_RULES_DIR,
  CLAUDE_PERSONA_PREFIX,
  README_PATH,
  README_MARKER_START,
} from '../constants.js';

export async function handleStatus(options: { cwd?: string }): Promise<void> {
  const cwd = options.cwd ?? process.cwd();

  // Scan for installed personas across all targets
  const installed = new Map<string, Set<string>>(); // persona → targets

  // Check copilot
  const copilotPath = join(cwd, COPILOT_INSTRUCTIONS_PATH);
  const copilotPersonas = await scanSingleFile(copilotPath);
  for (const name of copilotPersonas) {
    const targets = installed.get(name) ?? new Set();
    targets.add('copilot');
    installed.set(name, targets);
  }

  // Check universal
  const universalPath = join(cwd, UNIVERSAL_PERSONA_PATH);
  const universalPersonas = await scanSingleFile(universalPath);
  for (const name of universalPersonas) {
    const targets = installed.get(name) ?? new Set();
    targets.add('universal');
    installed.set(name, targets);
  }

  // Check Claude
  const claudeDir = join(cwd, CLAUDE_RULES_DIR);
  const claudePersonas = await scanClaudeDir(claudeDir);
  for (const name of claudePersonas) {
    const targets = installed.get(name) ?? new Set();
    targets.add('claude');
    installed.set(name, targets);
  }

  // Check README
  const readmePath = join(cwd, README_PATH);
  const readmeContent = await readFileSafe(readmePath);
  const hasReadmePointer = readmeContent?.includes(README_MARKER_START) ?? false;

  // Output
  log.blank();
  console.log(`  ${pc.bold('🔍 Persona Status')}`);
  log.blank();

  if (installed.size === 0) {
    log.warn('No personas installed in this project.');
    log.dim('Run `persona-injector install <persona>` to get started.');
    log.blank();
    return;
  }

  console.log(`  ${pc.bold(pc.white('Installed Personas'))}`);
  console.log(`  ${pc.dim('──────────────────────────────────────────────────')}`);

  for (const [name, targets] of installed) {
    const targetList = [...targets].join(', ');
    console.log(`  ${pc.green('✓')} ${pc.cyan(name.padEnd(14))} → ${pc.dim(targetList)}`);
  }

  log.blank();
  console.log(`  ${pc.bold(pc.white('Target Files'))}`);
  console.log(`  ${pc.dim('──────────────────────────────────────────────────')}`);

  if (copilotPersonas.length > 0) {
    console.log(
      `  ${pc.green('✓')} ${pc.dim(COPILOT_INSTRUCTIONS_PATH.padEnd(38))} (${copilotPersonas.length} personas)`
    );
  }

  if (claudePersonas.length > 0) {
    const claudeFileCount = await getClaudeFileCount(claudeDir);
    console.log(
      `  ${pc.green('✓')} ${pc.dim(`${CLAUDE_RULES_DIR}/`.padEnd(38))} (${claudeFileCount} files)`
    );
  }

  if (universalPersonas.length > 0) {
    console.log(
      `  ${pc.green('✓')} ${pc.dim(UNIVERSAL_PERSONA_PATH.padEnd(38))} (${universalPersonas.length} personas)`
    );
  }

  if (hasReadmePointer) {
    console.log(
      `  ${pc.green('✓')} ${pc.dim(README_PATH.padEnd(38))} (pointer present)`
    );
  }

  log.blank();
}

async function scanSingleFile(filePath: string): Promise<string[]> {
  const content = await readFileSafe(filePath);
  if (!content) return [];

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

async function scanClaudeDir(dirPath: string): Promise<string[]> {
  if (!(await fileExists(dirPath))) return [];

  try {
    const entries = await readdir(dirPath);
    const personaNames = new Set<string>();

    for (const entry of entries) {
      if (entry.startsWith(CLAUDE_PERSONA_PREFIX) && entry.endsWith('.md')) {
        // persona-developer.md → developer
        // persona-developer-workflows.md → developer
        const match = entry.match(/^persona-([^-]+)/);
        if (match) {
          personaNames.add(match[1]);
        }
      }
    }

    return [...personaNames];
  } catch {
    return [];
  }
}

async function getClaudeFileCount(dirPath: string): Promise<number> {
  try {
    const entries = await readdir(dirPath);
    return entries.filter(
      (e) => e.startsWith(CLAUDE_PERSONA_PREFIX) || e.startsWith('_persona')
    ).length;
  } catch {
    return 0;
  }
}
