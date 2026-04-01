// ── Remove Command Handler ──

import { log, createSpinner, pc } from '../logger.js';
import { getAllPersonaNames } from '../registry.js';
import { removePersonas } from '../cleaner.js';
import type { RemoveOptions } from '../types.js';

export async function handleRemove(
  personaNames: string[],
  options: RemoveOptions
): Promise<void> {
  // If --all, we need to find what's installed, but for safety we try all known names
  if (options.all) {
    personaNames = await getAllPersonaNames();
  }

  if (personaNames.length === 0) {
    log.error('No personas specified. Provide persona names or use --all flag.');
    process.exit(1);
  }

  const spinner = createSpinner(`Removing ${personaNames.length} persona${personaNames.length > 1 ? 's' : ''}...`);
  spinner.start();

  try {
    const results = await removePersonas(personaNames, options);
    spinner.stop();

    const removed = results.filter((r) => r.status === 'removed' || r.status === 'deleted');

    if (removed.length === 0) {
      log.warn('No persona files were found to remove.');
      return;
    }

    log.header('Removal Results');

    // Group by target
    const byTarget = new Map<string, typeof results>();
    for (const r of results) {
      if (r.status === 'skipped') continue;
      const group = byTarget.get(r.target) ?? [];
      group.push(r);
      byTarget.set(r.target, group);
    }

    for (const [target, targetResults] of byTarget) {
      log.blank();
      console.log(`  ${pc.bold(getTargetLabel(target))}`);
      for (const r of targetResults) {
        const icon = pc.green('✓');
        const action = r.status === 'deleted' ? 'deleted' : 'removed section';
        const file = r.filePath.split('/').pop() ?? r.filePath;
        console.log(`    ${icon} ${file} ${pc.dim(`(${action})`)}`);
      }
    }

    log.blank();
    log.success(
      `Done! Removed ${new Set(removed.map((r) => r.persona)).size} persona${removed.length > 1 ? 's' : ''} from ${removed.length} file${removed.length > 1 ? 's' : ''}.`
    );
    log.blank();
  } catch (err) {
    spinner.stop();
    log.error(`Removal failed: ${(err as Error).message}`);
    process.exit(1);
  }
}

function getTargetLabel(targetId: string): string {
  const labels: Record<string, string> = {
    copilot: 'GitHub Copilot',
    claude: 'Claude Code',
    universal: 'Universal (AI_PERSONA.md)',
  };
  return labels[targetId] ?? targetId;
}
