module.exports = {
  root: true,
  extends: ['@react-native', '@react-native/eslint-config'],
  ignorePatterns: [
    'android/build/',
    'ios/build/',
    'lib/',
    'plugin/build/',
  ],
  rules: {
    'prettier/prettier': 'off',
  },
};
