// ── Injection Target Definitions ──

import type { InjectionTarget } from './types.js';

export const TARGETS: Record<string, InjectionTarget> = {
  copilot: {
    id: 'copilot',
    name: 'GitHub Copilot',
    type: 'single-file',
    description: '.github/copilot-instructions.md',
  },
  claude: {
    id: 'claude',
    name: 'Claude Code',
    type: 'multi-file',
    description: '.claude/rules/persona-*.md',
  },
  universal: {
    id: 'universal',
    name: 'Universal (AI_PERSONA.md)',
    type: 'single-file',
    description: 'AI_PERSONA.md',
  },
};

export const DEFAULT_TARGET_IDS = Object.keys(TARGETS);

export function resolveTargets(targetIds?: string[]): InjectionTarget[] {
  const ids = targetIds ?? DEFAULT_TARGET_IDS;
  return ids.map((id) => {
    const target = TARGETS[id];
    if (!target) {
      throw new Error(`Unknown target: "${id}". Valid targets: ${DEFAULT_TARGET_IDS.join(', ')}`);
    }
    return target;
  });
}
