import path from "path";
import { defineConfig } from "vite";
import reduxSsrPlugin from "vite-plugin-redux-ssr";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), reduxSsrPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
