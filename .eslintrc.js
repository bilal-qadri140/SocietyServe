export const env = {
  browser: true,
  es2021: true,
};
export const extends = [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:prettier/recommended', // Add this line
];
export const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
  ecmaVersion: 12,
  sourceType: 'module',
};
export const plugins = ['react', 'prettier'];
export const rules = {
  'prettier/prettier': [
    'error',
    {
      endOfLine: 'auto', // Add this line to handle different line endings
    },
  ],
};
export const settings = {
  react: {
    version: 'detect',
  },
};
