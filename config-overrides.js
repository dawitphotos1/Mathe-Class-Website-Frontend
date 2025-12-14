// config-overrides.js
const { override, addWebpackModuleRule } = require("customize-cra");

module.exports = override(
  addWebpackModuleRule({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
    resolve: {
      fullySpecified: false,
    },
  }),
  addWebpackModuleRule({
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
  })
);
