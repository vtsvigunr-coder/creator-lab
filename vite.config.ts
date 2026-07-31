/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacyPolicy: resolve(__dirname, 'privacy-policy.html'),
        termsOfService: resolve(__dirname, 'terms-of-service.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    globals: true,
    // Rendering a section means mounting hundreds of per-character spans plus GSAP timelines
    // in jsdom; with the files running in parallel that regularly overruns the 5s default on
    // a loaded machine, even though each file finishes in ~2s on its own.
    testTimeout: 20000,
  },
})
