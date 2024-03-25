module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: ['simple-import-sort'],
  rules: {
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/ban-types': 'off',
    'no-new': 'off',
  },
}
