import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createClientSideStore } from 'vite-plugin-redux-ssr';

import App from './App.js';
import { makeStore } from './modules/redux/store.js';

const store = createClientSideStore(makeStore);

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
