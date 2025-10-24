import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Base JavaScript recommendations
  js.configs.recommended,

  // Next.js and TypeScript configurations
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Global configuration for all JavaScript/TypeScript files
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',

        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',

        // Timer functions
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',

        // React globals
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      // === GENERAL JAVASCRIPT RULES ===
      'no-console': 'off', // Allow console logs in development
      'no-debugger': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-unused-vars': 'off', // Disabled in favor of TypeScript rule
      'no-duplicate-imports': 'error',
      'no-case-declarations': 'off', // Allow declarations in case blocks
      'no-useless-escape': 'warn',

      // === REACT RULES ===
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed with Next.js
      'react/no-unescaped-entities': 'off', // Allow apostrophes and quotes
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/require-render-return': 'error',

      // === REACT HOOKS RULES ===
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // === NEXT.JS SPECIFIC RULES ===
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-css-tags': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-async-client-component': 'warn',
      '@next/next/no-before-interactive-script-outside-document': 'error',
      '@next/next/no-head-element': 'error',
      '@next/next/no-script-component-in-head': 'error',

      // === TYPESCRIPT RULES ===
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],

      // === IMPORT RULES ===
      'import/no-anonymous-default-export': 'warn',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // Configuration for test files
  {
    files: [
      '**/__tests__/**/*.{js,ts,tsx}',
      '**/*.{test,spec}.{js,ts,tsx}',
      '**/tests/**/*.{js,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        vi: 'readonly', // For Vitest
        vitest: 'readonly',
        suite: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Configuration for configuration files
  {
    files: ['**/*.config.{js,mjs,cjs,ts}', '**/middleware.{js,ts}'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Configuration for Next.js API routes
  {
    files: ['**/app/**/route.{js,ts}', '**/pages/api/**/*.{js,ts}'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Files to ignore
  {
    ignores: [
      // Dependencies and build outputs
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',

      // Generated files
      '**/*.generated.*',
      'drizzle/**',
      'migrations/**',

      // Testing and coverage
      'coverage/**',
      '.nyc_output/**',

      // Logs and temporary files
      'logs/**',
      '*.log',
      '.DS_Store',
      '.env*',

      // IDE and editor files
      '.vscode/**',
      '.idea/**',
      '*.swp',
      '*.swo',

      // Config files that don't need linting
      '*.config.js',
      '*.config.mjs',
      'tailwind.config.*',
      'postcss.config.*',
      'next.config.*',
      'drizzle.config.*',
    ],
  },
];
