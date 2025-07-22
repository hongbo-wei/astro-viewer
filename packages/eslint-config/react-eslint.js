const commitOn = process.env.NODE_ENV === undefined ? 'error' : 'off'

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // react补充配置
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    '@typescript-eslint',
    'react-refresh',
    'import',
    'prettier',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    //import导入顺序规则
    'import/order': [
      'warn',
      {
        //按照分组顺序进行排序
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        //通过路径自定义分组
        pathGroups: [
          // {
          //   pattern: 'react*', //对含react的包进行匹配
          //   group: 'external', //将其定义为external模块
          //   position: 'before', //定义在external模块中的优先级
          // },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: './*.*ss',
            group: 'index',
            position: 'after',
          },
        ],
        //将react包不进行排序，并放在前排，可以保证react包放在第一行
        // pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always', //每个分组之间换行
        //根据字母顺序对每个组内的顺序进行排序
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': ['off'], //允许使用any
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowedNames: ['that'], // this可用的局部变量名称
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off', //允许使用@ts-ignore
    '@typescript-eslint/no-non-null-assertion': 'off', //允许使用非空断言
    'no-console': [
      //提交时不允许有console.log
      commitOn,
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-debugger': 'error', //提交时不允许有debugger
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
}
