import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { injectPersonas } from '../src/injector.js';
import { readFileSafe, fileExists } from '../src/fs-utils.js';

describe('Injector', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), 'ai-personas-test-'));
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('should create copilot instructions file', async () => {
    const results = await injectPersonas(['developer'], { cwd: testDir, targets: ['copilot'] });
    const filePath = join(testDir, '.github/copilot-instructions.md');
    const exists = await fileExists(filePath);
    expect(exists).toBe(true);

    const content = await readFileSafe(filePath);
    expect(content).toContain('PERSONA-INJECTOR:developer:START');
    expect(content).toContain('Developer Persona');

    const created = results.filter((r) => r.status === 'created');
    expect(created.length).toBeGreaterThan(0);
  });

  it('should create Claude rule files', async () => {
    await injectPersonas(['developer'], { cwd: testDir, targets: ['claude'] });
    const rulesDir = join(testDir, '.claude/rules');
    expect(await fileExists(join(rulesDir, 'persona-developer.md'))).toBe(true);
    expect(await fileExists(join(rulesDir, 'persona-developer-workflows.md'))).toBe(true);
    expect(await fileExists(join(rulesDir, '_persona-manifest.md'))).toBe(true);
  });

  it('should create universal AI_PERSONA.md', async () => {
    await injectPersonas(['developer'], { cwd: testDir, targets: ['universal'] });
    const filePath = join(testDir, 'AI_PERSONA.md');
    const content = await readFileSafe(filePath);
    expect(content).toContain('Developer Persona');
  });

  it('should be idempotent — no duplicates on re-install', async () => {
    await injectPersonas(['developer'], { cwd: testDir, targets: ['copilot'] });
    await injectPersonas(['developer'], { cwd: testDir, targets: ['copilot'] });

    const content = await readFileSafe(join(testDir, '.github/copilot-instructions.md'));
    const matches = content!.match(/PERSONA-INJECTOR:developer:START/g);
    expect(matches?.length).toBe(1);
  });

  it('should append new personas without losing existing ones', async () => {
    await injectPersonas(['developer'], { cwd: testDir, targets: ['copilot'] });
    await injectPersonas(['architect'], { cwd: testDir, targets: ['copilot'] });

    const content = await readFileSafe(join(testDir, '.github/copilot-instructions.md'));
    expect(content).toContain('PERSONA-INJECTOR:developer:START');
    expect(content).toContain('PERSONA-INJECTOR:architect:START');
  });

  it('should handle dry run without writing files', async () => {
    const results = await injectPersonas(['developer'], { cwd: testDir, dryRun: true });
    const allSkipped = results.every((r) => r.status === 'skipped');
    expect(allSkipped).toBe(true);

    const copilotExists = await fileExists(join(testDir, '.github/copilot-instructions.md'));
    expect(copilotExists).toBe(false);
  });
});
