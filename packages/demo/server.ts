// TODO: Remove console.logs later
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-misused-promises */
import fs from 'node:fs';

import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();

const vite = await createViteServer({
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
});

app.use(vite.middlewares);

app.use('*', async (req, res) => {
  const url = req.originalUrl;
  if (url === '/favicon.ico') return;

  try {
    let template = fs.readFileSync('./index.html', 'utf-8');
    console.log(' url: ', url);
    const { render } = await vite.ssrLoadModule('./src/entry-server.tsx');
    template = await vite.transformIndexHtml(url, template);
    console.log(' 😍', template);
    const appHtml = await render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  }
  catch (e) {
    const err = e as Error;
    vite.ssrFixStacktrace(err);
    res.status(500).end(err.stack);
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server is listening on http://localhost:${process.env.SERVER_PORT}`,
  );
});
