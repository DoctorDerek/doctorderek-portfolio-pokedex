import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    coverage: {
      reportOnFailure: true,
      reportsDirectory: "coverage/vitest",
      reporter: ["text", "html", "clover", "json", "lcovonly"],
      include: [
        "app/**/*.tsx",
        "components/**/*.tsx",
        "data/**/*.ts",
        "graphql/**/*.ts",
        "hooks/**/*.ts",
        "next.config.ts",
        "scripts/**/*.{mts,ts}",
        "utils/**/*.ts",
      ],
      exclude: ["scripts/**/*.cli.ts"],
      thresholds: {
        100: true,
        perFile: true,
      },
    },
    environment: "happy-dom",
    include: ["**/*.test.tsx", "**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
})
