import { defineConfig } from 'vitest/config'

export default defineConfig({
  css: {
    postcss: {
      plugins: [],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts', './src/__tests__/test.setup.ts'],
    include: [
      'src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.{test,spec}.{ts,tsx}',
    ],
    environmentMatchGlobs: [
      ['src/app/api/**', 'node'],
      ['src/services/**', 'node'],
    ],
    css: false,
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '@src': new URL('./src', import.meta.url).pathname,
    },
  },
})
