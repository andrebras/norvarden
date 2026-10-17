import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', '.claude/'] },
  js.configs.recommended,
  {
    files: ['dist/**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
  {
    files: ['scripts/**/*.mjs', 'eslint.config.js'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
];
