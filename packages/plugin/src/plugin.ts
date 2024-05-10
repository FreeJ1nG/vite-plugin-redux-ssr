import { type Plugin as VitePlugin } from "vite";
import { type Store } from "redux";

export interface Options<AppStore extends Store> {
  /**
   * A store creator function that returns the type that
   * matches the store on the consumer's side
   */
  makeStore: (preloadedState?: ReturnType<AppStore["getState"]>) => AppStore;
}

/**
 * Some examples can be seen from @hi-ogawa's implementation for `vite-plugin-ssr-css`
 * https://github.com/hi-ogawa/vite-plugins/blob/main/packages/ssr-css/src/plugin.ts
 */

export const plugin = <AppStore extends Store>({
  makeStore,
}: Options<AppStore>): VitePlugin => {
  let initialData: ReturnType<AppStore["getState"]> | undefined = undefined;
  return {
    name: "vite-plugin-redux-ssr",
    enforce: "pre",
    load(id, options) {
      /**
       * TODO
       * - Parse comment config and create a store on the server side
       * - Initialize the endpoints that need to be initialized
       * - Serialize the content of the store with fetched data
       * - Return the modified code with a <script>{JSON.stringify(serializedStore)}</script>
       */
    },
    transformIndexHtml: {
      handler: () => {
        /*
         * TODO
         * - Pull initial data from loaded files
         * - Check wether script gets appended to index.html as expected
         */
        const store = makeStore(initialData);
        return [
          {
            tag: "script",
            injectTo: "body",
            attrs: {
              id: "__STORE_DATA__",
              type: "application/json",
            },
            children: JSON.stringify(store.getState()),
          },
        ];
      },
    },
  };
};
