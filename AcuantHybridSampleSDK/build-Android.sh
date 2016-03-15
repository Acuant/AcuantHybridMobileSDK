clear
echo "Build start on: "
echo ""
date
echo ""
cordova plugin rm com.acuant.plugin.AcuantMobileSDK
cordova plugin add ../cordova-plugin-AcuantHybridSDK
cordova build android --device
echo ""
echo "Build done successfully on: "
echo ""
date
echo ""