// ── Status Command Handler ──

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import {
	AGY_RULES_DIR,
	CLAUDE_RULES_DIR,
	COPILOT_INSTRUCTIONS_PATH,
	CURSOR_RULES_DIR,
	extractPersonaNamesFromMarkers,
	MULTI_FILE_PERSONA_PREFIX,
	README_MARKER_START,
	README_PATH,
	UNIVERSAL_PERSONA_PATH,
	WINDSURF_RULES_DIR,
} from "../constants.js";
import { fileExists, readFileSafe } from "../fs-utils.js";
import { log, pc } from "../logger.js";

export async function handleStatus(options: { cwd?: string }): Promise<void> {
	const cwd = options.cwd ?? process.cwd();

	// Scan for installed personas across all targets
	const installed = new Map<string, Set<string>>(); // persona → targets

	// Check copilot
	const copilotPath = join(cwd, COPILOT_INSTRUCTIONS_PATH);
	const copilotPersonas = await scanSingleFile(copilotPath);
	for (const name of copilotPersonas) {
		const targets = installed.get(name) ?? new Set();
		targets.add("copilot");
		installed.set(name, targets);
	}

	// Check universal
	const universalPath = join(cwd, UNIVERSAL_PERSONA_PATH);
	const universalPersonas = await scanSingleFile(universalPath);
	for (const name of universalPersonas) {
		const targets = installed.get(name) ?? new Set();
		targets.add("universal");
		installed.set(name, targets);
	}

	// Check Multi-file targets
	const multiTargets = [
		{ dir: CLAUDE_RULES_DIR, id: "claude" },
		{ dir: CURSOR_RULES_DIR, id: "cursor" },
		{ dir: WINDSURF_RULES_DIR, id: "windsurf" },
		{ dir: AGY_RULES_DIR, id: "agy" },
	];

	const multiStats = new Map<string, { personas: string[]; count: number }>();

	for (const { dir, id } of multiTargets) {
		const targetDir = join(cwd, dir);
		const personas = await scanMultiDir(targetDir);
		for (const name of personas) {
			const targets = installed.get(name) ?? new Set();
			targets.add(id);
			installed.set(name, targets);
		}
		if (personas.length > 0) {
			multiStats.set(dir, {
				personas,
				count: await getMultiFileCount(targetDir),
			});
		}
	}

	// Check README
	const readmePath = join(cwd, README_PATH);
	const readmeContent = await readFileSafe(readmePath);
	const hasReadmePointer =
		readmeContent?.includes(README_MARKER_START) ?? false;

	// Output
	log.blank();
	console.log(`  ${pc.bold("🔍 Persona Status")}`);
	log.blank();

	if (installed.size === 0) {
		log.warn("No personas installed in this project.");
		log.dim("Run `ai-personas install <persona>` to get started.");
		log.blank();
		return;
	}

	console.log(`  ${pc.bold(pc.white("Installed Personas"))}`);
	console.log(
		`  ${pc.dim("──────────────────────────────────────────────────")}`,
	);

	for (const [name, targets] of installed) {
		const targetList = [...targets].join(", ");
		console.log(
			`  ${pc.green("✓")} ${pc.cyan(name.padEnd(14))} → ${pc.dim(targetList)}`,
		);
	}

	log.blank();
	console.log(`  ${pc.bold(pc.white("Target Files"))}`);
	console.log(
		`  ${pc.dim("──────────────────────────────────────────────────")}`,
	);

	if (copilotPersonas.length > 0) {
		console.log(
			`  ${pc.green("✓")} ${pc.dim(COPILOT_INSTRUCTIONS_PATH.padEnd(38))} (${copilotPersonas.length} personas)`,
		);
	}

	for (const [dir, stats] of multiStats) {
		console.log(
			`  ${pc.green("✓")} ${pc.dim(`${dir}/`.padEnd(38))} (${stats.count} files)`,
		);
	}

	if (universalPersonas.length > 0) {
		console.log(
			`  ${pc.green("✓")} ${pc.dim(UNIVERSAL_PERSONA_PATH.padEnd(38))} (${universalPersonas.length} personas)`,
		);
	}

	if (hasReadmePointer) {
		console.log(
			`  ${pc.green("✓")} ${pc.dim(README_PATH.padEnd(38))} (pointer present)`,
		);
	}

	log.blank();
}

async function scanSingleFile(filePath: string): Promise<string[]> {
	const content = await readFileSafe(filePath);
	if (!content) return [];
	return extractPersonaNamesFromMarkers(content);
}

async function scanMultiDir(dirPath: string): Promise<string[]> {
	if (!(await fileExists(dirPath))) return [];

	try {
		const entries = await readdir(dirPath);
		const personaNames = new Set<string>();

		for (const entry of entries) {
			if (
				entry.startsWith(MULTI_FILE_PERSONA_PREFIX) &&
				(entry.endsWith(".md") || entry.endsWith(".mdc"))
			) {
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

async function getMultiFileCount(dirPath: string): Promise<number> {
	try {
		const entries = await readdir(dirPath);
		return entries.filter(
			(e) =>
				e.startsWith(MULTI_FILE_PERSONA_PREFIX) || e.startsWith("_persona"),
		).length;
	} catch {
		return 0;
	}
}
