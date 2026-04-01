// ── List Command Handler ──

import { log, pc } from '../logger.js';
import { getAvailablePersonas } from '../registry.js';

export async function handleList(options: { json?: boolean; verbose?: boolean }): Promise<void> {
  const personas = await getAvailablePersonas();

  if (options.json) {
    console.log(JSON.stringify(personas, null, 2));
    return;
  }

  log.blank();
  console.log(`  ${pc.bold('🎭 Available Personas')}`);
  log.blank();

  // Group by category
  const core = personas.filter((p) => p.category === 'core');
  const domain = personas.filter((p) => p.category === 'domain');

  if (core.length > 0) {
    console.log(`  ${pc.bold(pc.white('Core Roles'))}`);
    console.log(`  ${pc.dim('──────────────────────────────────────────────────')}`);
    for (const p of core) {
      const name = pc.cyan(p.name.padEnd(14));
      const desc = pc.dim(p.description);
      console.log(`  ${name} ${desc}`);
      if (options.verbose) {
        console.log(`  ${' '.repeat(14)} ${pc.dim(`tags: ${p.tags.join(', ')}`)}`);
      }
    }
  }

  log.blank();

  if (domain.length > 0) {
    console.log(`  ${pc.bold(pc.white('Domain Verticals'))}`);
    console.log(`  ${pc.dim('──────────────────────────────────────────────────')}`);
    for (const p of domain) {
      const name = pc.cyan(p.name.padEnd(14));
      const desc = pc.dim(p.description);
      console.log(`  ${name} ${desc}`);
      if (options.verbose) {
        console.log(`  ${' '.repeat(14)} ${pc.dim(`tags: ${p.tags.join(', ')}`)}`);
      }
    }
  }

  log.blank();
  log.dim(`Install: persona-injector install <name> [<name2> ...]`);
  log.dim(`Install all: persona-injector install --all`);
  log.blank();
}
