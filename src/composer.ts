// ── Persona Composition Engine ──
// Assembles multi-persona content with conflict detection and target-specific formatting.

import {
	MANIFEST_MARKER_END,
	MANIFEST_MARKER_START,
	MARKER_END,
	MARKER_START,
	MULTI_FILE_MANIFEST_FILE,
	PACKAGE_VERSION,
} from "./constants.js";
import { loadPersonaContent, loadPersonaMeta } from "./registry.js";
import type {
	CompositionResult,
	CompositionWarning,
	PersonaContent,
} from "./types.js";

/**
 * Check for compatibility warnings between personas.
 */
export async function checkCompatibility(
	personaNames: string[],
): Promise<CompositionWarning[]> {
	const warnings: CompositionWarning[] = [];
	const metas = await Promise.all(personaNames.map((n) => loadPersonaMeta(n)));

	for (let i = 0; i < metas.length; i++) {
		const meta = metas[i];

		// Check explicit conflicts
		for (const conflicting of meta.conflictsWith) {
			if (personaNames.includes(conflicting)) {
				warnings.push({
					type: "conflict",
					personas: [meta.name, conflicting],
					message: `"${meta.name}" has a declared conflict with "${conflicting}". Both will be installed, but review their guidance for contradictions.`,
				});
			}
		}

		// Check overlap recommendations
		for (let j = i + 1; j < metas.length; j++) {
			const other = metas[j];
			const sharedTags = meta.tags.filter((t) => other.tags.includes(t));
			if (sharedTags.length >= 2) {
				warnings.push({
					type: "overlap",
					personas: [meta.name, other.name],
					message: `"${meta.name}" and "${other.name}" share focus areas (${sharedTags.join(", ")}). Both perspectives will be active for comprehensive coverage.`,
				});
			}
		}
	}

	// Deduplicate conflict warnings (A→B and B→A are the same)
	const seen = new Set<string>();
	return warnings.filter((w) => {
		const key = [...w.personas].sort().join("|") + w.type;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

/**
 * Generate a manifest header for single-file targets.
 */
function generateManifest(personaNames: string[]): string {
	const nav = personaNames
		.map((n) => `- [${capitalize(n)} Persona](#${n})`)
		.join("\n");

	return [
		MANIFEST_MARKER_START,
		`# Active AI Personas`,
		``,
		`> Installed by [AI-Personas](https://github.com/aashishkandel/ai-personas) v${PACKAGE_VERSION}`,
		`> Personas: ${personaNames.join(", ")}`,
		``,
		`## Navigation`,
		nav,
		``,
		MANIFEST_MARKER_END,
	].join("\n");
}

/**
 * Wrap a persona's full content in markers for single-file targets.
 */
function wrapPersonaForSingleFile(
	name: string,
	content: PersonaContent,
): string {
	const sections = [
		content.persona,
		"",
		`## ${capitalize(name)} — Workflows`,
		"",
		content.workflows,
		"",
		`## ${capitalize(name)} — Quality Gates & Checklists`,
		"",
		content.checklists,
		"",
		`## ${capitalize(name)} — Anti-Patterns to Catch`,
		"",
		content.antiPatterns,
	].join("\n");

	return [MARKER_START(name), sections, MARKER_END(name)].join("\n");
}

/**
 * Compose content for a single-file target (copilot, universal).
 */
export async function composeForSingleFile(
	personaNames: string[],
): Promise<CompositionResult> {
	const contents = await Promise.all(
		personaNames.map((n) => loadPersonaContent(n)),
	);
	const warnings = await checkCompatibility(personaNames);

	const manifest = generateManifest(personaNames);
	const personaSections = contents.map((c) =>
		wrapPersonaForSingleFile(c.meta.name, c),
	);

	const fullContent = [manifest, "", ...personaSections].join("\n\n");

	return {
		content: fullContent,
		warnings,
		fileCount: 1,
	};
}

/**
 * Generate individual rule files for multi-file structures.
 * Returns a map of filename → content.
 */
export async function composeForMultiFile(
	personaNames: string[],
	targetId: string,
	extension: string = ".md",
): Promise<{ files: Map<string, string>; warnings: CompositionWarning[] }> {
	const contents = await Promise.all(
		personaNames.map((n) => loadPersonaContent(n)),
	);
	const warnings = await checkCompatibility(personaNames);
	const files = new Map<string, string>();

	for (const content of contents) {
		const { meta } = content;
		const fileScopes = meta.fileScopes as Record<
			string,
			string[] | null | undefined
		>;
		const targetScopes = fileScopes[targetId] || fileScopes.claude;
		const scopeFrontmatter = targetScopes
			? [
					"---",
					"paths:",
					...targetScopes.map((p) => `  - "${p}"`),
					"---",
					"",
				].join("\n")
			: "";

		// Main persona file
		files.set(
			`persona-${meta.name}${extension}`,
			scopeFrontmatter + content.persona,
		);

		// Workflows
		files.set(
			`persona-${meta.name}-workflows${extension}`,
			scopeFrontmatter +
				`# ${capitalize(meta.name)} — Workflows\n\n` +
				content.workflows,
		);

		// Checklists
		files.set(
			`persona-${meta.name}-checklists${extension}`,
			scopeFrontmatter +
				`# ${capitalize(meta.name)} — Quality Gates & Checklists\n\n` +
				content.checklists,
		);

		// Anti-patterns
		files.set(
			`persona-${meta.name}-anti-patterns${extension}`,
			scopeFrontmatter +
				`# ${capitalize(meta.name)} — Anti-Patterns\n\n` +
				content.antiPatterns,
		);
	}

	// Generate manifest
	const manifestContent = [
		"# AI-Personas — Installed Personas",
		"",
		`> Generated by [AI-Personas](https://github.com/aashishkandel/ai-personas) v${PACKAGE_VERSION}`,
		`> Installed: ${new Date().toISOString()}`,
		"",
		"## Active Personas",
		"",
		...contents.map(
			(c) =>
				`- **${capitalize(c.meta.name)}** — ${c.meta.description} (${c.meta.category})`,
		),
		"",
		"## Files",
		"",
		...[...files.keys()].map((f) => `- \`${f}\``),
	].join("\n");
	files.set(MULTI_FILE_MANIFEST_FILE, manifestContent);

	return { files, warnings };
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
