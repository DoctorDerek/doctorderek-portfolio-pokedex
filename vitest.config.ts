import path from "path"
import react from "@vitejs/plugin-react"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    coverage: {
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
      exclude: ["scripts/**/*.cli.ts", "scripts/xstate-diff/**"],
      thresholds: {
        100: true,
        perFile: true,
      },
    },
    environment: "happy-dom",
    exclude: [
      ...configDefaults.exclude,
      "tests/scripts/xstate-diff/**/*.test.ts",
    ],
    include: ["**/*.test.tsx", "**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
})
