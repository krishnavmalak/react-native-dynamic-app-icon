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
exports.withDynamicIconIOS = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withDynamicIconIOS = (config, { icons }) => {
    // 1. Update Info.plist - only inject alternate icons, preserve everything else
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const alternateIcons = {};
        icons.forEach(icon => {
            alternateIcons[icon] = {
                CFBundleIconFiles: [icon],
                UIPrerenderedIcon: false
            };
        });
        // Merge into existing CFBundleIcons, but if CFBundlePrimaryIcon is missing, we MUST define it
        // otherwise iOS will show a blank primary icon when CFBundleIcons is declared.
        const existing = config.modResults.CFBundleIcons || {};
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
    config = (0, config_plugins_1.withDangerousMod)(config, [
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
    config = (0, config_plugins_1.withXcodeProject)(config, (config) => {
        const projectName = config.modRequest.projectName || config.name;
        const project = config.modResults;
        icons.forEach(icon => {
            ['', '@2x', '@3x'].forEach(suffix => {
                const iconPath = path.join(projectName, `${icon}${suffix}.png`);
                config_plugins_1.IOSConfig.XcodeUtils.addResourceFileToGroup({
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
exports.withDynamicIconIOS = withDynamicIconIOS;
