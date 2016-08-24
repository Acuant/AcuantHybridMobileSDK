/*global cordova, module*/
    var isWindows = (cordova.platformId.localeCompare("windows") == 0);
    var AcuantWinRT = null;
    if(isWindows==true){
        AcuantWinRT = AcuantWindowsMobileSDKWinRTComponent;
    }
    function arrayBufferToBase64 (buffer) {
        if (buffer == null) {
            return null;
        }
        if (typeof buffer === 'string') {
            return buffer;
        }
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    function checkError(result, cardType) {
        var data = JSON.parse(result);
        var errorMessage = "";
        if (data.ResponseCodeAuthorization<0) {
            errorMessage = data.ResponseMessageAuthorization;
            return errorMessage;
        }
        if (data.WebResponseCode < 1) {
            errorMessage = data.WebResponseDescription;
            return errorMessage;
        }
        if (cardType == 1) {//Medical Card
            if (data.ResponseCodeProcMedicalCard < 0) {
                errorMessage = data.ResponseCodeProcMedicalCardDesc;
                return errorMessage;
            }

        } else if (cardType == 2) {//DL
            if (data.ResponseCodeProcBarcode < 0) {
                errorMessage = data.ResponseCodeProcBarcodeDesc;
                return errorMessage;
            }
            if (data.ResponseCodeAutoDetectState < 0) {
                errorMessage = data.ResponseCodeAutoDetectStateDesc;
                return errorMessage;
            }
            if (data.ResponseCodeProcState < 0) {
                errorMessage = data.ResponseCodeProcStateDesc;
                return errorMessage;
            }

        } else if (cardType == 3) {//Passport
            if (data.ResponseCodeProcPassport < 0) {
                errorMessage = data.ResponseCodeProcPassportDesc;
                return errorMessage;
            }

        }
    }
    module.exports = {
    initAcuantMobileSDK: function (successCallback, failure, licenseKey, cloudAddress) {
        if (licenseKey === null) {
            licenseKey = "";
        }
        if (cloudAddress === null) {
            cloudAddress = "";
        }
        if (isWindows) {
            AcuantWinRT.API.Utils.licenseKey = licenseKey;
            if (cloudAddress == "") {
                AcuantWinRT.API.Utils.cloudAddress = "cssnwebservices.com";
            } else {
                AcuantWinRT.API.Utils.cloudAddress = cloudAddress;
            }
        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "initAcuantMobileSDK", [licenseKey, cloudAddress]);
        }
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
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController", [licenseKey, cardType, region, isBackSide]);
        }
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
        if (isWindows) {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL
            });
            function onSuccess(imageData) {
                var data = {};
                data["id"] = "didCardCroppingStart";
                successCallback(data);
                if (isBackSide) {
                    if (cardType == 1) {
                        AcuantWinRT.API.Camera.cropInsuranceCard(imageData, AcuantWinRT.API.Utils.getWidth()).then(function (croppedImage) {
                            var data = {};
                            data["data"] = croppedImage;
                            data["id"] = "didCaptureCropImage";
                            successCallback(data);
                        });
                    } else if (cardType == 2) {
                        AcuantWinRT.API.Camera.cropDL(imageData, AcuantWinRT.API.Utils.getWidth()).then(function (croppedImg) {
                            var data = {};
                            data["data"] = croppedImg;
                            data["id"] = "didCaptureCropImage";
                            successCallback(data);
                        });
                    }
                } else {
                    if (cardType == 3) {
                        AcuantWinRT.API.Camera.cropPassport(imageData, AcuantWinRT.API.Utils.getWidth()).then(function (croppedImage) {
                            var data = {};
                            data["data"] = croppedImage;
                            data["id"] = "didCaptureCropImage";
                            successCallback(data);
                        });
                    } else if (cardType == 2) {
                        AcuantWinRT.API.Camera.cropDL(imageData, AcuantWinRT.API.Utils.getWidth()).then(function (croppedImage) {
                            var data = {};
                            data["data"] = croppedImage;
                            data["id"] = "didCaptureCropImage";
                            successCallback(data);
                        });
                    } else if (cardType == 1) {
                        AcuantWinRT.API.Camera.cropInsuranceCard(imageData, AcuantWinRT.API.Utils.getWidth()).then(function (croppedImage) {
                            if (isFrontSide) {
                                var data = {};
                                data["data"] = croppedImage;
                                data["id"] = "didCaptureCropImage";
                                successCallback(data);
                            }
                        });
                    }
                }
            
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "showManualCameraInterfaceInViewController", [cardType, region, isBackSide]);
        }
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
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "showBarcodeCameraInterfaceInViewController", [cardType, region]);
        }
    },
    dismissCardCaptureInterface: function (successCallback, failure) {
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "dismissCardCaptureInterface", []);
        }
    },
    startCamera: function (successCallback, failure) {
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "startCamera", []);
        }
    },
    stopCamera: function (successCallback, failure) {
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "stopCamera", []);
        }
    },
    pauseScanningBarcodeCamera: function (successCallback, failure) {
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "pauseScanningBarcodeCamera", []);
        }
    },
    resumeScanningBarcodeCamera: function (successCallback, failure) {
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "resumeScanningBarcodeCamera", []);
        }
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
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCloudAddress", [cloudAddress]);
        }
    },
    activateLicenseKey: function (successCallback, failure, licenseKey) {
        if (licenseKey === null || licenseKey === "") {
            licenseKey = "";
            failure({
                "errorType" : true,
                "id": "activateLicenseKey",
                "errorMessage": "The license key cannot be empty."
            });
            return;
        }
        if (isWindows) {
            var promise = AcuantWinRT.API.ActivateLicenseKey.activateLicKey(licenseKey);
            promise.then(function (result) {
                var data = JSON.parse(result);
                navigator.notification.alert(
                 data.IsLicenseKeyActivatedDesc,
                 alertCallback,
                 'AcuantHybridSampleSDK',
                 'OK'
                 );
            });

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "activateLicenseKey", [licenseKey]);
        }
    },
    setWidth: function (successCallback, failure, width) {
        if ((typeof width !== 'number')) {
            failure({
                "id": "setWidth",
                "error": "Width Must Be Int"
            });
            return;
        }
        if (isWindows) {
            AcuantWinRT.API.Utils.setWidth(width);
        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "setWidth", [width]);
        }
    },
    setCanCropBarcode: function(successCallback, failure, canCropBarcode){
        if ((typeof canCropBarcode !== 'boolean')) {
            failure({
                "id": "setCanCropBarcode",
                "error": "canCropBarcode Must Be Boolean"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCanCropBarcode", [canCropBarcode]);
        }
    },
        setCanShowMessage: function(successCallback, failure, canShowMessage){
            if ((typeof canShowMessage !== 'boolean')) {
                failure({
                    "id": "setCanShowMessage",
                    "error": "canShowMessage Must Be Boolean"
                });
                return;
            }
            if (isWindows) {

            } else {
                cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCanShowMessage", [canShowMessage]);
            }
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
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "setInitialMessage", [initialMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation]);
        }
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
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "setCapturingMessage", [capturingMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation]);
        }
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
        if (isWindows) {
            if (cardType == 1) {
                AcuantWinRT.API.MedicalInsuranceCards.frontBase64 = frontCardImage;
                AcuantWinRT.API.MedicalInsuranceCards.backBase64 = backCardImage;
                AcuantWinRT.API.MedicalInsuranceCards.reformatImage = true;
                AcuantWinRT.API.MedicalInsuranceCards.reformatImageColor = 0;
                AcuantWinRT.API.MedicalInsuranceCards.reformatImageDPI = 150;
                AcuantWinRT.API.MedicalInsuranceCards.cropImage = false;
                AcuantWinRT.API.MedicalInsuranceCards.processMedicalInsuranceCard().then(function (result) {
                    var errMessage = checkError(result, cardType);
                    if (errMessage != null && errMessage != "") {
                        failure({
                            "errorType": true,
                            "id": "didFailWithError",
                            "errorMessage": errMessage
                        });
                        return;
                    }
                    var data = {};
                    data["id"] = "didFinishProcessingCardWithResult";
                    data["data"] = JSON.parse(result);
                    data.data["reformattedImage"] = arrayBufferToBase64(data["data"].ReformattedImage);
                    delete data.data.ReformattedImage;
                    data.data["reformattedImageTwo"] = arrayBufferToBase64(data["data"].ReformattedImageTwo);
                    delete data.data.ReformattedImageTwo;
                    data.data.firstName = data.data.FirstName; delete data.data.FirstName;
                    data.data.lastName = data.data.LastName;delete data.data.LastName;
                    data.data.middleName = data.data.MiddleName;delete data.data.MiddleName;
                    data.data.memberId = data.data.MemberId;delete data.data.MemberId;
                    data.data.groupNumber = data.data.GroupNumber;delete data.data.GroupNumber;
                    data.data.contractCode = data.data.ContractCode;delete data.data.ContractCode;
                    data.data.copayEr = data.data.CopayEr;delete data.data.CopayEr;
                    data.data.copayOv = data.data.CopayOv;delete data.data.CopayOv;
                    data.data.copaySp = data.data.CopaySp;delete data.data.CopaySp;
                    data.data.copayUc = data.data.CopayUc;delete data.data.CopayUc;
                    data.data.coverage = data.data.Coverage;delete data.data.Coverage;
                    data.data.dateOfBirth = data.data.DateOfBirth;delete data.data.DateOfBirth;
                    data.data.deductible = data.data.Deductible;delete data.data.Deductible;
                    data.data.effectiveDate = data.data.EffectiveDate;delete data.data.EffectiveDate;
                    data.data.employer = data.data.Employer;delete data.data.Employer;
                    data.data.expirationDate = data.data.ExpirationDate;delete data.data.ExpirationDate;
                    data.data.groupName = data.data.GroupName;delete data.data.GroupName;
                    data.data.issuerNumber = data.data.IssuerNumber;delete data.data.IssuerNumber;
                    data.data.other = data.data.Other;delete data.data.Other;
                    data.data.payerId = data.data.PayerId;delete data.data.PayerId;
                    data.data.planAdmin = data.data.PlanAdmin;delete data.data.PlanAdmin;
                    data.data.planProvider = data.data.PlanProvider;delete data.data.PlanProvider;
                    data.data.planType = data.data.PlanType;delete data.data.PlanType;
                    data.data.rxBin = data.data.RxBin;delete data.data.RxBin;
                    data.data.rxGroup = data.data.RxGroup;delete data.data.RxGroup;
                    data.data.rxId = data.data.RxId;delete data.data.RxId;
                    data.data.rxPcn = data.data.RxPcn;delete data.data.RxPcn;
                    data.data.phoneNumber = data.data.PhoneNumber;delete data.data.PhoneNumber;
                    data.data.webAddress = data.data.WebAddress;delete data.data.WebAddress;
                    data.data.email = data.data.Email;delete data.data.Email;
                    data.data.fullAddress = data.data.FullAddress;delete data.data.FullAddress;
                    data.data.city = data.data.City;delete data.data.City;
                    data.data.zip = data.data.Zip;delete data.data.Zip;
                    data.data.state = data.data.State;delete data.data.State;

                    successCallback(data);
                });
            } else if (cardType == 2) {
                AcuantWinRT.API.IDDuplex.frontBase64 = frontCardImage;
                AcuantWinRT.API.IDDuplex.backBase64 = backCardImage;
                AcuantWinRT.API.IDDuplex.autoDetectState = true;
                AcuantWinRT.API.IDDuplex.stateId = -1;
                AcuantWinRT.API.IDDuplex.reformatImage = true;
                AcuantWinRT.API.IDDuplex.reformatImageColor = 0;
                AcuantWinRT.API.IDDuplex.reformatImageDPI = 150;
                AcuantWinRT.API.IDDuplex.cropImage = false;
                AcuantWinRT.API.IDDuplex.faceImage = true;
                AcuantWinRT.API.IDDuplex.signatureImage = true;
                AcuantWinRT.API.IDDuplex.regionId = cardRegion;
                AcuantWinRT.API.IDDuplex.imageSource = 101;
                AcuantWinRT.API.IDDuplex.processIDDuplex().then(function (result) {
                    var errMessage = checkError(result,cardType);
                    if (errMessage!=null && errMessage != "") {
                        failure({
                            "errorType":true,
                            "id": "didFailWithError",
                            "errorMessage": errMessage
                        });
                        return;
                    }
                    var data = {};
                    data["id"] = "didFinishProcessingCardWithResult";
                    data["data"] = JSON.parse(result);

                    data.data.licenceImage = arrayBufferToBase64(data.data.ReformattedImage);
                    delete data.data.ReformattedImage;
                    data.data.licenceImageTwo = arrayBufferToBase64(data.data.ReformattedImageTwo);
                    delete data.data.ReformattedImageTwo;
                    data.data.faceImage = arrayBufferToBase64(data.data.FaceImage);
                    delete data.data.FaceImage;
                    data.data.signatureImage = arrayBufferToBase64(data.data.SignImage);
                    delete data.data.SignImage;

                    data.data.nameFirst = data.data.NameFirst; delete data.data.NameFirst;
                    data.data.nameMiddle = data.data.NameMiddle; delete data.data.NameMiddle;
                    data.data.nameLast = data.data.NameLast; delete data.data.NameLast;
                    data.data.nameSuffix = data.data.NameSuffix; delete data.data.NameSuffix;
                    data.data.licenceId = data.data.LicenceId; delete data.data.LicenceId;
                   // data.data.license = data.data.License; delete data.data.License;
                    data.data.dateOfBirth4 = data.data.DateOfBirth4; delete data.data.DateOfBirth4;
                    data.data.dateOfBirth = data.data.DateOfBirth; delete data.data.DateOfBirth;
                    data.data.dateOfBirthLocal = data.data.DateOfBirthLocal; delete data.data.DateOfBirthLocal;
                    data.data.issueDate4 = data.data.IssueDate4; delete data.data.IssueDate4;
                    data.data.issueDate = data.data.IssueDate; delete data.data.IssueDate;
                    data.data.issueDateLocal = data.data.IssueDateLocal; delete data.data.IssueDateLocal;
                    data.data.expirationDate4 = data.data.ExpirationDate4; delete data.data.ExpirationDate4;
                    data.data.expirationDate = data.data.ExpirationDate; delete data.data.ExpirationDate;
                    data.data.eyeColor = data.data.Eyes; delete data.data.Eyes;
                    data.data.hairColor = data.data.Hair; delete data.data.Hair;
                    data.data.height = data.data.Height; delete data.data.Height;
                    data.data.weight = data.data.Weight; delete data.data.Weight;
                    data.data.address = data.data.Address; delete data.data.Address;
                    data.data.address2 = data.data.Address2; delete data.data.Address2;
                    data.data.address3 = data.data.Address3; delete data.data.Address3;
                    data.data.address4 = data.data.Address4; delete data.data.Address4;
                    data.data.address5 = data.data.Address5; delete data.data.Address5;
                    data.data.address6 = data.data.Address6; delete data.data.Address6;
                    data.data.city = data.data.City; delete data.data.City;
                    data.data.zip = data.data.Zip; delete data.data.Zip;
                    data.data.state = data.data.State; delete data.data.State;
                    data.data.county = data.data.County; delete data.data.County;
                    data.data.countryShort = data.data.CountryShort; delete data.data.CountryShort;
                    data.data.idCountry = data.data.IdCountry; delete data.data.IdCountry;
                    data.data.licenceId = data.data.Id; delete data.data.Id;
                    data.data.licenceClass = data.data.Class; delete data.data.Class;
                    data.data.restriction = data.data.Restriction; delete data.data.Restriction;
                    data.data.sex = data.data.Sex; delete data.data.Sex;
                    data.data.audit = data.data.Audit; delete data.data.Audit;
                    data.data.endorsements = data.data.Endorsements; delete data.data.Endorsements;
                    data.data.fee = data.data.Fee; delete data.data.Fee;
                    //data.data.CSC
                    data.data.sigNum = data.data.SigNum; delete data.data.SigNum;
                    data.data.text1 = data.data.Text1; delete data.data.Text1;
                    data.data.text2 = data.data.Text2; delete data.data.Text2;
                    data.data.text3 = data.data.Text3; delete data.data.Text3;
                    data.data.type = data.data.Type; delete data.data.Type;
                    data.data.docType = data.data.DocType; delete data.data.DocType;
                    data.data.fatherName = data.data.FatherName; delete data.data.FatherName;
                    data.data.motherName = data.data.MotherName; delete data.data.MotherName;
                    data.data.nameFirst_NonMRZ = data.data.NameFirst_NonMRZ; delete data.data.NameFirst_NonMRZ;
                    data.data.nameLast_NonMRZ = data.data.NameLast_NonMRZ; delete data.data.NameLast_NonMRZ;
                    data.data.nameLast1 = data.data.NameLast1; delete data.data.NameLast1;
                    data.data.nameLast2 = data.data.NameLast2; delete data.data.NameLast2;
                    data.data.nameMiddle_NonMRZ = data.data.NameMiddle_NonMRZ; delete data.data.NameMiddle_NonMRZ;
                    data.data.nameSuffix_NonMRZ = data.data.NameSuffix_NonMRZ; delete data.data.NameSuffix_NonMRZ;
                    data.data.documentDetectedName = data.data.DocumentDetectedName; delete data.data.DocumentDetectedName;
                    data.data.nationality = data.data.Nationality; delete data.data.Nationality;
                    data.data.original = data.data.Original; delete data.data.Original;
                    data.data.placeOfBirth = data.data.PlaceOfBirth; delete data.data.PlaceOfBirth;
                    data.data.placeOfIssue = data.data.PlaceOfIssue; delete data.data.PlaceOfIssue;
                    data.data.socialSecurity = data.data.SocialSecurity; delete data.data.SocialSecurity;
                    data.data.isAddressCorrected = data.data.IsAddressCorrected; delete data.data.IsAddressCorrected;
                    data.data.isAddressVerified = data.data.IsAddressVerified; delete data.data.IsAddressVerified;
                    data.data.isBarcodeRead = data.data.IsBarcodeRead; delete data.data.IsBarcodeRead;
                    data.data.isIDVerified = data.data.IsIDVerified; delete data.data.IsIDVerified;
                    data.data.isOcrRead = data.data.IsOcrRead; delete data.data.IsOcrRead;
                    data.data.documentVerificationRating = data.data.DocumentVerificationConfidenceRating; delete data.data.DocumentVerificationConfidenceRating;

                    successCallback(data);
                });
            } else if (cardType == 3) {
                AcuantWinRT.API.Passport.imageBase64 = frontCardImage;
                AcuantWinRT.API.Passport.reformatImage = true;
                AcuantWinRT.API.Passport.reformatImageColor = 0;
                AcuantWinRT.API.Passport.reformatImageDPI = 150;
                AcuantWinRT.API.Passport.cropImage = false;
                AcuantWinRT.API.Passport.faceImage = true;
                AcuantWinRT.API.Passport.signatureImage = true;
                AcuantWinRT.API.Passport.imageSource = 101;
                AcuantWinRT.API.Passport.processPassport().then(function (result) {
                    var errMessage = checkError(result, cardType);
                    if (errMessage != null && errMessage != "") {
                        failure({
                            "errorType": true,
                            "id": "didFailWithError",
                            "errorMessage": errMessage
                        });
                        return;
                    }
                    var data = {};
                    data["id"] = "didFinishProcessingCardWithResult";
                    data["data"] = JSON.parse(result);
                    data.data.passportImage = arrayBufferToBase64(data.data.ReformattedImage);
                    delete data.data.ReformattedImage;
                    data.data.faceImage = arrayBufferToBase64(data.data.FaceImage);
                    delete data.data.FaceImage;
                    data.data.signImage = arrayBufferToBase64(data.data.SignImage);
                    delete data.data.SignImage;

                    data.data.nameFirst = data.data.NameFirst; delete data.data.NameFirst;
                    data.data.nameMiddle = data.data.NameMiddle; delete data.data.NameMiddle;
                    data.data.nameLast = data.data.NameLast; delete data.data.NameLast;
                    data.data.passportNumber = data.data.PassportNumber; delete data.data.PassportNumber;
                    data.data.personalNumber = data.data.PersonalNumber; delete data.data.PersonalNumber;
                    data.data.sex = data.data.sex; delete data.data.Sex;
                    data.data.countryLong = data.data.CountryLong; delete data.data.CountryLong;
                    data.data.nationalityLong = data.data.NationalityLong; delete data.data.NationalityLong;
                    data.data.dateOfBirth4 = data.data.DateOfBirth4; delete data.data.DateOfBirth4;
                    data.data.issueDate4 = data.data.IssueDate4; delete data.data.IssueDate4;
                    data.data.expirationDate4 = data.data.ExpirationDate4; delete data.data.ExpirationDate4;
                    data.data.end_POB = data.data.End_POB; delete data.data.End_POB;

                    successCallback(data);
                });
            }
        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "processCardImage", [frontImage, backImage, barcodeStringData, autoDetectState, stateID, reformatImage, reformatImageColor, DPI, cropImage, faceDetection, signatureDetection, region, imageSource]);
        }
    },
    cameraPrefersStatusBarHidden: function (successCallback, failure, hiddenStatusBar) {
        if ((typeof hiddenStatusBar !== 'boolean')) {
            failure({
                "id": "cameraPrefersStatusBarHidden",
                "error": "Show Back Button Must Be Boolean"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "cameraPrefersStatusBarHidden", [hiddenStatusBar]);
        }
    },
    frameForWatermarkView: function (successCallback, failure, frameX, frameY, frameWidth, frameHeight) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "frameForWatermarkView",
                "error": "Frame Must Be Int"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForWatermarkView", [frameX, frameY, frameWidth, frameHeight]);
        }
    },
    stringForWatermarkLabel: function (successCallback, failure, watermarkLabel) {
        if (watermarkLabel === null) {
            failure({
                "id": "stringForWatermarkLabel",
                "error": "Watermark Label Is Null"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "stringForWatermarkLabel", [watermarkLabel]);
        }
    },
    frameForHelpImageView: function (successCallback, failure, frameX, frameY, frameWidth, frameHeight) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "frameForHelpImageView",
                "error": "Frame Must Be Int"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForHelpImageView", [frameX, frameY, frameWidth, frameHeight]);
        }
    },
    imageForHelpImageView: function (successCallback, failure, helpImage) {
        if (helpImage === null) {
            failure({
                "id": "imageForHelpImageView",
                "error": "Help Image Is Null"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "imageForHelpImageView", [helpImage]);
        }
    },
    showBackButton: function (successCallback, failure, showBackButton) {
        if ((typeof showBackButton !== 'boolean')) {
            failure({
                "id": "showBackButton",
                "error": "Show Back Button Must Be Boolean"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "showBackButton", [showBackButton]);
        }
    },
    frameForBackButton: function (successCallback, failure, frameX, frameY, frameWidth, frameHeight) {
        if ((typeof frameX !== 'number') || (typeof frameY !== 'number') || (typeof frameWidth !== 'number') || (typeof frameHeight !== 'number')) {
            failure({
                "id": "frameForBackButton",
                "error": "Frame Must Be Int"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForBackButton", [frameX, frameY, frameWidth, frameHeight]);
        }
    },
    imageForBackButton: function (successCallback, failure, backButtonImage) {
        if (backButtonImage === null) {
            failure({
                "id": "imageForBackButton",
                "error": "Back Button Image Is Null"
            });
            return;
        }
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "imageForBackButton", [backButtonImage]);
        }
    },
    showiPadBrackets: function (successCallback, failure, showiPadBrackets) {
        if ((typeof showBackButton !== 'boolean')) {
            failure({
                "id": "showiPadBrackets",
                "error": "show iPad Brackets Button Must Be Boolean"
            });
            return;
        }
        if (isWindows) {

        } else {

            cordova.exec(successCallback, failure, "AcuantMobileSDK", "showiPadBrackets", [showiPadBrackets]);
        }
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
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "frameForFlashlightButton", [frameX, frameY, frameWidth, frameHeight]);
        }
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
        if (isWindows) {

        } else {
            cordova.exec(successCallback, failure, "AcuantMobileSDK", "imageForFlashlightButton", [flashlightButtonImageOn, flashlightButtonImageOff]);
        }
   }
};
