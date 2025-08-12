/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*": ["eslint --fix", "prettier --write --ignore-unknown"],
};
