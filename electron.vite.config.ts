import { defineConfig } from 'electron-vite';
import { defineConfig as defineViteConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  main: defineViteConfig({
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      }
    },
    build: {
      outDir: resolve(__dirname, './dist'),
      minify: 'esbuild',
      lib: {
        entry: resolve(__dirname, './src'),
        formats: [ 'cjs' ],
      }
    }
  })
});
