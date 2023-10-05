import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    open: false,
    setupFiles: ['dotenv/config'],
    coverage: {
      provider: 'v8'
    },
  },
  plugins: [
    tsconfigPaths(),
  ],
});
