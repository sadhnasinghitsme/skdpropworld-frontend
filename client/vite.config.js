import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",           // Use relative paths for HashRouter
  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: true,       // Enable minification for production
    sourcemap: false,   // Disable sourcemaps for smaller build
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
});

