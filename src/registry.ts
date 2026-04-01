// ── Local Registry — Reads bundled personas ──

import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PersonaMeta, PersonaContent, Registry, RegistryEntry } from './types.js';
import { PersonaNotFoundError, PersonaLoadError } from './errors.js';
import { PERSONAS_DIR_NAME } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Resolve the absolute path to the bundled personas directory.
 * Works both in development (src/) and when installed (dist/).
 */
function getPersonasDir(): string {
  // When built, __dirname is dist/. Personas are at ../personas/
  // When running from src/ in dev, __dirname is src/. Personas are at ../personas/
  return join(__dirname, '..', PERSONAS_DIR_NAME);
}

/**
 * Load the registry manifest.
 */
export async function loadRegistry(): Promise<Registry> {
  const registryPath = join(getPersonasDir(), 'registry.json');
  const content = await readFile(registryPath, 'utf-8');
  return JSON.parse(content) as Registry;
}

/**
 * Get all available persona entries.
 */
export async function getAvailablePersonas(): Promise<RegistryEntry[]> {
  const registry = await loadRegistry();
  return registry.personas;
}

/**
 * Load a persona's meta.json.
 */
export async function loadPersonaMeta(name: string): Promise<PersonaMeta> {
  const metaPath = join(getPersonasDir(), name, 'meta.json');
  try {
    const content = await readFile(metaPath, 'utf-8');
    return JSON.parse(content) as PersonaMeta;
  } catch {
    throw new PersonaNotFoundError(name);
  }
}

/**
 * Load a single section of a persona.
 */
async function loadSection(name: string, section: string): Promise<string> {
  const sectionMap: Record<string, string> = {
    persona: 'persona.md',
    workflows: 'workflows.md',
    checklists: 'checklists.md',
    'anti-patterns': 'anti-patterns.md',
  };

  const fileName = sectionMap[section];
  if (!fileName) {
    throw new PersonaLoadError(name, section, new Error(`Unknown section: ${section}`));
  }

  const filePath = join(getPersonasDir(), name, fileName);
  try {
    return await readFile(filePath, 'utf-8');
  } catch (err) {
    throw new PersonaLoadError(name, section, err as Error);
  }
}

/**
 * Load full persona content (all sections).
 */
export async function loadPersonaContent(name: string): Promise<PersonaContent> {
  const meta = await loadPersonaMeta(name);

  const [persona, workflows, checklists, antiPatterns] = await Promise.all([
    loadSection(name, 'persona'),
    loadSection(name, 'workflows'),
    loadSection(name, 'checklists'),
    loadSection(name, 'anti-patterns'),
  ]);

  return { meta, persona, workflows, checklists, antiPatterns };
}

/**
 * Validate persona names against the registry.
 */
export async function validatePersonaNames(
  names: string[]
): Promise<{ valid: string[]; invalid: string[] }> {
  const registry = await loadRegistry();
  const available = new Set(registry.personas.map((p) => p.name));

  const valid: string[] = [];
  const invalid: string[] = [];

  for (const name of names) {
    if (available.has(name)) {
      valid.push(name);
    } else {
      invalid.push(name);
    }
  }

  return { valid, invalid };
}

/**
 * Get all persona names from the registry.
 */
export async function getAllPersonaNames(): Promise<string[]> {
  const registry = await loadRegistry();
  return registry.personas.map((p) => p.name);
}

/**
 * List persona directories on disk (fallback if registry.json missing).
 */
export async function listPersonaDirs(): Promise<string[]> {
  const personasDir = getPersonasDir();
  const entries = await readdir(personasDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}
