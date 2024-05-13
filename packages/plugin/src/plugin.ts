import { isAbsolute, relative } from 'node:path';

import { type ThunkAction } from '@reduxjs/toolkit';
import { type Store } from 'redux';
import { type Logger, type Plugin as VitePlugin } from 'vite';

import { STORE_DATA_SCRIPT_TAG, type StoreCreator } from './utils.js';
import { cleanUrl } from './utils/clean-url.js';

/**
 * Options for the plugin
 */
export interface Options<AppStore extends Store> {
  /**
   * A store creator function that returns the type that
   * matches the store on the consumer's side
   */
  createServerSideStore: StoreCreator<AppStore>;
}

/**
 * Some examples can be seen from @hi-ogawa's implementation for `vite-plugin-ssr-css`
 * https://github.com/hi-ogawa/vite-plugins/blob/main/packages/ssr-css/src/plugin.ts
 */
export const plugin = <AppStore extends Store>({
  createServerSideStore,
}: Options<AppStore>): VitePlugin => {
  const initialData: ReturnType<AppStore['getState']> | undefined = undefined;

  let config: {
    logger: Pick<Logger, 'info' | 'warn'>;
    root: string;
  };

  const routeInitMap: Map<string, ThunkAction<any, any, any, any>[]>
    = new Map();

  const log = (msg: string, type: 'info' | 'warn'): void => {
    config.logger[type](`[vite-plugin-redux-ssr] ${msg}`);
  };

  return {
    name: 'vite-plugin-redux-ssr',
    enforce: 'pre',
    configResolved({ logger, root }) {
      config = {
        logger,
        root,
      };
    },
    async load(id) {
      if (!isAbsolute(id)) return;

      id = cleanUrl(id);

      if (!/\.page\.(?:jsx|tsx)/iu.test(id)) return;

      log(relative(config.root, id), 'info');

      const exports = (await import(/* @vite-ignore */ id)) as Record<
        string,
        unknown
      >;

      const { initStore: initStoreFn } = exports;

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

      const { route, load } = initStoreFn() as {
        route: string;
        load: ThunkAction<any, any, any, any>[];
      };

      if (!load || !route) {
        log(
          `(${relative(config.root, id)}) initStore function must return a load array and a route string`,
          'warn',
        );
        return;
      }

      routeInitMap.set(route, load);

      /**
       * TODO
       * - Parse comment config and create a store on the server side
       * - Initialize the endpoints that need to be initialized
       * - Serialize the content of the store with fetched data
       * - Return the modified code with a <script>{JSON.stringify(serializedStore)}</script>
       */
    },
    transformIndexHtml: {
      order: 'post',
      handler: (_html, { path, filename }) => {
        console.log(' ::', path, filename);
        console.log(' ::', routeInitMap);
        /**
         * TODO
         * - Pull initial data from loaded files
         * - Check wether script gets appended to index.html as expected
         */
        const store = createServerSideStore(initialData);
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
