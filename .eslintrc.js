module.exports = {
  root: true,
  env: {
    node: true,
  },
  //     extends: [
  //       "plugin:@typescript-eslint/recommended", // 引入相关插件
  //       "prettier", // 禁用 ESLint 中与 Prettier 冲突的规则
  //       // "prettier/@typescript-eslint" // 禁用插件中与 Prettier 冲突的规则
  // ],
  //     plugins: ['prettier'],
  extends: [ 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],

  globals: {},

  rules: {
    // 以下为替换原有eslint
    'prettier/prettier': 'error',
    'no-underscore-dangle': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'import/no-unresolved': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
