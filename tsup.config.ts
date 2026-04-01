import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  dts: false,
  sourcemap: true,
  splitting: true,
  minify: false,
  shims: false,
  banner: {
    js: '',
  },
});
