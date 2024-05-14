import path from 'node:path';

import { type Store } from 'redux';
import { type Alias } from 'vite';

import { load } from '../load.js';
import { type Options } from '../plugin.js';
import { isStoreCreator, type StoreCreator } from '../utils.js';

export interface ResolveStoreCreatorProps<AppStore extends Store>
  extends Pick<Options<AppStore>, 'createServerSideStore' | 'storeConfigPath'> {
  projectRoot: string;
  alias?: Alias[];
}

export const resolveStoreCreator = async <AppStore extends Store>({
  createServerSideStore: userProvidedStoreCreator,
  storeConfigPath,
  projectRoot,
  alias,
}: ResolveStoreCreatorProps<AppStore>): Promise<StoreCreator<AppStore>> => {
  if (!userProvidedStoreCreator || !storeConfigPath)
    throw new Error(
      'Config must contain at least one of createServerSideStore or storeConfigPath',
    );

  if (userProvidedStoreCreator) return userProvidedStoreCreator;

  let resolvedPath = storeConfigPath;
  if (storeConfigPath.startsWith('.')) {
    // relative path should be resolved first
    resolvedPath = path.resolve(projectRoot, storeConfigPath);
  }

  const { createServerSideStore } = await load(resolvedPath, alias);

  if (!createServerSideStore || typeof createServerSideStore !== 'function')
    throw new Error(
      `${path.relative(resolvedPath, storeConfigPath)} does not export a createServerSideStore function`,
    );

  if (!isStoreCreator<AppStore>(createServerSideStore)) {
    throw new Error(
      `${path.relative(resolvedPath, storeConfigPath)} does not export a function that returns a redux store`,
    );
  }

  return createServerSideStore;
};
