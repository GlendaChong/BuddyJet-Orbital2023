module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [require.resolve("expo-router/babel"), "module:react-native-dotenv"],
  };
};

// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo', "@babel/preset-env"], 
//     plugins: [require.resolve("expo-router/babel"), "module:react-native-dotenv", 
//     ["@babel/plugin-proposal-class-properties", { "loose": true }],
//     ["@babel/plugin-proposal-private-methods", { "loose": true }], 
//     ["@babel/plugin-transform-private-property-in-object", { "loose": true }]]
//   };
// };
