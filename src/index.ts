// ── Programmatic API ──
// Use ai-personas as a library, not just a CLI.

export { removePersonas } from "./cleaner.js";
export {
	checkCompatibility,
	composeForMultiFile,
	composeForSingleFile,
} from "./composer.js";
export { injectPersonas } from "./injector.js";
export {
	getAvailablePersonas,
	loadPersonaContent,
	validatePersonaNames,
} from "./registry.js";
export { resolveTargets, TARGETS } from "./targets.js";
export type {
	CompositionResult,
	CompositionWarning,
	InjectionResult,
	InjectionTarget,
	InstallOptions,
	PersonaContent,
	PersonaMeta,
	Registry,
	RegistryEntry,
	RemovalResult,
	RemoveOptions,
	StatusEntry,
} from "./types.js";
