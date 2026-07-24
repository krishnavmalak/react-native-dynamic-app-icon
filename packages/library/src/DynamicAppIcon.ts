import { IconManager } from './IconManager';
import { SplashManager } from './SplashManager';
import { AppIconManager } from './AppIconManager';
import { ThemeManager, ThemeMode } from './ThemeManager';
import { SplashConfig, BrandConfig, AssetDownloadResult } from './types';

export class DynamicAppIcon {
  static async initialize(): Promise<void> {
    console.log(`[DynamicAppIcon] Initializing @krishnavm/react-native-dynamic-app-icon...`);
    // Restore persisted brand config and theme from storage
    await Promise.all([
      AppIconManager.restoreBrand(),
      ThemeManager.restoreTheme(),
    ]);
  }

  // Icon APIs
  static changeIcon(iconName: string): Promise<boolean> {
    return IconManager.changeIcon(iconName);
  }

  static restoreDefaultIcon(): Promise<boolean> {
    return IconManager.restoreDefaultIcon();
  }

  static getCurrentIcon(): Promise<string> {
    return IconManager.getCurrentIcon();
  }

  // Splash APIs
  static showSplash(config: SplashConfig): Promise<void> {
    return SplashManager.showSplash(config);
  }

  static hideSplash(): Promise<void> {
    return SplashManager.hideSplash();
  }

  // Brand APIs
  static setBrand(brandId: string, config: BrandConfig): Promise<void> {
    return AppIconManager.setBrand(brandId, config);
  }

  static getBrand(): BrandConfig | null {
    return AppIconManager.getBrand();
  }

  static resetBrand(): Promise<void> {
    return AppIconManager.resetBrand();
  }

  static downloadAssets(urls: string[]): Promise<AssetDownloadResult[]> {
    return AppIconManager.downloadAssets(urls);
  }

  static prefetchAssets(urls: string[]): Promise<void> {
    return AppIconManager.prefetchAssets(urls);
  }

  // Theme APIs
  static setTheme(mode: ThemeMode): Promise<void> {
    return ThemeManager.setTheme(mode);
  }

  static getTheme(): ThemeMode {
    return ThemeManager.getTheme();
  }
}

export const Branding = DynamicAppIcon;
