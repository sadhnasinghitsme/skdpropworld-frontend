module.exports = {
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Add any custom rules here
  },
  globals: {
    process: 'readonly',
    require: 'readonly',
    module: 'readonly',
    __dirname: 'readonly'
  }
};
