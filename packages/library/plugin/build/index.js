"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withDynamicIconAndroid_1 = require("./withDynamicIconAndroid");
const withDynamicIconIOS_1 = require("./withDynamicIconIOS");
const withDynamicBranding = (config, props) => {
    return (0, config_plugins_1.withPlugins)(config, [
        [withDynamicIconAndroid_1.withDynamicIconAndroid, props],
        [withDynamicIconIOS_1.withDynamicIconIOS, props],
    ]);
};
exports.default = withDynamicBranding;
