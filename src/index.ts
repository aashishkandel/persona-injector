// ── Programmatic API ──
// Use persona-injector as a library, not just a CLI.

export { injectPersonas } from './injector.js';
export { removePersonas } from './cleaner.js';
export { getAvailablePersonas, loadPersonaContent, validatePersonaNames } from './registry.js';
export { composeForSingleFile, composeForMultiFile, checkCompatibility } from './composer.js';
export { TARGETS, resolveTargets } from './targets.js';
export type {
  PersonaMeta,
  PersonaContent,
  Registry,
  RegistryEntry,
  InjectionTarget,
  InjectionResult,
  RemovalResult,
  CompositionWarning,
  CompositionResult,
  InstallOptions,
  RemoveOptions,
  StatusEntry,
} from './types.js';
