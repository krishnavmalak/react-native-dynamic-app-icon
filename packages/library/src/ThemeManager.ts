import { Storage } from './Storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = '@dynamic_branding_theme_mode';

export class ThemeManager {
  private static currentMode: ThemeMode = 'auto';

  static async restoreTheme(): Promise<void> {
    const saved = await Storage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      this.currentMode = saved;
    }
  }

  static async setTheme(mode: ThemeMode): Promise<void> {
    console.log(`[ThemeManager] Setting theme mode to: ${mode}`);
    this.currentMode = mode;
    await Storage.setItem(THEME_STORAGE_KEY, mode);
  }

  static getTheme(): ThemeMode {
    return this.currentMode;
  }
}
