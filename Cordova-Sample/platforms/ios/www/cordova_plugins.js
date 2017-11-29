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
    "id": "cordova-plugin-camera.Camera",
    "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "Camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverOptions",
    "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverOptions"
    ]
  },
  {
    "id": "cordova-plugin-camera.camera",
    "file": "plugins/cordova-plugin-camera/www/Camera.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "navigator.camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverHandle",
    "file": "plugins/cordova-plugin-camera/www/ios/CameraPopoverHandle.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverHandle"
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
    "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
    "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
    "pluginId": "phonegap-plugin-barcodescanner",
    "clobbers": [
      "cordova.plugins.barcodeScanner"
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
  "com.acuant.plugin.AcuantMobileSDK": "2.5.1",
  "com.napolitano.cordova.plugin.intent": "0.1.2",
  "cordova-plugin-compat": "1.0.0",
  "cordova-plugin-camera": "2.2.0",
  "cordova-plugin-network-information": "1.2.1",
  "cordova-plugin-whitelist": "1.2.2",
  "phonegap-plugin-barcodescanner": "6.0.8",
  "sdgc-cordova-native-dialogs": "1.0.0"
};
// BOTTOM OF METADATA
});