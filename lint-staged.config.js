module.exports = {
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  '**/*.{ts,tsx}': [
    'prettier --write',
    'eslint --fix',
    'yarn test --findRelatedTests',
  ],
};
