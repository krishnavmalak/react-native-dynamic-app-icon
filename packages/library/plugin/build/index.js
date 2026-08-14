"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDynamicBranding = exports.withDynamicAppIcon = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withDynamicIconAndroid_1 = require("./withDynamicIconAndroid");
const withDynamicIconIOS_1 = require("./withDynamicIconIOS");
const withDynamicAppIcon = (config, props) => {
    return (0, config_plugins_1.withPlugins)(config, [
        [withDynamicIconAndroid_1.withDynamicIconAndroid, props],
        [withDynamicIconIOS_1.withDynamicIconIOS, props],
    ]);
};
exports.withDynamicAppIcon = withDynamicAppIcon;
exports.withDynamicBranding = exports.withDynamicAppIcon;
exports.default = exports.withDynamicAppIcon;
