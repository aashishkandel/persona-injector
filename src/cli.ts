#!/usr/bin/env node

// ── persona-injector CLI ──
// Inject domain-specific AI personas into your repo for Copilot, Claude Code & more.

import { Command } from 'commander';
import { handleInstall, handleList, handleRemove, handleInfo, handleStatus } from './commands/index.js';
import { PACKAGE_VERSION } from './constants.js';

const program = new Command();

program
  .name('persona-injector')
  .description(
    'Inject domain-specific AI personas into your repo for GitHub Copilot, Claude Code & more.\n' +
    'Ships workflow-embedded context with checklists, anti-patterns, and file-scoped rules.'
  )
  .version(PACKAGE_VERSION);

// ── install ──
program
  .command('install')
  .description('Install one or more AI personas into the current project')
  .argument('[personas...]', 'Persona names to install (e.g., developer architect qa)')
  .option('-a, --all', 'Install all available personas')
  .option('-f, --force', 'Overwrite existing files instead of merging')
  .option('-t, --targets <targets>', 'Comma-separated target list (copilot,claude,universal)', (v) => v.split(','))
  .option('--dry-run', 'Show what would happen without writing files')
  .action(async (personas: string[], opts) => {
    await handleInstall(personas, {
      all: opts.all,
      force: opts.force,
      targets: opts.targets,
      dryRun: opts.dryRun,
    });
  });

// ── list ──
program
  .command('list')
  .description('List all available AI personas')
  .option('-j, --json', 'Output as JSON')
  .option('-v, --verbose', 'Show tags and additional details')
  .action(async (opts) => {
    await handleList({ json: opts.json, verbose: opts.verbose });
  });

// ── remove ──
program
  .command('remove')
  .description('Remove installed personas from the current project')
  .argument('[personas...]', 'Persona names to remove')
  .option('-a, --all', 'Remove all installed personas')
  .action(async (personas: string[], opts) => {
    await handleRemove(personas, { all: opts.all });
  });

// ── info ──
program
  .command('info')
  .description('Preview a persona\'s full content before installing')
  .argument('<persona>', 'Persona name to preview')
  .action(async (persona: string) => {
    await handleInfo(persona);
  });

// ── status ──
program
  .command('status')
  .description('Show currently installed personas in this project')
  .action(async () => {
    await handleStatus({});
  });

program.parse();
