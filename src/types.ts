// ── Type Definitions for ai-personas ──

export interface PersonaMeta {
	name: string;
	version: string;
	category: "core" | "domain";
	description: string;
	tags: string[];
	compatibleWith: string[];
	conflictsWith: string[];
	fileScopes: {
		claude: string[] | null;
		copilot: string[] | null;
		cursor?: string[] | null;
		windsurf?: string[] | null;
		agy?: string[] | null;
	};
	sections: string[];
}

export interface PersonaContent {
	meta: PersonaMeta;
	persona: string;
	workflows: string;
	checklists: string;
	antiPatterns: string;
}

export interface RegistryEntry {
	name: string;
	description: string;
	category: "core" | "domain";
	tags: string[];
	version: string;
}

export interface Registry {
	version: string;
	personas: RegistryEntry[];
}

export interface InjectionTarget {
	id: string;
	name: string;
	type: "single-file" | "multi-file";
	description: string;
}

export interface InjectionResult {
	target: string;
	persona: string;
	status: "created" | "appended" | "replaced" | "skipped" | "error";
	filePath: string;
	message?: string;
}

export interface RemovalResult {
	target: string;
	persona: string;
	status: "removed" | "deleted" | "skipped" | "error";
	filePath: string;
	message?: string;
}

export interface CompositionWarning {
	type: "conflict" | "overlap" | "recommendation";
	personas: string[];
	message: string;
}

export interface CompositionResult {
	content: string;
	warnings: CompositionWarning[];
	fileCount: number;
}

export interface PersonaManifest {
	installedAt: string;
	personas: string[];
	version: string;
}

export interface InstallOptions {
	force?: boolean;
	targets?: string[];
	dryRun?: boolean;
	cwd?: string;
	all?: boolean;
}

export interface RemoveOptions {
	cwd?: string;
	all?: boolean;
}

export interface StatusEntry {
	persona: string;
	targets: string[];
}
