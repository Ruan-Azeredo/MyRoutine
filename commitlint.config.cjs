module.exports = {
  extends: ['@commitlint/config-conventional'],
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'imp', 'wip', 'chore', 'docs', 'style', 'refactor', 'test', 'ci', 'release']
    ]
  }
};
