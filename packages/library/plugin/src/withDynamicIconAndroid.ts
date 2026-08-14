import { ConfigPlugin, withAndroidManifest, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

type ManifestIntentFilter = {
  action?: Array<{ $?: Record<string, string> }>;
  category?: Array<{ $?: Record<string, string> }>;
};

type ManifestActivity = {
  $?: Record<string, string>;
  'intent-filter'?: ManifestIntentFilter[];
};

const hasAction = (intentFilter: ManifestIntentFilter, actionName: string) =>
  intentFilter.action?.some((entry) => entry.$?.['android:name'] === actionName) ?? false;

const hasCategory = (intentFilter: ManifestIntentFilter, categoryName: string) =>
  intentFilter.category?.some((entry) => entry.$?.['android:name'] === categoryName) ?? false;

function ensureDefaultMainIntentFilter(activity: ManifestActivity) {
  const intentFilters = activity['intent-filter'] ?? [];
  const hasMainDefaultFilter = intentFilters.some(
    (intentFilter) =>
      hasAction(intentFilter, 'android.intent.action.MAIN') &&
      hasCategory(intentFilter, 'android.intent.category.DEFAULT')
  );

  if (!hasMainDefaultFilter) {
    intentFilters.push({
      action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
      category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
    });
  }

  activity['intent-filter'] = intentFilters;
}

function removeLauncherCategoryFromMainActivity(activity: ManifestActivity) {
  const intentFilters = activity['intent-filter'] ?? [];

  activity['intent-filter'] = intentFilters
    .map((intentFilter) => {
      const isMainLauncherFilter =
        hasAction(intentFilter, 'android.intent.action.MAIN') &&
        hasCategory(intentFilter, 'android.intent.category.LAUNCHER');

      if (!isMainLauncherFilter) {
        return intentFilter;
      }

      const remainingCategories =
        intentFilter.category?.filter(
          (entry) => entry.$?.['android:name'] !== 'android.intent.category.LAUNCHER'
        ) ?? [];

      return {
        ...intentFilter,
        category: remainingCategories,
      };
    })
    .filter((intentFilter) => (intentFilter.category?.length ?? 0) > 0);
}

export const withDynamicIconAndroid: ConfigPlugin<{ icons: string[] }> = (config, { icons }) => {
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const drawableDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'res',
        'drawable'
      );
      if (!fs.existsSync(drawableDir)) {
        fs.mkdirSync(drawableDir, { recursive: true });
      }

      for (const icon of icons) {
        const assetsDir = path.join(projectRoot, 'assets');
        const pngPath = path.join(assetsDir, `${icon}.png`);
        const jpgPath = path.join(assetsDir, `${icon}.jpg`);
        const targetPath = path.join(drawableDir, `${icon}.png`);

        if (fs.existsSync(pngPath)) {
          fs.copyFileSync(pngPath, targetPath);
        } else if (fs.existsSync(jpgPath)) {
          fs.copyFileSync(jpgPath, targetPath);
        }
      }
      return config;
    },
  ]);

  return withAndroidManifest(config, async (config) => {
    const mainApplication = config.modResults.manifest.application?.[0];
    if (!mainApplication) return config;

    const packageName = config.modResults.manifest.$?.package || config.android?.package;
    if (!packageName) return config;

    // 1. Give host MainActivity a DEFAULT category MAIN intent-filter so ADB am start succeeds while OS launcher uses activity-aliases
    const activities = (mainApplication.activity || []) as ManifestActivity[];
    const mainActivity = activities.find(
      (act) =>
        act.$?.['android:name'] === '.MainActivity' || act.$?.['android:name'] === `${packageName}.MainActivity`
    );

    if (mainActivity) {
      removeLauncherCategoryFromMainActivity(mainActivity);
      ensureDefaultMainIntentFilter(mainActivity);
    }

    const firstIcon = icons[0] || 'apple';
    const resourceNameForIcon = (icon: string) => (icon === 'default' ? 'app_default' : icon);

    // 2. Default activity alias (ENABLED by default)
    const defaultAlias = {
      $: {
        'android:name': `${packageName}.MainActivityDefault`,
        'android:enabled': 'true',
        'android:exported': 'true',
        'android:icon': `@drawable/${resourceNameForIcon(firstIcon)}`,
        'android:roundIcon': `@drawable/${resourceNameForIcon(firstIcon)}`,
        'android:targetActivity': '.MainActivity',
      },
      'intent-filter': [
        {
          action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
          category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
        },
      ],
    };

    // 3. Alternate activity aliases (DISABLED by default)
    const aliases = icons.map(icon => {
      const resourceName = resourceNameForIcon(icon);
      return {
        $: {
          'android:name': `${packageName}.MainActivity${icon}`,
          'android:enabled': 'false',
          'android:exported': 'true',
          'android:icon': `@drawable/${resourceName}`,
          'android:roundIcon': `@drawable/${resourceName}`,
          'android:targetActivity': '.MainActivity',
        },
        'intent-filter': [
          {
            action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
            category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
          },
        ],
      };
    });

    (mainApplication as any)['activity-alias'] = [
      defaultAlias,
      ...aliases,
    ];

    return config;
  });
};
