import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

/**
 * Creates a temporary directory in the nearest parent `node_modules` if possible
 * @param {string} initialDir An absolute/relative path for fallback when `node_modules` is not available
 * @returns [tempDirAbsolutePath, cleanupFn]
 */
export const makeTempDir = async (
  initialDir: string,
): Promise<[outDir: string, cleanupFn: () => Promise<void>]> => {
  initialDir = path.resolve(initialDir);

  const prefix = path.resolve(
    (await findNodeModules(initialDir)) ?? initialDir,
    '.vite-plugin-redux-ssr-',
  );
  const tempDir = await fsp.mkdtemp(prefix);
  const cleanup = async (): Promise<void> => {
    await fsp.rm(tempDir, { recursive: true, force: true });
  };

  // make best effort to cleanup temporary directory if something goes wrong
  process.on('exit', () => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  return [tempDir, cleanup];
};

/**
 * Finds any `node_modules` directory from dir until the root of system
 * @param {string} dir Absolute path of a directory to find `node_modules` from
 * @returns The absolute path of the nearest `node_modules`
 */
export const findNodeModules = async (
  dir: string,
): Promise<string | undefined> => {
  const current = path.join(dir, 'node_modules');

  try {
    const stat = await fsp.stat(current);
    // node_modules has been found, return the path
    if (stat.isDirectory()) return current;
  }
  catch (err: any) {
    // this means that an error that's not "node_modules is not found" occured
    if (err?.code !== 'ENOENT') return undefined;
  }

  // root has been reached, stop trying to find node_modules
  if (path.dirname(dir) === dir) return undefined;

  // traverse to dir's parent and try to find node_modules there
  return await findNodeModules(path.dirname(dir));
};
