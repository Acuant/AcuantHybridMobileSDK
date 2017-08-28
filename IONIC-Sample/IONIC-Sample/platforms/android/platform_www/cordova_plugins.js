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
        "id": "com.napolitano.cordova.plugin.intent.IntentPlugin",
        "file": "plugins/com.napolitano.cordova.plugin.intent/www/android/IntentPlugin.js",
        "pluginId": "com.napolitano.cordova.plugin.intent",
        "clobbers": [
            "IntentPlugin"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
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
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "ionic-plugin-keyboard.keyboard",
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "id": "sdgc-cordova-native-dialogs.notification",
        "file": "plugins/sdgc-cordova-native-dialogs/www/notification.js",
        "pluginId": "sdgc-cordova-native-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "sdgc-cordova-native-dialogs.notification_android",
        "file": "plugins/sdgc-cordova-native-dialogs/www/android/notification.js",
        "pluginId": "sdgc-cordova-native-dialogs",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.acuant.plugin.AcuantMobileSDK": "2.5.0",
    "com.napolitano.cordova.plugin.intent": "0.1.2",
    "cordova-plugin-compat": "1.1.0",
    "cordova-plugin-console": "1.0.5",
    "cordova-plugin-device": "1.1.4",
    "cordova-plugin-network-information": "1.3.3",
    "cordova-plugin-splashscreen": "4.0.3",
    "cordova-plugin-statusbar": "2.2.2",
    "cordova-plugin-whitelist": "1.3.1",
    "ionic-plugin-keyboard": "2.2.1",
    "sdgc-cordova-native-dialogs": "1.0.0"
};
// BOTTOM OF METADATA
});