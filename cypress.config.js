import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  pageLoadTimeout: 80000,
  taskTimeout: 300000,
  projectId: process.env.CYPRESS_PROJECT_ID,
  video: false,
  watchForFileChanges: true,
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 2,
  },
  e2e: {
    setupNodeEvents(on, config) {},
    specPattern: 'cypress/e2e/auth/tests/**/*.{js,jsx,ts,tsx}',
    baseUrl: process.env.CYPRESS_LMS_BASE_URL,
  },
  blockHosts: [
    "**.cdn.**",
    "cdn.*",
    "*.optimizely.**",
    "www.googletagmanager.com",
    "www.google-analytics.com",
    "*.qualaroo.**",
    "s3.amazonaws.com",
    "*.nr-data.net**"
  ],
})
