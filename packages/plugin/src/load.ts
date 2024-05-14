import path from 'node:path';

import { type Alias, build, type Rollup } from 'vite';

import { makeTempDir } from './utils/make-temp-dir.js';

/**
 * A load function that accepts a config and builds a file with vite's build function
 * The build result is stored in a temporary variable that relies on makeTempDir
 * Returns exports from the built file
 * Vite's build function does a few things:
 * - Fakes file-level constants:
 *   - __dirname
 *   - __filename
 *   - import.meta.url
 *   - import.meta.dirname
 *   - import.meta.filename
 * @param {string} filename An absolute path of the file to load
 */
export const load = async (
  filename: string,
  alias?: Alias[],
): Promise<Record<string, unknown>> => {
  if (filename.startsWith('.'))
    throw new Error('filename must be an absolute posix path');

  const [tempDir, cleanupTempDir] = await makeTempDir(path.dirname(filename));

  try {
    const buildOutput = await build({
      // don't try to resolve config from vite.config.ts, since it's probably not what we want
      configFile: false,
      logLevel: 'warn',
      build: {
        target: `node${process.versions.node}`,
        lib: {
          entry: filename,
          formats: ['es'],
        },
        sourcemap: false,
        minify: false,
        rollupOptions: {
          treeshake: false,
        },
      },
      resolve: {
        conditions: ['node'],
        alias,
      },
    });
    const output = (
      Array.isArray(buildOutput) ? buildOutput[0] : buildOutput
    ) as Rollup.RollupOutput;
    const entry = path.resolve(tempDir, output.output[0].fileName);
    const exports = await import(entry);
    return exports as Record<string, unknown>;
  }
  finally {
    await cleanupTempDir();
  }
};
