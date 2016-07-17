module.exports = {
  extends: 'google',
  env: {
    node: true,
    mocha: true
  },
  rules: {
    'no-constant-condition': 'off',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    curly: 'error',
    quotes: ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
    'max-len': ['error', {code: 120, tabWidth: 2}],
    'no-implicit-coercion': 'off',
    'operator-linebreak': ['error', 'before'],
    yoda: ['error', 'always', {exceptRange: true}],
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
}
