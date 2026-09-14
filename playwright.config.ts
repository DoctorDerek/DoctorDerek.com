import { defineConfig, devices } from "@playwright/test"

const localPlaywrightPort = 3000
const localPlaywrightBaseUrl = `http://127.0.0.1:${localPlaywrightPort}`
const vercelTrustedOidcToken = process.env.PLAYWRIGHT_VERCEL_TRUSTED_OIDC_TOKEN

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || localPlaywrightBaseUrl,
    extraHTTPHeaders: vercelTrustedOidcToken
      ? { "x-vercel-trusted-oidc-idp-token": vercelTrustedOidcToken }
      : undefined,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  ...(process.env.PLAYWRIGHT_TEST_BASE_URL
    ? {}
    : {
        webServer: {
          command: `pnpm run dev --hostname 127.0.0.1 --port ${localPlaywrightPort}`,
          url: localPlaywrightBaseUrl,
          reuseExistingServer: false,
        },
      }),
})
