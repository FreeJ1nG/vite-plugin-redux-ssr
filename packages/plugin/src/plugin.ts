import { isAbsolute, relative } from 'node:path';

import { type ThunkAction } from '@reduxjs/toolkit';
import { type Store } from 'redux';
import {
  type Alias,
  type AliasOptions,
  type HtmlTagDescriptor,
  type Logger,
  type Plugin as VitePlugin,
} from 'vite';

import { load as loadFile } from './load.js';
import { STORE_DATA_SCRIPT_TAG, type StoreCreator } from './utils.js';
import { cleanUrl } from './utils/clean-url.js';
import { resolveStoreCreator } from './utils/resolve-store-creator.js';

/**
 * Simplified plugin definition
 */
export interface Plugin extends VitePlugin {
  /**
   * Simplified config resolution function
   */
  configResolved(config: {
    logger: Pick<Logger, 'info' | 'warn' | 'error'>;
    root: string;
    resolve: { alias: Alias[] };
  }): Promise<void>;
  /**
   * Simplified load function
   */
  load(id: string): Promise<void>;
  /**
   * Simplified transformIndexHtml hook
   */
  transformIndexHtml: {
    handler: (
      html: string,
      ctx: { path: string; filename: string },
    ) => Promise<HtmlTagDescriptor[]>;
  };
}

/**
 * Options for the plugin
 */
export interface Options<AppStore extends Store> {
  /**
   * A store creator function that returns the type that
   * matches the store on the consumer's side
   * @param {RootState} `preloadedState` Initial state to fill the server side store
   * @returns A typed redux store that has been filled with `preloadedState`
   */
  createServerSideStore?: StoreCreator<AppStore>;
  /**
   * Relative/Absolute path to store config file
   * Said file should contain a named export of `createServerSideStore`
   */
  storeConfigPath?: string;
}

/**
 * Some examples can be seen from @hi-ogawa's implementation for `vite-plugin-ssr-css`
 * https://github.com/hi-ogawa/vite-plugins/blob/main/packages/ssr-css/src/plugin.ts
 */
export const plugin = <AppStore extends Store>({
  createServerSideStore: userProvidedStoreCreator,
  storeConfigPath,
}: Options<AppStore>): Plugin => {
  let config: {
    logger: Pick<Logger, 'info' | 'warn' | 'error'>;
    root: string;
    readonly alias: (AliasOptions | undefined) & Alias[];
  };

  let createServerSideStore: StoreCreator<AppStore>;

  const routeInitMap: Map<string, ThunkAction<any, any, any, any>[]>
    = new Map();

  const log = (msg: string, type: 'info' | 'warn' | 'error'): void => {
    config.logger[type](`[vite-plugin-redux-ssr] ${msg}`);
  };

  return {
    name: 'vite-plugin-redux-ssr',
    enforce: 'pre',
    async configResolved({ logger, root, resolve: { alias } }) {
      config = {
        logger,
        root,
        alias,
      };
    },
    async load(id) {
      if (!isAbsolute(id)) return;

      id = cleanUrl(id);

      if (!/\.page\.(?:jsx|tsx)/iu.test(id)) return;

      log(relative(config.root, id), 'info');

      const { initStore: initStoreFn } = await loadFile(id, config.alias);

      if (!initStoreFn) {
        log(
          `(${relative(config.root, id)}) initStore function not provided on *.page.{tsx|jsx} file`,
          'warn',
        );
        return;
      }

      if (typeof initStoreFn !== 'function') {
        log(
          `(${relative(config.root, id)}) initStore must be an exported function`,
          'warn',
        );
        return;
      }

      const { route, load: actions } = initStoreFn() as {
        route: string;
        load: ThunkAction<any, any, any, any>[];
      };

      if (!actions || !route) {
        log(
          `(${relative(config.root, id)}) initStore function must return a load array and a route string`,
          'warn',
        );
        return;
      }

      routeInitMap.set(route, actions);
    },
    transformIndexHtml: {
      handler: async (_html, { path, filename }) => {
        console.log(' ::', path, filename);
        console.log(' ::', routeInitMap);
        createServerSideStore = await resolveStoreCreator({
          createServerSideStore: userProvidedStoreCreator,
          storeConfigPath,
          projectRoot: config.root,
        });
        const store = createServerSideStore();
        return [
          {
            tag: 'script',
            injectTo: 'body',
            attrs: {
              id: STORE_DATA_SCRIPT_TAG,
              type: 'application/json',
            },
            children: JSON.stringify(store.getState()),
          },
        ];
      },
    },
  };
};
