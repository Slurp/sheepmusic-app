module.exports = {
  root:            true,
  "parser":        "vue-eslint-parser",
  "parserOptions": {
    "parser":      "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType":  "module"
  },
  env:             {
    browser: true,
    node:    true
  },
  extends:         [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    //'plugin:vue/vue3-recommended'
  ],
  globals:         {
    __static: true
  },
  rules:           {
    'global-require':              0,
    'import/no-unresolved':        0,
    'no-param-reassign':           0,
    'no-shadow':                   0,
    'import/extensions':           0,
    'import/newline-after-import': 0,
    'no-multi-assign':             0,
    // allow debugger during development
    'no-debugger':                 process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
