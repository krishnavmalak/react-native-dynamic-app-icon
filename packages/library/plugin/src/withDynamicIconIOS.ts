import { ConfigPlugin, withInfoPlist, withDangerousMod, withXcodeProject, IOSConfig } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

export const withDynamicIconIOS: ConfigPlugin<{ icons: string[] }> = (config, { icons }) => {
  // 1. Update Info.plist - only inject alternate icons, preserve everything else
  config = withInfoPlist(config, (config) => {
    const alternateIcons: Record<string, any> = {};
    
    icons.forEach(icon => {
      alternateIcons[icon] = {
        CFBundleIconFiles: [icon],
        UIPrerenderedIcon: false
      };
    });

    // Merge into existing CFBundleIcons, but if CFBundlePrimaryIcon is missing, we MUST define it
    // otherwise iOS will show a blank primary icon when CFBundleIcons is declared.
    const existing = (config.modResults.CFBundleIcons as any) || {};
    const primaryIcon = existing.CFBundlePrimaryIcon || {
      CFBundleIconFiles: ['AppIcon'],
      UIPrerenderedIcon: false
    };

    config.modResults.CFBundleIcons = {
      ...existing,
      CFBundlePrimaryIcon: primaryIcon,
      CFBundleAlternateIcons: alternateIcons,
    };

    return config;
  });

  // 2. Copy image files to ios project directory
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const projectName = config.modRequest.projectName || config.name;
      const iosRoot = path.join(projectRoot, 'ios', projectName);
      
      icons.forEach(icon => {
        const assetsDir = path.join(projectRoot, 'assets');
        const pngPath = path.join(assetsDir, `${icon}.png`);

        if (fs.existsSync(pngPath)) {
          // Provide @2x and @3x copies as well, required by iOS for alternate icons to avoid "Resource temporarily unavailable"
          fs.copyFileSync(pngPath, path.join(iosRoot, `${icon}.png`));
          fs.copyFileSync(pngPath, path.join(iosRoot, `${icon}@2x.png`));
          fs.copyFileSync(pngPath, path.join(iosRoot, `${icon}@3x.png`));
        }
      });
      return config;
    }
  ]);

  // 3. Add to Xcode project so they are bundled
  config = withXcodeProject(config, (config) => {
    const projectName = config.modRequest.projectName || config.name;
    const project = config.modResults;

    icons.forEach(icon => {
      ['', '@2x', '@3x'].forEach(suffix => {
        const iconPath = path.join(projectName, `${icon}${suffix}.png`);
        IOSConfig.XcodeUtils.addResourceFileToGroup({
          filepath: iconPath,
          groupName: projectName,
          project,
          isBuildFile: true,
        });
      });
    });

    return config;
  });

  return config;
};
