import { ConfigPlugin, withInfoPlist } from '@expo/config-plugins';

export const withDynamicIconIOS: ConfigPlugin<{ icons: string[] }> = (config, { icons }) => {
  return withInfoPlist(config, (config) => {
    const alternateIcons: Record<string, any> = {};
    
    icons.forEach(icon => {
      alternateIcons[icon] = {
        CFBundleIconFiles: [icon],
        UIPrerenderedIcon: false
      };
    });

    config.modResults.CFBundleIcons = {
      CFBundlePrimaryIcon: (config.modResults.CFBundleIcons as any)?.CFBundlePrimaryIcon,
      CFBundleAlternateIcons: alternateIcons
    };

    return config;
  });
};
