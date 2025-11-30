/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwind()],
    server: {
        allowedHosts: ['mylocal.com', 'api.mylocal.com']  // 모든 호스트 허용 (개발 환경에서만 권장)
    },

  resolve: { // 루트경로 @로 설정
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },

  //recharts
  optimizeDeps: {
    include: ['recharts'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /recharts/],
    },
  },

  test: {
    environment: 'jsdom',
    // 브라우저 DOM 환경
    setupFiles: './src/test/setupTests.js',
    // RTL 확장 등 사전세팅 파일
    globals: true,
    // describe/it/expect 전역 사용
    css: true,
    // CSS 모듈/일반 CSS import 허용
    include: ['src/**/*.{test,spec}.jsx'],
    // 테스트 파일 탐색 패턴
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: './coverage'
    },
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.js']
      }
    }]
  }
});