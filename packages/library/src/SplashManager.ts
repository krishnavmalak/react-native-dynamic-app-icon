import { SplashConfig } from './types';
import NativeDynamicAppIcon from './NativeDynamicAppIcon';

export class SplashManager {
  static async showSplash(config: SplashConfig): Promise<void> {
    console.log(`[SplashManager] Showing splash screen with config:`, config);
    return NativeDynamicAppIcon.showSplash(JSON.stringify(config));
  }

  static async hideSplash(): Promise<void> {
    console.log(`[SplashManager] Hiding splash screen`);
    return NativeDynamicAppIcon.hideSplash();
  }
}
