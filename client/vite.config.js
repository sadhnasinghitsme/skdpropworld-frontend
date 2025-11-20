import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",            // 🔥 Required for Vercel
  build: {
    outDir: "dist",     // 🔥 Ensure correct output folder
    assetsDir: "assets", // 🔥 Vite default, ensures proper JS/CSS folder
    minify: false,
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
});

