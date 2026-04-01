// ── Constants for persona-injector ──

export const MARKER_START = (persona: string): string =>
  `<!-- PERSONA-INJECTOR:${persona}:START -->`;

export const MARKER_END = (persona: string): string =>
  `<!-- PERSONA-INJECTOR:${persona}:END -->`;

export const MANIFEST_MARKER_START = '<!-- PERSONA-INJECTOR:MANIFEST:START -->';
export const MANIFEST_MARKER_END = '<!-- PERSONA-INJECTOR:MANIFEST:END -->';

export const README_MARKER_START = '<!-- PERSONA-INJECTOR:README:START -->';
export const README_MARKER_END = '<!-- PERSONA-INJECTOR:README:END -->';

export const README_POINTER = [
  '',
  README_MARKER_START,
  '',
  '---',
  '',
  '> 🤖 **AI Context:** This repository uses injected AI personas via [persona-injector](https://github.com/aashishkandel/persona-injector). AI assistants should review [AI_PERSONA.md](./AI_PERSONA.md) before writing code.',
  '',
  README_MARKER_END,
].join('\n');

export const PACKAGE_VERSION = '1.0.0';

export const PERSONAS_DIR_NAME = 'personas';

export const CLAUDE_RULES_DIR = '.claude/rules';
export const CURSOR_RULES_DIR = '.cursor/rules';
export const WINDSURF_RULES_DIR = '.windsurf/rules';
export const AGY_RULES_DIR = '.agents/rules';
export const COPILOT_INSTRUCTIONS_PATH = '.github/copilot-instructions.md';
export const UNIVERSAL_PERSONA_PATH = 'AI_PERSONA.md';
export const README_PATH = 'README.md';

export const MULTI_FILE_PERSONA_PREFIX = 'persona-';
export const MULTI_FILE_MANIFEST_FILE = '_persona-manifest.md';
