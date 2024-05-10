import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();

const vite = await createViteServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

app.use(vite.middlewares);

app.use("*", async (req, res) => {
  const url = req.originalUrl;

  try {
    let template = fs.readFileSync("./index.html", "utf-8");
    template = await vite.transformIndexHtml(url, template);

    const { render } = await vite.ssrLoadModule("./src/entry-server.tsx");

    const appHtml = await render(url);

    let html = template.replace(`<!--ssr-outlet-->`, appHtml);

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    // @ts-ignore
    vite.ssrFixStacktrace(e);
    // @ts-ignore
    res.status(500).end(e.stack);
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server is listening on http://localhost:${process.env.SERVER_PORT}`,
  );
});
