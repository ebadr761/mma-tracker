// ESLint plugins & helpers
import js from '@eslint/js'                          // core JS linting rules
import globals from 'globals'                        // predefined global variables (window, document, etc.)
import reactHooks from 'eslint-plugin-react-hooks'   // enforces React Hooks rules
import reactRefresh from 'eslint-plugin-react-refresh' // ensures components work with Vite hot reload
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ignore the build output folder
  globalIgnores(['dist']),
  {
    // which files ESLint should check
    files: ['**/*.{js,jsx,ts,tsx}'],

    // rule presets to inherit from
    extends: [
      js.configs.recommended,                        // standard JS best practices
      reactHooks.configs['recommended-latest'],      // hooks rules (e.g. deps arrays)
      reactRefresh.configs.vite,                     // Vite fast-refresh compatibility
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,       // allow browser globals like `window`
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },  // enable JSX parsing
        sourceType: 'module',         // use ES module imports
      },
    },

    rules: {
      // allow unused vars if they start with uppercase or underscore (e.g. components, _ignored)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
