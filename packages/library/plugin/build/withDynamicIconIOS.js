"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDynamicIconIOS = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withDynamicIconIOS = (config, { icons }) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const alternateIcons = {};
        icons.forEach(icon => {
            alternateIcons[icon] = {
                CFBundleIconFiles: [icon],
                UIPrerenderedIcon: false
            };
        });
        config.modResults.CFBundleIcons = {
            CFBundlePrimaryIcon: config.modResults.CFBundleIcons?.CFBundlePrimaryIcon,
            CFBundleAlternateIcons: alternateIcons
        };
        return config;
    });
};
exports.withDynamicIconIOS = withDynamicIconIOS;
