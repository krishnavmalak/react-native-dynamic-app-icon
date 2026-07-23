module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: ['<rootDir>/example/', '<rootDir>/lib/'],
  transformIgnorePatterns: [
    // Allow Jest to transform all react-native and Expo packages
    'node_modules/(?!(' +
      'react-native|' +
      '@react-native|' +
      '@react-native-community|' +
      '@react-navigation|' +
      '@react-native-async-storage/async-storage|' +
      'react-native-builder-bob' +
    ')/)',
  ],
  testEnvironment: 'node',
  // Mock native modules that can't run in a Node test environment
  moduleNameMapper: {
    '@react-native-async-storage/async-storage': '<rootDir>/src/__mocks__/@react-native-async-storage/async-storage.ts',
    './NativeDynamicBranding': '<rootDir>/src/__mocks__/NativeDynamicBranding.ts',
    '../NativeDynamicBranding': '<rootDir>/src/__mocks__/NativeDynamicBranding.ts',
  },
};
