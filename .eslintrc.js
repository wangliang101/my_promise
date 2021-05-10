const path = require('path');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    // 'prettier',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', path.resolve('./src')]],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  plugins: ['prettier'],
  rules: {},
  globals: {},
};

