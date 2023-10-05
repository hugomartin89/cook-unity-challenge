import generatePackageJson from "rollup-plugin-generate-package-json";
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePluginNode } from 'vite-plugin-node';
import { defineConfig } from 'vite';
import { resolve } from 'path';

const packageJson = require('./package.json');
packageJson.main = 'main.js';
packageJson.scripts = {
  start: "npx prisma migrate deploy && node main.js"
};
packageJson.devDependencies = {};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: Object.keys(packageJson.dependencies),
    }
  },

  plugins: [
    tsconfigPaths(),

    generatePackageJson({
      baseContents: packageJson,
    }),

    ...VitePluginNode({
      adapter: 'express',
      appName: 'challenge',
      appPath: resolve(__dirname, './src/main.ts'),
      exportName: 'App',
    }),
  ],

  server: {
    port: 3000
  }
});
