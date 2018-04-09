cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.acuant.plugin.AcuantMobileSDK.AcuantMobileSDK",
        "file": "plugins/com.acuant.plugin.AcuantMobileSDK/www/AcuantMobileSDK.js",
        "pluginId": "com.acuant.plugin.AcuantMobileSDK",
        "clobbers": [
            "AcuantMobileSDK"
        ]
    },
    {
        "id": "cordova-plugin-console.console",
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "console"
        ]
    },
    {
        "id": "cordova-plugin-console.logger",
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "id": "cordova-plugin-network-information.network",
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "id": "cordova-plugin-network-information.Connection",
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "id": "sdgc-cordova-native-dialogs.notification",
        "file": "plugins/sdgc-cordova-native-dialogs/www/notification.js",
        "pluginId": "sdgc-cordova-native-dialogs",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.acuant.plugin.AcuantMobileSDK": "2.7.0",
    "com.napolitano.cordova.plugin.intent": "0.1.2",
    "cordova-plugin-compat": "1.2.0",
    "cordova-plugin-console": "1.1.0",
    "cordova-plugin-network-information": "2.0.1",
    "cordova-plugin-whitelist": "1.3.3",
    "sdgc-cordova-native-dialogs": "1.0.0"
};
// BOTTOM OF METADATA
});