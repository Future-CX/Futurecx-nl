module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jquery: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  ignorePatterns: ['/src/js/components/*.js', '/assets/js/theme.js'],
  rules: {
    'prettier/prettier': ['warn', { printWidth: 200, singleQuote: true, trailingComma: 'es5', tabWidth: 2, semi: true }],
    indent: ['error', 2],
    semi: ['error', 'always'],
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['**/*.html'],
      parser: '@html-eslint/parser',
      plugins: ['@html-eslint'],
      rules: {
        // Allow either omitted or self-closing void elements
        '@html-eslint/require-closing-tags': 'off',
        '@html-eslint/require-doctype': 'error',
        '@html-eslint/require-explicit-size': 'error',
        '@html-eslint/require-img-alt': 'error',
        // SEO
        '@html-eslint/no-multiple-h1': 'warn',
        '@html-eslint/require-lang': 'error',
        '@html-eslint/require-meta-description': 'error',
        '@html-eslint/require-open-graph-protocol': 'warn',
        '@html-eslint/require-title': 'error',
        // Accessibility
        '@html-eslint/require-meta-viewport': 'warn',
      },
    },
  ],
};
