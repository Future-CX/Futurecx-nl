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
  ignorePatterns: ['/src/js/components/*.js'],
  rules: {
    'prettier/prettier': ['warn', { printWidth: 200 }],
    indent: ['error', 2],
    semi: ['error', 'never'],
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['**/*.html'],
      parser: '@html-eslint/parser',
      plugins: ['@html-eslint'],
      rules: {
        '@html-eslint/no-multiple-h1': 'error',
        // Allow either omitted or self-closing void elements
        '@html-eslint/require-closing-tags': 'off',
      },
    },
  ],
}
