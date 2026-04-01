// ── Constants for ai-personas ──

export const MARKER_START = (persona: string): string =>
	`<!-- AI-PERSONAS:${persona}:START -->`;

export const MARKER_END = (persona: string): string =>
	`<!-- AI-PERSONAS:${persona}:END -->`;

export const MANIFEST_MARKER_START = "<!-- AI-PERSONAS:MANIFEST:START -->";
export const MANIFEST_MARKER_END = "<!-- AI-PERSONAS:MANIFEST:END -->";

export const README_MARKER_START = "<!-- AI-PERSONAS:README:START -->";
export const README_MARKER_END = "<!-- AI-PERSONAS:README:END -->";

export const README_POINTER = [
	"",
	README_MARKER_START,
	"",
	"---",
	"",
	"> 🤖 **AI Context:** This repository uses injected AI personas via [ai-personas](https://github.com/aashishkandel/ai-personas). AI assistants should review [AI_PERSONA.md](./AI_PERSONA.md) before writing code.",
	"",
	README_MARKER_END,
].join("\n");

export const PACKAGE_VERSION = "1.0.0";

export const PERSONAS_DIR_NAME = "personas";

export const CLAUDE_RULES_DIR = ".claude/rules";
export const CURSOR_RULES_DIR = ".cursor/rules";
export const WINDSURF_RULES_DIR = ".windsurf/rules";
export const AGY_RULES_DIR = ".agents/rules";
export const COPILOT_INSTRUCTIONS_PATH = ".github/copilot-instructions.md";
export const UNIVERSAL_PERSONA_PATH = "AI_PERSONA.md";
export const README_PATH = "README.md";

export const MULTI_FILE_PERSONA_PREFIX = "persona-";
export const MULTI_FILE_MANIFEST_FILE = "_persona-manifest.md";

/**
 * Extract persona names embedded in AI-PERSONAS marker comments.
 * Skips synthetic markers like MANIFEST and README.
 */
export function extractPersonaNamesFromMarkers(content: string): string[] {
	const EXCLUDED = new Set(["MANIFEST", "README"]);
	return [...content.matchAll(/<!-- AI-PERSONAS:(\w+):START -->/g)]
		.map((m) => m[1])
		.filter((name) => !EXCLUDED.has(name));
}
