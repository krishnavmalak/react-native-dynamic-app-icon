"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDynamicIconAndroid = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const hasAction = (intentFilter, actionName) => intentFilter.action?.some((entry) => entry.$?.['android:name'] === actionName) ?? false;
const hasCategory = (intentFilter, categoryName) => intentFilter.category?.some((entry) => entry.$?.['android:name'] === categoryName) ?? false;
function ensureDefaultMainIntentFilter(activity) {
    const intentFilters = activity['intent-filter'] ?? [];
    const hasMainDefaultFilter = intentFilters.some((intentFilter) => hasAction(intentFilter, 'android.intent.action.MAIN') &&
        hasCategory(intentFilter, 'android.intent.category.DEFAULT'));
    if (!hasMainDefaultFilter) {
        intentFilters.push({
            action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
            category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        });
    }
    activity['intent-filter'] = intentFilters;
}
function removeLauncherCategoryFromMainActivity(activity) {
    const intentFilters = activity['intent-filter'] ?? [];
    activity['intent-filter'] = intentFilters
        .map((intentFilter) => {
        const isMainLauncherFilter = hasAction(intentFilter, 'android.intent.action.MAIN') &&
            hasCategory(intentFilter, 'android.intent.category.LAUNCHER');
        if (!isMainLauncherFilter) {
            return intentFilter;
        }
        const remainingCategories = intentFilter.category?.filter((entry) => entry.$?.['android:name'] !== 'android.intent.category.LAUNCHER') ?? [];
        return {
            ...intentFilter,
            category: remainingCategories,
        };
    })
        .filter((intentFilter) => (intentFilter.category?.length ?? 0) > 0);
}
const withDynamicIconAndroid = (config, { icons }) => {
    config = (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const drawableDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'drawable');
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
                }
                else if (fs.existsSync(jpgPath)) {
                    fs.copyFileSync(jpgPath, targetPath);
                }
            }
            return config;
        },
    ]);
    return (0, config_plugins_1.withAndroidManifest)(config, async (config) => {
        const mainApplication = config.modResults.manifest.application?.[0];
        if (!mainApplication)
            return config;
        const packageName = config.modResults.manifest.$?.package || config.android?.package;
        if (!packageName)
            return config;
        // 1. Give host MainActivity a DEFAULT category MAIN intent-filter so ADB am start succeeds while OS launcher uses activity-aliases
        const activities = (mainApplication.activity || []);
        const mainActivity = activities.find((act) => act.$?.['android:name'] === '.MainActivity' || act.$?.['android:name'] === `${packageName}.MainActivity`);
        if (mainActivity) {
            removeLauncherCategoryFromMainActivity(mainActivity);
            ensureDefaultMainIntentFilter(mainActivity);
        }
        const firstIcon = icons[0] || 'apple';
        const resourceNameForIcon = (icon) => (icon === 'default' ? 'app_default' : icon);
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
        mainApplication['activity-alias'] = [
            defaultAlias,
            ...aliases,
        ];
        return config;
    });
};
exports.withDynamicIconAndroid = withDynamicIconAndroid;
