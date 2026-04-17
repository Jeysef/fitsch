/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*.{js,jsx,ts,tsx}": ["oxlint --fix", "oxfmt"],
  "*.{json,md}": ["oxfmt"],
};
