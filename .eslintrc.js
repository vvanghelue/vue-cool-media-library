module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      '@vue/airbnb',
    ],
    parserOptions: {
      parser: 'babel-eslint',
    },
    rules: {
      indent: 'off',
      'linebreak-style': 'off',
      'max-len': 'off',
      'quote-props': [0, 'as-needed'],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-param-reassign': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-restricted-properties': 'off',
      'no-restricted-syntax': 'off',
      'vue/no-mutating-props': 'off',
      'no-await-in-loop': 'off',
    },
    overrides: [
      {
        files: [
          '**/__tests__/*.{j,t}s?(x)',
          '**/tests/unit/**/*.spec.{j,t}s?(x)',
        ],
        env: {
          jest: true,
        },
      },
    ],
  };
