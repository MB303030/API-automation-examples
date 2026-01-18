import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // CI-specific settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // Fail if test.only() is left in code
  retries: process.env.CI ? 2 : 0,      // Retry on CI only
  workers: process.env.CI ? 1 : undefined, // Run tests sequentially on CI for stability
  
  // CI-friendly reporter
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never'  // Don't try to open browser in CI
    }],
    ['github'],      // GitHub Actions annotations
    ['json', { 
      outputFile: 'test-results/test-results.json' 
    }],
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }],
    ['line']
  ],
  
  use: {
    // API testing settings
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // CI-optimized tracing
    trace: 'on-first-retry',      // Only trace on first retry to save space
    screenshot: 'off',            // No screenshots for API tests
    
    // CI-specific timeout
    actionTimeout: 10000,
    navigationTimeout: 10000,
  },
  
  // CI timeout settings
  timeout: 60000,                 // 60 seconds (longer for CI)
  
  expect: {
    timeout: 10000,               // 10 seconds
  },
  
  // Only run API tests (no need for browser projects)
  projects: [
    {
      name: 'api-tests',
      testMatch: /.*\.spec\.js/,
    },
  ],
});