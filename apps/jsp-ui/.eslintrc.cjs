module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    '@repo/eslint-config/common-config.js',
    '@repo/eslint-config/react-eslint.js',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'off',
      { allowConstantExport: true },
    ],
  },
}
