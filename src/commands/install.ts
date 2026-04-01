// ── Install Command Handler ──

import { log, createSpinner, pc } from '../logger.js';
import { validatePersonaNames, getAllPersonaNames } from '../registry.js';
import { checkCompatibility } from '../composer.js';
import { injectPersonas } from '../injector.js';
import type { InstallOptions } from '../types.js';

export async function handleInstall(
  personaNames: string[],
  options: InstallOptions
): Promise<void> {
  // If --all, get all persona names
  if (options.all) {
    personaNames = await getAllPersonaNames();
  }

  if (personaNames.length === 0) {
    log.error('No personas specified. Use persona names or --all flag.');
    log.dim('Run `persona-injector list` to see available personas.');
    process.exit(1);
  }

  // Validate names
  const { valid, invalid } = await validatePersonaNames(personaNames);

  if (invalid.length > 0) {
    for (const name of invalid) {
      log.error(`Persona "${name}" not found.`);
    }
    log.dim('Run `persona-injector list` to see available personas.');
    if (valid.length === 0) process.exit(1);
  }

  const spinner = createSpinner(`Loading ${valid.length} persona${valid.length > 1 ? 's' : ''}...`);
  spinner.start();

  try {
    // Check compatibility
    const warnings = await checkCompatibility(valid);
    spinner.stop();

    log.success(`Loaded ${valid.length} persona${valid.length > 1 ? 's' : ''}: ${pc.cyan(valid.join(', '))}`);

    // Display composition warnings
    if (warnings.length > 0) {
      log.blank();
      log.info('Composition Notes:');
      for (const w of warnings) {
        const icon = w.type === 'conflict' ? pc.red('⚠') : pc.yellow('ℹ');
        console.log(`    ${icon} ${w.message}`);
      }
    }

    // Inject
    if (options.dryRun) {
      log.blank();
      log.info(pc.yellow('Dry run — no files will be written'));
    }

    const results = await injectPersonas(valid, options);

    // Group results by target
    const byTarget = new Map<string, typeof results>();
    for (const r of results) {
      const group = byTarget.get(r.target) ?? [];
      group.push(r);
      byTarget.set(r.target, group);
    }

    for (const [target, targetResults] of byTarget) {
      log.blank();
      log.header(`Injecting into ${getTargetLabel(target)}...`);

      for (const r of targetResults) {
        const statusIcon = r.status === 'error' ? pc.red('✗') : pc.green('✓');
        const statusLabel = pc.dim(`(${r.status})`);
        const scopeInfo = r.target === 'claude' && r.filePath
          ? pc.dim(r.filePath.split('/').pop() ?? '')
          : '';
        console.log(`    ${statusIcon} ${scopeInfo || r.filePath} ${statusLabel}`);
      }
    }

    // Summary
    const fileCount = results.filter((r) => r.status !== 'skipped').length;
    log.blank();
    log.success(
      `Done! ${valid.length} persona${valid.length > 1 ? 's' : ''} → ${fileCount} files injected.`
    );
    log.dim(
      `Your AI assistant now thinks as ${valid.map((n) => capitalize(n)).join(' + ')}.`
    );
    log.blank();
  } catch (err) {
    spinner.stop();
    log.error(`Installation failed: ${(err as Error).message}`);
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
