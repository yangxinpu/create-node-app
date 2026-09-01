import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/cli/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  dts: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
})
