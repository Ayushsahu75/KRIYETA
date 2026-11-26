// vite.config.js
// Vite configuration for the React frontend

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // Enable React support in Vite
  envDir: "../backend",
  server: {
    port: 3000,
    strictPort: true,
  },
});
