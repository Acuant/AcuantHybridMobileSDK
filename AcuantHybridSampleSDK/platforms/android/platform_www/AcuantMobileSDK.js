/*global cordova, module*/

module.exports = {
    initAcuantMobileSDK: function (successCallback, failure, licenseKey, cloudAddress) {
        if (licenseKey === null) {
            licenseKey = "";
        }
        if (cloudAddress === null) {
            cloudAddress = "";
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "initAcuantMobileSDK", [licenseKey, cloudAddress]);
    },
    initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController: function (successCallback, failure, licenseKey, cardType, region, isBackSide) {
        if (licenseKey === null) {
            licenseKey = "";
        }
        if (cloudAddress === null) {
            cloudAddress = "";
        }

        if ((typeof cardType !== 'number')) {
            failure({
                "id": "initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController",
                "error": "Card Type Must Be Int"
            });
            return;
        }
        if ((typeof region !== 'number') && (cardType == 2)) {
            failure({
                "id": "initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController",
                "error": "Region Must Be Int"
            });
            return;
        }

        if ((typeof isBackSide !== 'boolean') && (cardType == 2)) {
            failure({
                "id": "initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController",
                "error": "isBackSide Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController", [licenseKey, cardType, region, isBackSide]);
    },
    showManualCameraInterfaceInViewController: function (successCallback, failure, cardType, region, isBackSide) {
        if ((typeof cardType !== 'number')) {
            failure({
                "id": "showManualCameraInterfaceInViewController",
                "error": "Card Type Must Be Int"
            });
            return;
        }
        if ((typeof region !== 'number') && (cardType == 2)) {
            failure({
                "id": "showManualCameraInterfaceInViewController",
                "error": "Region Must Be Int"
            });
            return;
        }
        if ((typeof isBackSide !== 'boolean') && (cardType == 2)) {
            failure({
                "id": "showManualCameraInterfaceInViewController",
                "error": "isBackSide Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "showManualCameraInterfaceInViewController", [cardType, region, isBackSide]);
    },
    showBarcodeCameraInterfaceInViewController: function (successCallback, failure, cardType, region) {
        if ((typeof cardType !== 'number')) {
            failure({
                "id": "showBarcodeCameraInterfaceInViewController",
                "error": "Card Type Must Be Int"
            });
            return;
        }
        if ((typeof region !== 'number') && (cardType == 2)) {
            failure({
                "id": "showBarcodeCameraInterfaceInViewController",
                "error": "Region Must Be Int"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "showBarcodeCameraInterfaceInViewController", [cardType, region]);
    },
    dismissCardCaptureInterface: function (successCallback, failure) {
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "dismissCardCaptureInterface", []);
    },
    startCamera: function (successCallback, failure) {
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "startCamera", []);
    },
    stopCamera: function (successCallback, failure) {
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "stopCamera", []);
    },
    pauseScanningBarcodeCamera: function (successCallback, failure) {
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "pauseScanningBarcodeCamera", []);
    },
    resumeScanningBarcodeCamera: function (successCallback, failure) {
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "resumeScanningBarcodeCamera", []);
    },
    setLicenseKey: function (successCallback, failure, licenseKey) {
        if (licenseKey === null) {
            licenseKey = "";
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "setLicenseKey", [licenseKey]);
    },
    setCloudAddress: function (successCallback, failure, cloudAddress) {
        if (cloudAddress === null) {
            cloudAddress = "";
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCloudAddress", [cloudAddress]);
    },
    activateLicenseKey: function (successCallback, failure, licenseKey) {
        if (licenseKey === null || licenseKey === "") {
            licenseKey = "";
            failure({
                "id": "activateLicenseKey",
                "error": "The license key cannot be empty."
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "activateLicenseKey", [licenseKey]);
    },
    setWidth: function (successCallback, failure, width) {
        if ((typeof width !== 'number')) {
            failure({
                "id": "setWidth",
                "error": "Width Must Be Int"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "setWidth", [width]);
    },
    setCanCropBarcode: function(successCallback, failure, canCropBarcode){
        if ((typeof canCropBarcode !== 'boolean')) {
            failure({
                "id": "setCanCropBarcode",
                "error": "canCropBarcode Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCanCropBarcode", [canCropBarcode]);
    },
    setCanShowMessage: function(successCallback, failure, canShowMessage){
        if ((typeof canShowMessage !== 'boolean')) {
            failure({
                "id": "setCanShowMessage",
                "error": "canShowMessage Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCanShowMessage", [canShowMessage]);
    },
    //Orientation: Landscape - 0, Portrait - 1, BackgroundColorRed: 0 - 255, BackgroundColorGreen: 0 - 255, BackgroundColorBlue: 0 - 255, BackgroundColorAlpha: 0 - 255
    setInitialMessage: function (successCallback, failure, initialMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "setInitialMessage",
                "error": "Frame Must Be Int"
            });
            return;
        }
        if ((typeof backgroundColorRed !== 'number') || (typeof backgroundColorGreen !== 'number') || (typeof backgroundColorBlue !== 'number') || (typeof backgroundColorAlpha !== 'number')) {
            failure({
                "id": "setInitialMessage",
                "error": "Color Must Be Float"
            });
            return;
        }
        if ((backgroundColorRed < 0 && backgroundColorRed > 1) || (backgroundColorGreen < 0 && backgroundColorGreen > 1) || (backgroundColorBlue < 0 && backgroundColorBlue > 1) || (backgroundColorAlpha < 0 && backgroundColorAlpha > 1)) {
            failure({
                "id": "setInitialMessage",
                "error": "Duration Be Greather than 0 and Less 1"
            });
            return;
        }

        if ((typeof duration !== 'number')) {
            failure({
                "id": "setInitialMessage",
                "error": "Duration Must Be Int"
            });
            return;
        }
        if ((duration < 0)) {
            failure({
                "id": "setInitialMessage",
                "error": "Duration Must Be Greather Than 0"
            });
            return;
        }

        if ((typeof orientation !== 'number')) {
            failure({
                "id": "setInitialMessage",
                "error": "Orientation Must Be Float"
            });
            return;
        }
        if (orientation != 0 && orientation != 1) {
            failure({
                "id": "setInitialMessage",
                "error": "Orientation Must Be 0 or 1"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "setInitialMessage", [initialMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation]);
    },
    //Orientation: Landscape - 0, Portrait - 1, BackgroundColorRed: 0 - 255, BackgroundColorGreen: 0 - 255, BackgroundColorBlue: 0 - 255, BackgroundColorAlpha: 0 - 255
    setCapturingMessage: function (successCallback, failure, capturingMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "setCapturingMessage",
                "error": "Frame Must Be Int"
            });
            return;
        }
        if ((typeof backgroundColorRed !== 'number') || (typeof backgroundColorGreen !== 'number') || (typeof backgroundColorBlue !== 'number') || (typeof backgroundColorAlpha !== 'number')) {
            failure({
                "id": "setCapturingMessage",
                "error": "Color Must Be Float"
            });
            return;
        }
        if ((backgroundColorRed < 0 && backgroundColorRed > 1) || (backgroundColorGreen < 0 && backgroundColorGreen > 1) || (backgroundColorBlue < 0 && backgroundColorBlue > 1) || (backgroundColorAlpha < 0 && backgroundColorAlpha > 1)) {
            failure({
                "id": "setCapturingMessage",
                "error": "Duration Be Greather than 0 and Less 1"
            });
            return;
        }

        if ((typeof duration !== 'number')) {
            failure({
                "id": "setCapturingMessage",
                "error": "Duration Must Be Int"
            });
            return;
        }
        if ((duration < 0)) {
            failure({
                "id": "setCapturingMessage",
                "error": "Duration Must Be Greather Than 0"
            });
            return;
        }

        if ((typeof orientation !== 'number')) {
            failure({
                "id": "setCapturingMessage",
                "error": "Orientation Must Be Float"
            });
            return;
        }
        if (orientation != 0 && orientation != 1) {
            failure({
                "id": "setCapturingMessage",
                "error": "Orientation Must Be 0 or 1"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCapturingMessage", [capturingMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation]);
    },
    processCardImage: function (successCallback, failure, frontImage, backImage, barcodeStringData, autoDetectState, stateID, reformatImage, reformatImageColor, DPI, cropImage, faceDetection, signatureDetection, region, imageSource) {
        if ((typeof faceDetection !== 'boolean')) {
            failure({
                "id": "processCardImage",
                "error": "FaceDetection Must Be Boolean"
            });
            return;
        }
        if ((typeof signatureDetection !== 'boolean')) {
            failure({
                "id": "processCardImage",
                "error": "SignatureDetection Must Be Boolean"
            });
            return;
        }
        if ((typeof reformatImage !== 'boolean')) {
            failure({
                "id": "processCardImage",
                "error": "ReformatImage Must Be Boolean"
            });
            return;
        }
        if ((typeof autoDetectState !== 'boolean')) {
            failure({
                "id": "processCardImage",
                "error": "AutoDetectState Must Be Boolean"
            });
            return;
        }
        if ((typeof cropImage !== 'boolean')) {
            failure({
                "id": "processCardImage",
                "error": "CropImage Must Be Int"
            });
            return;
        }
        if ((typeof DPI !== 'number')) {
            failure({
                "id": "processCardImage",
                "error": "DPI Must Be Int"
            });
            return;
        }
        if ((typeof imageSource !== 'number')) {
            failure({
                "id": "processCardImage",
                "error": "ImageSource Must Be Int"
            });
            return;
        }
        if ((typeof region !== 'number') && (cardType == 2)) {
            failure({
                "id": "processCardImage",
                "error": "Region Must Be Int"
            });
            return;
        }

        if ((typeof stateID !== 'number')) {
            failure({
                "id": "processCardImage",
                "error": "StateID Must Be Int"
            });
            return;
        }
        if ((typeof reformatImageColor !== 'number')) {
            failure({
                "id": "processCardImage",
                "error": "ReformatImageColor Must Be Int"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "processCardImage", [frontImage, backImage, barcodeStringData, autoDetectState, stateID, reformatImage, reformatImageColor, DPI, cropImage, faceDetection, signatureDetection, region, imageSource]);
    },
    cameraPrefersStatusBarHidden: function (successCallback, failure, hiddenStatusBar) {
        if ((typeof hiddenStatusBar !== 'boolean')) {
            failure({
                "id": "cameraPrefersStatusBarHidden",
                "error": "Show Back Button Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "cameraPrefersStatusBarHidden", [hiddenStatusBar]);
    },
    frameForWatermarkView: function (successCallback, failure, frameX, frameY, frameWidth, frameHeight) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "frameForWatermarkView",
                "error": "Frame Must Be Int"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForWatermarkView", [frameX, frameY, frameWidth, frameHeight]);
    },
    stringForWatermarkLabel: function (successCallback, failure, watermarkLabel) {
        if (watermarkLabel === null) {
            failure({
                "id": "stringForWatermarkLabel",
                "error": "Watermark Label Is Null"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "stringForWatermarkLabel", [watermarkLabel]);
    },
    frameForHelpImageView: function (successCallback, failure, frameX, frameY, frameWidth, frameHeight) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "frameForHelpImageView",
                "error": "Frame Must Be Int"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForHelpImageView", [frameX, frameY, frameWidth, frameHeight]);
    },
    imageForHelpImageView: function (successCallback, failure, helpImage) {
        if (helpImage === null) {
            failure({
                "id": "imageForHelpImageView",
                "error": "Help Image Is Null"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "imageForHelpImageView", [helpImage]);
    },
    showBackButton: function (successCallback, failure, showBackButton) {
        if ((typeof showBackButton !== 'boolean')) {
            failure({
                "id": "showBackButton",
                "error": "Show Back Button Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "showBackButton", [showBackButton]);
    },
    frameForBackButton: function (successCallback, failure, frameX, frameY, frameWidth, frameHeight) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "frameForBackButton",
                "error": "Frame Must Be Int"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForBackButton", [frameX, frameY, frameWidth, frameHeight]);
    },
    imageForBackButton: function (successCallback, failure, backButtonImage) {
        if (backButtonImage === null) {
            failure({
                "id": "imageForBackButton",
                "error": "Back Button Image Is Null"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "imageForBackButton", [backButtonImage]);
    },
    showiPadBrackets: function (successCallback, failure, showiPadBrackets) {
        if ((typeof showBackButton !== 'boolean')) {
            failure({
                "id": "showiPadBrackets",
                "error": "show iPad Brackets Button Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "showiPadBrackets", [showiPadBrackets]);
    },
    showFlashlightButton:function(successCallback, failure, showFlashlightButton){
        if ((typeof showFlashlightButton !== 'boolean')) {
            failure({
                "id": "showFlashlightButton",
                "error": "showFlashlightButton Must Be Boolean"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "showFlashlightButton", [showFlashlightButton]);
    },
    frameForFlashlightButton:function (successCallback, failure, frameX, frameY, frameWidth, frameHeight) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "frameForFlashlightButton",
                "error": "Frame Must Be Int"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForFlashlightButton", [frameX, frameY, frameWidth, frameHeight]);
    },    
    imageForFlashlightButton:function (successCallback, failure, flashlightButtonImageOn, flashlightButtonImageOff) {
        if (flashlightButtonImageOn === null) {
            failure({
                "id": "imageForFlashlightButton",
                "error": "Flashlight Button Image Is Null"
            });
            return;
        }
        if (flashlightButtonImageOff === null) {
            failure({
                "id": "imageForFlashlightButton",
                "error": "Flashlight Button Image Is Null"
            });
            return;
        }
        cordova.exec(successCallback, failure, "AcuantMobileSDK", "imageForFlashlightButton", [flashlightButtonImageOn, flashlightButtonImageOff]);
    }
};