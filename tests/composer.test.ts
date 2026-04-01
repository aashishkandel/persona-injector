import { describe, it, expect } from 'vitest';
import { composeForSingleFile, composeForClaudeMultiFile, checkCompatibility } from '../src/composer.js';

describe('Composer', () => {
  it('should compose a single persona for single-file target', async () => {
    const result = await composeForSingleFile(['developer']);
    expect(result.content).toContain('PERSONA-INJECTOR:MANIFEST:START');
    expect(result.content).toContain('PERSONA-INJECTOR:developer:START');
    expect(result.content).toContain('PERSONA-INJECTOR:developer:END');
    expect(result.content).toContain('Developer Persona');
    expect(result.fileCount).toBe(1);
  });

  it('should compose multiple personas for single-file target', async () => {
    const result = await composeForSingleFile(['developer', 'architect', 'qa']);
    expect(result.content).toContain('PERSONA-INJECTOR:developer:START');
    expect(result.content).toContain('PERSONA-INJECTOR:architect:START');
    expect(result.content).toContain('PERSONA-INJECTOR:qa:START');
    expect(result.content).toContain('Personas: developer, architect, qa');
  });

  it('should generate Claude multi-file output with proper filenames', async () => {
    const { files } = await composeForClaudeMultiFile(['developer']);
    expect(files.has('persona-developer.md')).toBe(true);
    expect(files.has('persona-developer-workflows.md')).toBe(true);
    expect(files.has('persona-developer-checklists.md')).toBe(true);
    expect(files.has('persona-developer-anti-patterns.md')).toBe(true);
    expect(files.has('_persona-manifest.md')).toBe(true);
  });

  it('should include paths frontmatter in Claude files when scoped', async () => {
    const { files } = await composeForClaudeMultiFile(['developer']);
    const personaFile = files.get('persona-developer.md')!;
    expect(personaFile).toContain('---');
    expect(personaFile).toContain('paths:');
    expect(personaFile).toContain('**/*.ts');
  });

  it('should not include paths frontmatter for globally-scoped personas', async () => {
    const { files } = await composeForClaudeMultiFile(['architect']);
    const personaFile = files.get('persona-architect.md')!;
    expect(personaFile).not.toContain('paths:');
  });

  it('should return warnings for persona combinations', async () => {
    // developer has tags: code-quality, testing, performance, clean-code
    // qa has tags: testing, edge-cases, validation, reliability
    // They share 1 tag ("testing") — below the 2-tag threshold for overlap warning
    const noOverlapWarnings = await checkCompatibility(['developer', 'qa']);
    const overlapWarning = noOverlapWarnings.find(
      (w) => w.type === 'overlap' && w.personas.includes('developer') && w.personas.includes('qa')
    );
    // With only 1 shared tag, no overlap warning should fire
    expect(overlapWarning).toBeUndefined();

    // Verify no errors when checking any combination
    const allWarnings = await checkCompatibility(['developer', 'architect', 'qa', 'security']);
    expect(allWarnings).toBeInstanceOf(Array);
  });
});
