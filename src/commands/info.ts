// ── Info Command Handler ──

import { log, pc } from '../logger.js';
import { loadPersonaContent } from '../registry.js';
import { PersonaNotFoundError } from '../errors.js';

export async function handleInfo(personaName: string): Promise<void> {
  try {
    const content = await loadPersonaContent(personaName);
    const { meta } = content;

    log.blank();
    console.log(`  ${pc.bold(`🎭 ${capitalize(meta.name)} Persona`)} ${pc.dim(`v${meta.version}`)}`);
    console.log(`  ${pc.dim('─'.repeat(50))}`);
    console.log(`  ${pc.dim('Category:')}   ${meta.category}`);
    console.log(`  ${pc.dim('Tags:')}       ${meta.tags.join(', ')}`);
    console.log(`  ${pc.dim('Compatible:')} ${meta.compatibleWith.join(', ') || 'all'}`);

    if (meta.conflictsWith.length > 0) {
      console.log(`  ${pc.dim('Conflicts:')}  ${pc.yellow(meta.conflictsWith.join(', '))}`);
    }

    if (meta.fileScopes.claude) {
      console.log(`  ${pc.dim('File scope:')} ${meta.fileScopes.claude.join(', ')}`);
    }

    log.blank();
    console.log(`  ${pc.bold(pc.white('── Persona ──'))}`);
    log.blank();
    printIndented(content.persona);

    log.blank();
    console.log(`  ${pc.bold(pc.white('── Workflows ──'))}`);
    log.blank();
    printIndented(content.workflows, 30);

    log.blank();
    console.log(`  ${pc.bold(pc.white('── Checklists ──'))}`);
    log.blank();
    printIndented(content.checklists, 30);

    log.blank();
    console.log(`  ${pc.bold(pc.white('── Anti-Patterns ──'))}`);
    log.blank();
    printIndented(content.antiPatterns, 30);

    log.blank();
    log.dim(`Install: ai-personas install ${meta.name}`);
    log.blank();
  } catch (err) {
    if (err instanceof PersonaNotFoundError) {
      log.error(err.message);
      process.exit(1);
    }
    throw err;
  }
}

function printIndented(text: string, maxLines?: number): void {
  const lines = text.split('\n');
  const displayLines = maxLines ? lines.slice(0, maxLines) : lines;

  for (const line of displayLines) {
    console.log(`  ${line}`);
  }

  if (maxLines && lines.length > maxLines) {
    console.log(`  ${pc.dim(`... (${lines.length - maxLines} more lines)`)}`);
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
