# @krishnavm/react-native-dynamic-app-icon 🎨✨

> Programmatic **Dynamic App Icon Switching** & **Animated Dynamic Splash Screens** for React Native & Expo (iOS & Android).

[![npm version](https://img.shields.io/npm/v/@krishnavm/react-native-dynamic-app-icon.svg)](https://www.npmjs.com/package/@krishnavm/react-native-dynamic-app-icon)
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
npm install @krishnavm/react-native-dynamic-app-icon @react-native-async-storage/async-storage expo-asset expo-file-system

# yarn
yarn add @krishnavm/react-native-dynamic-app-icon @react-native-async-storage/async-storage expo-asset expo-file-system

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
        "@krishnavm/react-native-dynamic-app-icon",
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
import { Branding } from '@krishnavm/react-native-dynamic-app-icon';

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
import { DynamicSplashScreen } from '@krishnavm/react-native-dynamic-app-icon';

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

## 📖 API Reference

### `Branding` (Dynamic App Icon)

- `changeIcon(iconName: string): Promise<void>`: Changes the app launcher icon to the specified icon name.
- `restoreDefaultIcon(): Promise<void>`: Restores the default app launcher icon.
- `getCurrentIcon(): Promise<string>`: Returns the name of the currently active icon (returns `'Default'` if unchanged).

### `DynamicSplashScreen`

**Props:**
- `visible` (boolean): Controls whether the splash screen is visible.
- `config` (object): Configuration for the splash screen appearance and animation.
  - `title` (string, optional): The main text to display.
  - `subtitle` (string, optional): The secondary text to display.
  - `background` (string, optional): Background color (hex or standard color name).
  - `animation` (`'fade'` | `'scale'` | `'slide'`, optional): The out-animation type when the splash screen hides.
  - `logo` (ImageRequireSource, optional): The image source for the logo.

---

## 🛠 Bare React Native Setup (Without Expo Prebuild)

If you are not using Expo prebuild, you must manually configure your native iOS and Android projects.

### iOS Configuration
1. Open your project in Xcode.
2. Add your alternate icon images to your Xcode project.
3. In your `Info.plist`, add the `CFBundleIcons` (and `CFBundleIcons~ipad` if applicable) dictionary defining your primary and alternate icons.

### Android Configuration
1. Place your alternative icon resources in `android/app/src/main/res/mipmap-*` folders.
2. Open your `android/app/src/main/AndroidManifest.xml`.
3. Add `<activity-alias>` tags for each alternative icon. Each alias must target your `MainActivity` and specify the custom `android:icon`.

*(Note: If using Expo, it is highly recommended to use the config plugin which handles this automatically).*

---

## 🤝 Contributing

We welcome contributions! To get started:
1. Clone the repository.
2. Run `yarn install` to install dependencies.
3. Navigate to the `example` directory to run the example app for testing your changes.
4. Please open an issue before submitting major pull requests.

---

## ⚠️ Troubleshooting

- **Android Icon Not Changing:** Ensure your `<activity-alias>` names match exactly what you pass to `Branding.changeIcon()`. The OS may take a moment to reflect the change on the home screen.
- **iOS Build Errors:** If you modify `app.json` icons, ensure you run `npx expo prebuild --clean` to regenerate the `Info.plist` correctly.

---

## 📄 License

MIT © Senior Architect
