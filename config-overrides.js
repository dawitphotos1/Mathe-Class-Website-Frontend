
// const { override, addWebpackResolve } = require("customize-cra");

// module.exports = override(
//   addWebpackResolve({
//     fallback: {
//       buffer: require.resolve("buffer/"),
//       util: require.resolve("util/"),
//     },
//   })
// );




// config-overrides.js
const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false,
    },
  })
);