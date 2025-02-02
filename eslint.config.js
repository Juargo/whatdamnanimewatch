import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import globalsModule from 'globals';
const { browser, node, es2021 } = globalsModule;
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroParser from 'astro-eslint-parser';
/** @type {Array<import('eslint').Linter.FlatConfig>} */
export default [
// Base configuration for all files
{
    ignores: ['**/dist/**', '**/node_modules/**', '**/.git/**'],
},
// Global settings and plugins
{
    plugins: {
    prettier,
    },
    rules: {
    'prettier/prettier': 'error',
    ...eslintConfigPrettier.rules,
    },
},
// JavaScript files
{
    files: ['**/*.js', '**/*.mjs'],
    ...eslint.configs.recommended,
    languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
        ...browser,
        ...node,
        ...es2021,
    },
    },
},
// TypeScript files
{
    files: ['**/*.ts', '**/*.tsx'],
    ...eslint.configs.recommended,
    plugins: {
        '@typescript-eslint': typescriptPlugin
    },
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
            ...browser,
            ...node,
            ...es2021,
        },
        parser: tsParser,
        parserOptions: {
            project: './tsconfig.json',
        },
    },
    rules: {
        ...typescriptPlugin.configs['recommended'].rules,
        ...typescriptPlugin.configs['recommended-requiring-type-checking'].rules,
    }
},
// Astro files
{
    files: ['**/*.astro'],
    ...eslint.configs.recommended,
    plugins: {
        '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: astroParser,
        parserOptions: {
            parser: tsParser,
            extraFileExtensions: ['.astro'],
            project: './tsconfig.json',
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            },
        },
        globals: {
            ...browser,
            ...node,
            ...es2021,
            // Astro globals
            Astro: 'readonly',
            Fragment: 'readonly',
        },
    },
    rules: {
        // Import rules
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        // Astro specific rules
        'prettier/prettier': ['error', {
            plugins: ['prettier-plugin-astro'],
            parser: 'astro',
            singleQuote: true,
            tabWidth: 2,
            useTabs: false,
            astroAllowShorthand: true,
        }],
        // Allow any JSX-like expressions in Astro templates
        'react/jsx-key': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        // TypeScript rules for script blocks
        ...typescriptPlugin.configs['recommended'].rules,
    },
},
]

