import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', '.claude/', 'dist/monitoring.js'] },
  js.configs.recommended,
  {
    files: ['dist/**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.browser, __REVISION__: 'readonly' },
    },
  },
  {
    files: ['scripts/**/*.mjs', 'eslint.config.js'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
];
