import type { TurboModule } from 'react-native';
import { TurboModuleRegistry, NativeModules } from 'react-native';

/**
 * TurboModule spec for @krishnavmk/react-native-dynamic-app-icon.
 */
export interface Spec extends TurboModule {
  changeIcon(iconName: string): Promise<boolean>;
  restoreDefaultIcon(): Promise<boolean>;
  getCurrentIcon(): Promise<string>;
  showSplash(configStr: string): Promise<void>;
  hideSplash(): Promise<void>;
}

declare const global: any;

const getNativeModule = (): Spec | null => {
  const candidateNames = ['DynamicAppIcon', 'RNDynamicAppIcon', 'DynamicBranding', 'RNDynamicBranding'];

  for (const name of candidateNames) {
    try {
      if (NativeModules && NativeModules[name]) {
        const mod = NativeModules[name] as Spec;
        console.log(`[NativeDynamicAppIcon] Found via NativeModules.${name}:`, Object.keys(mod));
        return mod;
      }
    } catch {}

    try {
      if (TurboModuleRegistry.get) {
        const turbo = TurboModuleRegistry.get<Spec>(name);
        if (turbo) {
          console.log(`[NativeDynamicAppIcon] Found via TurboModuleRegistry.${name}:`, Object.keys(turbo));
          return turbo;
        }
      }
    } catch {}

    try {
      if (typeof global !== 'undefined' && global.__turboModuleProxy) {
        const mod = global.__turboModuleProxy(name);
        if (mod) {
          console.log(`[NativeDynamicAppIcon] Found via __turboModuleProxy.${name}:`, Object.keys(mod));
          return mod as Spec;
        }
      }
    } catch {}

    try {
      const { requireNativeModule } = require('expo-modules-core');
      if (typeof requireNativeModule === 'function') {
        const mod = requireNativeModule(name);
        if (mod) {
          console.log(`[NativeDynamicAppIcon] Found via requireNativeModule.${name}:`, Object.keys(mod));
          return mod as Spec;
        }
      }
    } catch {}
  }

  console.warn('[NativeDynamicAppIcon] No candidate native module resolved');
  return null;
};

const safeDynamicAppIcon: Spec = {
  changeIcon: async (iconName: string) => {
    const mod = getNativeModule();
    if (mod && typeof mod.changeIcon === 'function') {
      return mod.changeIcon(iconName);
    }
    console.warn('[DynamicAppIcon] changeIcon method missing on resolved native module');
    return false;
  },
  restoreDefaultIcon: async () => {
    const mod = getNativeModule();
    if (mod && typeof mod.restoreDefaultIcon === 'function') {
      return mod.restoreDefaultIcon();
    }
    console.warn('[DynamicAppIcon] restoreDefaultIcon method missing on resolved native module');
    return false;
  },
  getCurrentIcon: async () => {
    const mod = getNativeModule();
    if (mod && typeof mod.getCurrentIcon === 'function') {
      return mod.getCurrentIcon();
    }
    console.warn('[DynamicAppIcon] getCurrentIcon method missing on resolved native module');
    return 'Default';
  },
  showSplash: async (configStr: string) => {
    const mod = getNativeModule();
    if (mod && typeof mod.showSplash === 'function') {
      return mod.showSplash(configStr);
    }
  },
  hideSplash: async () => {
    const mod = getNativeModule();
    if (mod && typeof mod.hideSplash === 'function') {
      return mod.hideSplash();
    }
  },
};

export default safeDynamicAppIcon;
