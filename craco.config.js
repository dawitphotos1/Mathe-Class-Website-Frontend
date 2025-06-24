// C:\Users\Dawit\Desktop\math-class-website\Mathe-Class-Website-Frontend\craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [require("@tailwindcss/postcss"), require("autoprefixer")],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      const cssRule = webpackConfig.module.rules.find(
        (rule) =>
          rule.oneOf &&
          rule.oneOf.some((r) => r.test && r.test.toString().includes(".css"))
      );
      if (cssRule) {
        cssRule.oneOf.forEach((rule) => {
          if (rule.test && rule.test.toString().includes(".css")) {
            rule.exclude = [
              /node_modules\/@fortawesome\/fontawesome-free/,
              /node_modules\/react-toastify/,
            ];
          }
        });
      }
      return webpackConfig;
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Custom middleware logic can go here if needed
      return middlewares;
    },
  },
};
