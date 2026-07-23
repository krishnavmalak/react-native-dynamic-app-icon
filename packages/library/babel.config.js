module.exports = {
  presets: [
    [
      // Resolve the preset from the root workspace node_modules since react-native
      // is a peer dependency and not installed locally in this package.
      require.resolve('@react-native/babel-preset'),
    ],
  ],
};
