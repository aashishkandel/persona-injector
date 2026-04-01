// ── File System Utilities ──

import { readFile, writeFile, mkdir, access, unlink, readdir, rmdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { constants } from 'node:fs';

/**
 * Read a file, returning null if it doesn't exist (instead of throwing).
 */
export async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Write a file, creating parent directories if needed.
 */
export async function writeFileSafe(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, content, 'utf-8');
}

/**
 * Check if a file or directory exists.
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a directory recursively (like mkdir -p).
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

/**
 * Delete a file if it exists.
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a directory if it's empty.
 */
export async function removeDirIfEmpty(dirPath: string): Promise<boolean> {
  try {
    const entries = await readdir(dirPath);
    if (entries.length === 0) {
      await rmdir(dirPath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
