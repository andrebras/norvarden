import { build } from 'esbuild';

await build({
  entryPoints: ['src/monitoring.js'],
  outfile: 'dist/monitoring.js',
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2018',
  define: { __REVISION__: JSON.stringify(process.env.GITHUB_SHA || 'local') },
});
