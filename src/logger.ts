// ── Terminal Output & Spinner Utilities ──

import pc from "picocolors";
import yoctoSpinner from "yocto-spinner";

export const log = {
	success: (msg: string): void => {
		console.log(`  ${pc.green("✓")} ${msg}`);
	},

	error: (msg: string): void => {
		console.log(`  ${pc.red("✗")} ${msg}`);
	},

	warn: (msg: string): void => {
		console.log(`  ${pc.yellow("⚠")} ${msg}`);
	},

	info: (msg: string): void => {
		console.log(`  ${pc.blue("ℹ")} ${msg}`);
	},

	dim: (msg: string): void => {
		console.log(`  ${pc.dim(msg)}`);
	},

	blank: (): void => {
		console.log();
	},

	header: (msg: string): void => {
		console.log();
		console.log(`  ${pc.bold(msg)}`);
	},

	subheader: (msg: string): void => {
		console.log(`  ${pc.dim("──────────")}`);
		console.log(`  ${msg}`);
	},

	detail: (label: string, value: string): void => {
		console.log(`    ${pc.dim("→")} ${label}: ${value}`);
	},

	listItem: (icon: string, name: string, description: string): void => {
		console.log(`  ${icon} ${pc.bold(pc.cyan(name))}  ${pc.dim(description)}`);
	},
};

export function createSpinner(text: string) {
	return yoctoSpinner({ text: `  ${text}` });
}

export { pc };
