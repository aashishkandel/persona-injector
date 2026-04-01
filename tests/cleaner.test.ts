import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { removePersonas } from "../src/cleaner.js";
import { fileExists, readFileSafe } from "../src/fs-utils.js";
import { injectPersonas } from "../src/injector.js";

describe("Cleaner", () => {
	let testDir: string;

	beforeEach(async () => {
		testDir = await mkdtemp(join(tmpdir(), "ai-personas-clean-"));
	});

	afterEach(async () => {
		await rm(testDir, { recursive: true, force: true });
	});

	it("should remove a persona from copilot instructions", async () => {
		await injectPersonas(["developer", "architect"], {
			cwd: testDir,
			targets: ["copilot"],
		});
		await removePersonas(["developer"], { cwd: testDir });

		const content = await readFileSafe(
			join(testDir, ".github/copilot-instructions.md"),
		);
		expect(content).not.toContain("AI-PERSONAS:developer:START");
		expect(content).toContain("AI-PERSONAS:architect:START");
	});

	it("should delete Claude rule files on removal", async () => {
		await injectPersonas(["developer"], { cwd: testDir, targets: ["claude"] });
		const results = await removePersonas(["developer"], { cwd: testDir });

		const deletedResults = results.filter((r) => r.status === "deleted");
		expect(deletedResults.length).toBeGreaterThan(0);

		const personaFile = join(testDir, ".claude/rules/persona-developer.md");
		expect(await fileExists(personaFile)).toBe(false);
	});

	it("should delete file when last persona is removed", async () => {
		await injectPersonas(["developer"], {
			cwd: testDir,
			targets: ["universal"],
		});
		await removePersonas(["developer"], { cwd: testDir });

		const universalFile = join(testDir, "AI_PERSONA.md");
		expect(await fileExists(universalFile)).toBe(false);
	});

	it("should skip removal when persona is not installed", async () => {
		const results = await removePersonas(["developer"], { cwd: testDir });
		const skipped = results.filter((r) => r.status === "skipped");
		expect(skipped.length).toBeGreaterThan(0);
	});
});
