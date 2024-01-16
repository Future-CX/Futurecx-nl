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
    'prettier/prettier': 'error',
    indent: ['error', 2],
    semi: ['error', 'never'],
    'no-var': 'error',
  },
}
