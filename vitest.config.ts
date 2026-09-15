import path from "path"
import react from "@vitejs/plugin-react"
import { coverageConfigDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        "scripts/ci/**",
        "scripts/lighthouse/**",
        "scripts/xstate-diff/**",
      ],
      reportOnFailure: true,
      reporter: ["text", "html", "json", "lcov"],
    },
    environment: "happy-dom",
    include: ["**/*.test.tsx", "**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
})
