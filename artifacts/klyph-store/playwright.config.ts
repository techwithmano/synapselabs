import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const systemChromium = '/repl/tools/bin/chromium';
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: externalBaseUrl ?? 'http://127.0.0.1:4179',
    launchOptions: existsSync(systemChromium)
      ? { executablePath: systemChromium }
      : undefined,
    trace: 'retain-on-failure',
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command:
          process.platform === 'win32'
            ? 'cmd /c pnpm.cmd exec next dev --hostname 127.0.0.1 --port 4179'
            : 'pnpm exec next dev --hostname 127.0.0.1 --port 4179',
        url: 'http://127.0.0.1:4179',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
