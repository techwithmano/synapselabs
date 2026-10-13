import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const systemChromium = '/repl/tools/bin/chromium';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    launchOptions: existsSync(systemChromium)
      ? { executablePath: systemChromium }
      : undefined,
    baseURL: 'http://127.0.0.1:4179',
    trace: 'retain-on-failure',
  },
  webServer: {
    command:
      'PORT=4179 NEXT_TELEMETRY_DISABLED=1 pnpm exec next dev --hostname 127.0.0.1 --port 4179',
    url: 'http://127.0.0.1:4179',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
