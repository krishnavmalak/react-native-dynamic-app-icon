import NativeDynamicAppIcon from './NativeDynamicAppIcon';

export class IconManager {
  static async changeIcon(iconName: string): Promise<boolean> {
    console.log(`[IconManager] Requesting icon change to: ${iconName}`);
    return NativeDynamicAppIcon.changeIcon(iconName);
  }

  static async restoreDefaultIcon(): Promise<boolean> {
    console.log(`[IconManager] Restoring default icon`);
    return NativeDynamicAppIcon.restoreDefaultIcon();
  }

  static async getCurrentIcon(): Promise<string> {
    console.log(`[IconManager] Getting current icon`);
    return NativeDynamicAppIcon.getCurrentIcon();
  }
}
