import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Practice-Testing-DS--Evidence-based-Mastery-System",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    globals: true,
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**"]
  },
  worker: {
    format: "es"
  }
});
