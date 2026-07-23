# react-native-dynamic-app-icon 🎨✨

> Programmatic **Dynamic App Icon Switching** & **Animated Dynamic Splash Screens** for React Native & Expo (iOS & Android).

[![npm version](https://badge.fury.io/js/react-native-dynamic-app-icon.svg)](https://www.npmjs.com/package/react-native-dynamic-app-icon)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ⚡ Core Features

| Feature | iOS | Android |
|---|---|---|
| 🖼 **Dynamic App Icon** | ✅ `setAlternateIconName` | ✅ `PackageManager` activity-alias |
| ✨ **Animated Splash Screen** | ✅ Fade, Scale, Slide | ✅ Fade, Scale, Slide |
| 💾 **State Persistence** | ✅ AsyncStorage persistence | ✅ AsyncStorage persistence |
| 🚀 **New Architecture (TurboModule)** | ✅ Bridgeless / TurboModule | ✅ Bridgeless / TurboModule |
| 📱 **Expo 57 & React Native 0.86** | ✅ Managed & Bare | ✅ Managed & Bare |

---

## 📦 Installation

```bash
# npm
npm install react-native-dynamic-app-icon @react-native-async-storage/async-storage expo-asset expo-file-system

# yarn
yarn add react-native-dynamic-app-icon @react-native-async-storage/async-storage expo-asset expo-file-system

# iOS pod install
cd ios && pod install
```

---

## ⚙️ Setup — Expo Config Plugin

Add the config plugin to your `app.json`. List every dynamic app icon name:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-dynamic-app-icon",
        {
          "icons": [
            "apple",
            "orange",
            "pineapple",
            "strawberry"
          ]
        }
      ]
    ]
  }
}
```

Run `npx expo prebuild` to automatically inject native activity-aliases on Android and Info.plist icon dictionaries on iOS.

---

## 🚀 Usage

### 1. Dynamic App Icon Switching

```ts
import { Branding } from 'react-native-dynamic-app-icon';

// Change launcher icon
await Branding.changeIcon('orange');

// Restore default app icon
await Branding.restoreDefaultIcon();

// Get currently active launcher icon
const currentIcon = await Branding.getCurrentIcon(); // 'orange' | 'Default'
```

### 2. Animated Dynamic Splash Screen

```tsx
import React, { useState } from 'react';
import { DynamicSplashScreen } from 'react-native-dynamic-app-icon';

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  return (
    <>
      <MainAppContent />
      <DynamicSplashScreen
        visible={splashVisible}
        config={{
          title: 'My App',
          subtitle: 'Welcome Back',
          background: '#F8F9FA',
          animation: 'scale', // 'fade' | 'scale' | 'slide'
          logo: require('./assets/logo.png'),
        }}
      />
    </>
  );
}
```

---

## 📄 License

MIT © Senior Architect
