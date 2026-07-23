const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const resolveFrom = require('resolve-from');

// The example app lives inside a monorepo. Metro needs to:
// 1. Watch the library source (so changes to packages/library are hot-reloaded)
// 2. Resolve all modules from the example's OWN node_modules first,
//    then fall back to the root workspace node_modules.

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../');

const config = getDefaultConfig(projectRoot);

// Watch both example/ and packages/library/src
config.watchFolders = [
  workspaceRoot,
];

// Resolve modules from example's node_modules first, then root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];



// Pin the shared runtime packages to the example app's copy.
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-mmkv': path.resolve(projectRoot, 'node_modules/react-native-mmkv'),
  'expo-asset': path.resolve(projectRoot, 'node_modules/expo-asset'),
  'expo-file-system': path.resolve(projectRoot, 'node_modules/expo-file-system'),
};

module.exports = config;
