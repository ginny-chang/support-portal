import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/support-portal/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src/vendor/evilcharts"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 43123,
    strictPort: true,
    allowedHosts: true,
  },
});
