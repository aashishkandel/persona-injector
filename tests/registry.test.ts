import { describe, it, expect } from 'vitest';
import {
  loadRegistry,
  getAvailablePersonas,
  loadPersonaMeta,
  loadPersonaContent,
  validatePersonaNames,
  getAllPersonaNames,
} from '../src/registry.js';

describe('Registry', () => {
  it('should load the registry manifest', async () => {
    const registry = await loadRegistry();
    expect(registry.version).toBe('1.0.0');
    expect(registry.personas).toBeInstanceOf(Array);
    expect(registry.personas.length).toBe(9);
  });

  it('should list all 9 personas', async () => {
    const personas = await getAvailablePersonas();
    const names = personas.map((p) => p.name);
    expect(names).toContain('developer');
    expect(names).toContain('architect');
    expect(names).toContain('qa');
    expect(names).toContain('designer');
    expect(names).toContain('devops');
    expect(names).toContain('security');
    expect(names).toContain('fintech');
    expect(names).toContain('healthtech');
    expect(names).toContain('gamedev');
  });

  it('should load valid persona metadata', async () => {
    const meta = await loadPersonaMeta('developer');
    expect(meta.name).toBe('developer');
    expect(meta.category).toBe('core');
    expect(meta.sections).toContain('persona');
    expect(meta.sections).toContain('workflows');
    expect(meta.sections).toContain('checklists');
    expect(meta.sections).toContain('anti-patterns');
  });

  it('should load all sections for a persona', async () => {
    const content = await loadPersonaContent('developer');
    expect(content.meta.name).toBe('developer');
    expect(content.persona).toContain('Developer Persona');
    expect(content.workflows).toContain('Developer Workflows');
    expect(content.checklists).toContain('Developer Quality Gates');
    expect(content.antiPatterns).toContain('Developer Anti-Patterns');
  });

  it('should load all 9 personas without error', async () => {
    const names = await getAllPersonaNames();
    for (const name of names) {
      const content = await loadPersonaContent(name);
      expect(content.meta.name).toBe(name);
      expect(content.persona.length).toBeGreaterThan(100);
      expect(content.workflows.length).toBeGreaterThan(100);
      expect(content.checklists.length).toBeGreaterThan(100);
      expect(content.antiPatterns.length).toBeGreaterThan(100);
    }
  });

  it('should validate persona names correctly', async () => {
    const result = await validatePersonaNames(['developer', 'invalid-name', 'qa']);
    expect(result.valid).toContain('developer');
    expect(result.valid).toContain('qa');
    expect(result.invalid).toContain('invalid-name');
  });

  it('should throw for non-existent persona', async () => {
    await expect(loadPersonaMeta('nonexistent')).rejects.toThrow('not found');
  });
});
