import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/support-portal/" : "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 43123,
    strictPort: true,
    allowedHosts: true,
  },
});
