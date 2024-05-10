import path from "path";
import { defineConfig } from "vite";
import reduxSsrPlugin from "vite-plugin-redux-ssr";
import react from "@vitejs/plugin-react";
import { makeStore } from "./src/modules/redux/store.ts";

export default defineConfig({
  plugins: [react(), reduxSsrPlugin({ makeStore })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
