import React from 'react';
import ReactDomServer from 'react-dom/server';

import App from './App.jsx';

/**
 * A function that returns server-side rendered HTML
 */
export const render = async (): Promise<string> => {
  return ReactDomServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};
