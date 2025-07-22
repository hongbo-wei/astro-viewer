module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'perf',
        'feat',
        'fix',
        'refactor',
        'docs',
        'chore',
        'style',
        'merge',
        'test',
      ],
    ],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [0],
  },
}
