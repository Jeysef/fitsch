// postcss.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(),
    // Custom plugin to replace 'rem' with 'em' for any class using the em: variant
    {
      postcssPlugin: 'tailwind-em-rewriter',
      Rule(rule) {
        if (rule.selector.includes('.em\\:')) {
          rule.walkDecls((decl) => {
            if (decl.value.includes('rem')) {
              decl.value = decl.value.replace(/rem/g, 'em');
            }
          });
        }
      }
    }
  ]
};