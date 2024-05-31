module.exports = {
  extends: 'erb',
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-named-as-default': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-bind': 'off',
    'promise/param-names': 'off',
    'no-async-promise-executor': 'off',
    'no-await-in-loop': 'off',
    'import/prefer-default-export': 'off',
    'import/no-restricted-paths': [
      'error',
      {
        basePath: './src',
        zones: [
          { target: './renderer', from: './main' },
          { target: './main', from: './renderer' },
        ],
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
