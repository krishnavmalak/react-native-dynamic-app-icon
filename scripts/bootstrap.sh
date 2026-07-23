#!/usr/bin/env bash
set -e

echo "🚀 Bootstrapping react-native-dynamic-app-icon monorepo..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build library
echo "🏗️ Building library..."
cd packages/library
npm run build
npm run typecheck
cd ../..

# Setup example app
echo "📱 Setting up Example App..."
cd example
npm install
# Link local package
npm install ../packages/library
cd ..

echo "✅ Bootstrap complete! You can now run the example app:"
echo "cd example && npm run ios"
