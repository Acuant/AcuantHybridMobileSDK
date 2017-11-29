/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var agent = navigator.userAgent;
var isWebkit = (agent.indexOf("AppleWebKit") > 0);
var isIPad = (agent.indexOf("iPad") > 0);
var isIOS = (agent.indexOf("iPhone") > 0 || agent.indexOf("iPod") > 0);
var isAndroid = (agent.indexOf("Android") > 0);
var isWindows = (cordova.platformId.localeCompare("windows") == 0);
var deviceWidth = window.orientation == 0 ? window.screen.width : window.screen.height;
deviceWidth = deviceWidth / window.devicePixelRatio;
var isSmallScreen = (screen.width < 767 || (isAndroid && deviceWidth < 450));
var isUnknownMobile = (isWebkit && isSmallScreen);
var isMobile = (isIOS || isAndroid || isUnknownMobile);
var isTablet = (isIPad || (isMobile && !isSmallScreen));
var licenseKey = "XXXXXXXXXXX";
var isBarcodeSide;
var isFrontSide;
var debbug = false;
var cardType;
var prevCardType;
var cardRegion = 0;
var cardWidth;
var frontCardImage;
var backCardImage;
var originalImage;
var frontCardImageResult;
var backCardImageResult;
var faceImageResult;
var selfieImageData;
var signatureImageResult;
var barcodeStringData;
var backCardImageBase64;
var PDF417ImageBase64;
var cardResult;
var facialResult;
var frontCardText;
var backCardText;
var cardAspectRatio;
var isAssureIDAllowed = false;
var showBarcodeImage = false;
var isFacialAllowed = false;
var dataCaptured = false;


var log = function (message) {
    if (debbug) {
        console.log(message);
    }
};

var isMobile = {
    Android: function () {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function () {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function () {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Windows: function () {
        return /IEMobile/i.test(navigator.userAgent);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

var checkConnection = function () {
        var networkState = navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';

        if (networkState == Connection.NONE) {
            navigator.notification.alert(
                'The Internet connection appears to be offline.',
                alertCallback,
                'AcuantHybridSampleSDK',
                'OK'
                );
        }
};

/**
 * Convert an image
 * to a base64 url
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
var convertImgToBase64URL = function (url, callback, outputFormat) {
    log('convertImgToBase64URL');
    try {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.crossOrigin = 'Anonymous';

        img.onload = function () {
            log('convertImgToBase64URL onload');
            try {
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                callback.call(this, dataURL);
                // Clean up
                canvas = null;
            } catch (ex) {
                log('Error' + ex.message);
            }
        };
    } catch (ex) {
        log('Error' + ex.message);
    }
    img.src = url;
};

var convertFileToBase64viaFileReader = function (url, callback) {
    log('convertFileToBase64viaFileReader');
    try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            log('convertFileToBase64viaFileReader onload');
            var reader = new FileReader();
            reader.onloadend = function () {
                log('convertFileToBase64viaFileReader reader.onloadend');
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    } catch (ex) {
        log('Error' + ex.message);
    }
};

var backImageBase64Callback = function (data) {
    log("backImageBase64Callback" + data);
    backCardImageBase64 = data;
    AcuantMobileSDK.imageForBackButton(success, failure, backCardImageBase64);
};
var PDF417ImageBase64Callback = function (data) {
    log("PDF417ImageBase64Callback" + data);
    PDF417ImageBase64 = data;
    AcuantMobileSDK.imageForHelpImageView(success, failure, PDF417ImageBase64);
};
var alertCallback = function () {
    log('alertCallback');
};

var clearCardHolder = function () {
    frontCardImage = null;
    backCardImage = null;
    barcodeStringData = null;
    frontCardImageResult = null;
    backCardImageResult = null;
    faceImageResult = null;
    signatureImageResult = null;
    $("#front-image").empty();
    $("#front-image").addClass("bordered");
    $("#front-image").html(frontCardText);
    $("#back-image").empty();
    $("#back-image").addClass("bordered");
    $("#back-image").html(backCardText);
};

var loadResultScreen = function () {
    log('loadResultScreen: ' + cardResult);
    var resultString = "";
	$("#div-button-eChip").hide();
    if (cardType == 1) {
        frontCardImageResult = cardResult.reformattedImage;
        backCardImageResult = cardResult.reformattedImageTwo;
        resultString = "First Name - " + cardResult.firstName + "</br>Last Name -  " + cardResult.lastName + "</br>Middle Name -  " + cardResult.middleName + "</br>MemberID -  " + cardResult.memberId + "</br>Group No. -  " + cardResult.groupNumber + "</br>Contract Code -  " + cardResult.contractCode + "</br>Copay ER -  " + cardResult.copayEr + "</br>Copay OV -  " + cardResult.copayOv + "</br>Copay SP -  " + cardResult.copaySp + "</br>Copay UC -  " + cardResult.copayUc + "</br>Coverage -  " + cardResult.coverage + "</br>Date of Birth -  " + cardResult.dateOfBirth + "</br>Deductible -  " + cardResult.deductible + "</br>Effective Date -  " + cardResult.effectiveDate + "</br>Employer -  " + cardResult.employer + "</br>Expire Date -  " + cardResult.expirationDate + "</br>Group Name -  " + cardResult.groupName + "</br>Issuer Number -  " + cardResult.issuerNumber + "</br>Other -  " + cardResult.other + "</br>Payer ID -  " + cardResult.payerId + "</br>Plan Admin -  " + cardResult.planAdmin + "</br>Plan Provider -  " + cardResult.planProvider + "</br>Plan Type -  " + cardResult.planType + "</br>RX Bin -  " + cardResult.rxBin + "</br>RX Group -  " + cardResult.rxGroup + "</br>RX ID -  " + cardResult.rxId + "</br>RX PCN -  " + cardResult.rxPcn + "</br>Telephone -  " + cardResult.phoneNumber + "</br>Web -  " + cardResult.webAddress + "</br>Email -  " + cardResult.email + "</br>Address -  " + cardResult.fullAddress + "</br>City -  " + cardResult.city + "</br>Zip -  " + cardResult.zip + "</br>State -  " + cardResult.state;
    } else if (cardType == 3) {
    	if(isAndroid){
    		 $("#eChipDocNum").val(cardResult.passportNumber);
    		 $("#eChipDOB").val(cardResult.dateOfBirth4);
    		 $("#eChipDOE").val(cardResult.expirationDate4);

    		 $("#div-button-eChip").show();
    	}
        frontCardImageResult = cardResult.passportImage;
        faceImageResult = cardResult.faceImage;
        signatureImageResult = cardResult.signImage;
        resultString = "First Name -  " + cardResult.nameFirst + "</br>Middle Name -  " + cardResult.nameMiddle + "</br>Last Name -  " + cardResult.nameLast + "</br>Passport Number -  " + cardResult.passportNumber + "</br>Personal Number -  " + cardResult.personalNumber + "</br>Sex -  " + cardResult.sex + "</br>Country Long -  " + cardResult.countryLong + "</br>Nationality Long -  " + cardResult.nationalityLong + "</br>DOB Long -  " + cardResult.dateOfBirth4 + "</br>Issue Date Long -  " + cardResult.issueDate4 + "</br>Expiration Date Long -  " + cardResult.expirationDate4 + "</br>Place of Birth -  " + cardResult.end_POB;
        if(cardResult.authenticationResult!=null && cardResult.authenticationResult.length>0){
            resultString = resultString + "</br>Authentication Result -  " + cardResult.authenticationResult;
        }
        if(cardResult.authenticationResultSummaryList!=null && cardResult.authenticationResultSummaryList.length>0){
            resultString = resultString + "</br>Authentication Result Summary -  " + cardResult.authenticationResultSummaryList;
        }
        if(cardResult.idLocationCityTestResult!=2){
            resultString = resultString + "</br>idLocationCityTestResult -  " + cardResult.idLocationCityTestResult;
        }
        if(cardResult.idLocationCountryTestResult!=2){
            resultString = resultString + "</br>idLocationCountryTestResult -  " + cardResult.idLocationCountryTestResult;
        }
        if(cardResult.idLocationStateTestResult!=2){
            resultString = resultString + "</br>idLocationStateTestResult -  " + cardResult.idLocationStateTestResult;
        }
        if(cardResult.idLocationZipcodeTestResult!=2){
            resultString = resultString + "</br>idLocationZipcodeTestResult -  " + cardResult.idLocationZipcodeTestResult;
        }

        resultString = resultString + "</br>Device City -  " + cardResult.DeviceCity;
        resultString = resultString + "</br>Device Area -  " + cardResult.DeviceArea;
        resultString = resultString + "</br>Device State -  " + cardResult.DeviceState;
        resultString = resultString + "</br>Device Country -  " + cardResult.DeviceCountry;
        resultString = resultString + "</br>Device Country Code -  " + cardResult.DeviceCountryCode;
        resultString = resultString + "</br>Device Zipcode -  " + cardResult.DeviceZipcode;
        resultString = resultString + "</br>Device Street Address -  " + cardResult.DeviceStreetAddress;
        if(isFacialAllowed){
        	resultString = resultString + "</br>FacialMatch -  " + facialResult.FacialMatch;
        	resultString = resultString + "</br>FacialMatchConfidenceRating -  " + facialResult.FacialMatchConfidenceRating;
        	resultString = resultString + "</br>TransactionId -  " + facialResult.TransactionId;
        	resultString = resultString + "</br>FaceLivelinessDetection -  " + facialResult.FaceLivelinessDetection;
        }

    }
    else if (cardType == 2) {
        frontCardImageResult = cardResult.licenceImage;
        backCardImageResult = cardResult.licenceImageTwo;
        faceImageResult = cardResult.faceImage;
        signatureImageResult = cardResult.signatureImage;
        resultString = "First Name -  " + cardResult.nameFirst + "</br>Middle Name -  " + cardResult.nameMiddle + "</br>Last Name -  " + cardResult.nameLast + "</br>Name Suffix -  " + cardResult.nameSuffix + "</br>ID -  " + cardResult.licenceId + "</br>License -  " + cardResult.license + "</br>DOB Long -  " + cardResult.dateOfBirth4 + "</br>DOB Short -  " + cardResult.dateOfBirth + "</br>Date Of Birth Local -  " + cardResult.dateOfBirthLocal + "</br>Issue Date Long -  " + cardResult.issueDate4 + "</br>Issue Date Short -  " + cardResult.issueDate + "</br>Issue Date Local -  " + cardResult.issueDateLocal + "</br>Expiration Date Long -  " + cardResult.expirationDate4 + "</br>Expiration Date Short -  " + cardResult.expirationDate + "</br>Eye Color -  " + cardResult.eyeColor + "</br>Hair Color -  " + cardResult.hairColor + "</br>Height -  " + cardResult.height + "</br>Weight -  " + cardResult.weight + "</br>Address -  " + cardResult.address + "</br>Address 2 -  " + cardResult.address2 + "</br>Address 3 -  " + cardResult.address3 + "</br>Address 4 -  " + cardResult.address4 + "</br>Address 5 -  " + cardResult.address5 + "</br>Address 6  -  " + cardResult.address6 + "</br>City -  " + cardResult.city + "</br>Zip -  " + cardResult.zip + "</br>State -  " + cardResult.state + "</br>County -  " + cardResult.county + "</br>Country Short -  " + cardResult.countryShort + "</br>Country Long -  " + cardResult.idCountry + "</br>Class -  " + cardResult.licenceClass + "</br>Restriction -  " + cardResult.restriction + "</br>Sex -  " + cardResult.sex + "</br>Audit -  " + cardResult.audit + "</br>Endorsements -  " + cardResult.endorsements + "</br>Fee -  " + cardResult.fee + "</br>CSC -  " + cardResult.CSC + "</br>SigNum -  " + cardResult.sigNum + "</br>Text1 -  " + cardResult.text1 + "</br>Text2 -  " + cardResult.text2 + "</br>Text3 -  " + cardResult.text3 + "</br>Type -  " + cardResult.type + "</br>Doc Type -  " + cardResult.docType + "</br>Father Name -  " + cardResult.fatherName + "</br>Mother Name -  " + cardResult.motherName + "</br>NameFirst_NonMRZ -  " + cardResult.nameFirst_NonMRZ + "</br>NameLast_NonMRZ -  " + cardResult.nameLast_NonMRZ + "</br>NameLast1 -  " + cardResult.nameLast1 + "</br>NameLast2 -  " + cardResult.nameLast2 + "</br>NameMiddle_NonMRZ -  " + cardResult.nameMiddle_NonMRZ + "</br>NameSuffix_NonMRZ -  " + cardResult.nameSuffix_NonMRZ + "</br>Document Detected Name - " + cardResult.documentDetectedName + "</br>Nationality -  " + cardResult.nationality + "</br>Original -  " + cardResult.original + "</br>PlaceOfBirth -  " + cardResult.placeOfBirth + "</br>PlaceOfIssue -  " + cardResult.placeOfIssue + "</br>Social Security -  " + cardResult.socialSecurity + "</br>IsAddressCorrected -  " + cardResult.isAddressCorrected + "</br>IsAddressVerified -  " + cardResult.isAddressVerified;
        if (cardRegion == 0 || cardRegion == 1) {
            resultString = resultString + "</br>IsBarcodeRead -  " + cardResult.isBarcodeRead + "</br>IsIDVerified -  " + cardResult.isIDVerified + "</br>IsOcrRead -  " + cardResult.isOcrRead;
        }
        resultString = resultString + "</br>Document Verification Confidence Rating -  " + cardResult.documentVerificationRating;
        if(cardResult.authenticationResult!=null && cardResult.authenticationResult.length>0){

            resultString = resultString + "</br>Authentication Result -  " + cardResult.authenticationResult;
        }
        if(cardResult.authenticationResultSummaryList!=null && cardResult.authenticationResultSummaryList.length>0){

            resultString = resultString + "</br>Authentication Result Summary -  " + cardResult.authenticationResultSummaryList;
        }
        if(cardResult.idLocationCityTestResult!=2){
            resultString = resultString + "</br>idLocationCityTestResult -  " + cardResult.idLocationCityTestResult;
        }
        if(cardResult.idLocationCountryTestResult!=2){
            resultString = resultString + "</br>idLocationCountryTestResult -  " + cardResult.idLocationCountryTestResult;
        }
        if(cardResult.idLocationStateTestResult!=2){
            resultString = resultString + "</br>idLocationStateTestResult -  " + cardResult.idLocationStateTestResult;
        }
        if(cardResult.idLocationZipcodeTestResult!=2){

            resultString = resultString + "</br>idLocationZipcodeTestResult -  " + cardResult.idLocationZipcodeTestResult;
        }

        resultString = resultString + "</br>Device City -  " + cardResult.DeviceCity;
        resultString = resultString + "</br>Device Area -  " + cardResult.DeviceArea;
        resultString = resultString + "</br>Device State -  " + cardResult.DeviceState;
        resultString = resultString + "</br>Device Country -  " + cardResult.DeviceCountry;
        resultString = resultString + "</br>Device Country Code -  " + cardResult.DeviceCountryCode;
        resultString = resultString + "</br>Device Zipcode -  " + cardResult.DeviceZipcode;
        resultString = resultString + "</br>Device Street Address -  " + cardResult.DeviceStreetAddress;

        if(isFacialAllowed){
        	resultString = resultString + "</br>FacialMatch -  " + facialResult.FacialMatch;
        	resultString = resultString + "</br>FacialMatchConfidenceRating -  " + facialResult.FacialMatchConfidenceRating;
        	resultString = resultString + "</br>TransactionId -  " + facialResult.TransactionId;
        	resultString = resultString + "</br>FaceLivelinessDetection -  " + facialResult.FaceLivelinessDetection;
        }
    }
    log('back ' + backCardImageResult);
    log('front ' + frontCardImageResult);
    $("#front-image-result").attr('src', "data:image/png;base64," + frontCardImageResult);
    if (backCardImageResult != null) {
        $("#back-image-result").show();
        $("#back-image-result").attr('src', "data:image/png;base64," + backCardImageResult);
    } else {
        $("#back-image-result").hide();
    }

    log('faceImageResult ' + faceImageResult);
    if (faceImageResult != null) {
        $("#face-image-result").show();
        $("#face-image-result").attr('src', "data:image/png;base64," + faceImageResult);
    } else {
        $("#face-image-result").hide();
    }

    log('signatureImageResult ' + signatureImageResult);
    if (signatureImageResult != null) {
        $("#signature-image-result").show();
        $("#signature-image-result").attr('src', "data:image/png;base64," + signatureImageResult);
    } else {
        $("#signature-image-result").hide();
    }
    $("#result-label").html(resultString);
    $("#page1").toggleClass("hdn");
    $("#page2").toggleClass("hdn");
    adjustCardHolder();
};

function loadEChipData(data){

	$("#EChipFaceImage").attr('src', "data:image/png;base64," + data.faceImage);

    var eChipData = data.EChipData;

    var table = document.getElementById("nfcDataTable");
    clearTable(table);


    addEChipResultRow(table,0,"Primary Identifier",eChipData.PrimaryIdentifier);
    addEChipResultRow(table,1,"Secondary Identifier",eChipData.SecondaryIdentifier);
    addEChipResultRow(table,2,"Gender",eChipData.Gender);
    addEChipResultRow(table,3,"Date Of Birth",eChipData.DateOfBirth);
	addEChipResultRow(table,4,"Nationality",eChipData.Nationality);
	addEChipResultRow(table,5,"Date Of Expiry",eChipData.DateOfExpiry);
	addEChipResultRow(table,6,"Document Code",eChipData.DocumentCode);
	addEChipResultRow(table,7,"Document Type",eChipData.DocumentType);
	addEChipResultRow(table,8,"Issuing State",eChipData.IssuingState);
	addEChipResultRow(table,9,"Document Number",eChipData.DocumentNumber);
	addEChipResultRow(table,10,"Personal Number",eChipData.PersonalNumber);
	addEChipResultRow(table,11,"OptionalData1",eChipData.OptionalData1);
	addEChipResultRow(table,12,"Supported Authorizations",eChipData.SupportedAuths);
	addEChipResultRow(table,13,"Unsupported Authorizations",eChipData.UnsupportedAuths);
	addEChipResultRow(table,14,"DocumentSignerValidity",eChipData.DocumentSignerValidity);
	addEChipResultRow(table,15,"BAC Authenticated",eChipData.BACAuthenticated);
    addEChipResultRow(table,16,"Authentic Data Groups",eChipData.AuthenticDataGroupHashes);
    addEChipResultRow(table,17,"Authentic Document Signature",eChipData.AuthenticDocSignature);
    addEChipResultRow(table,18,"Active Authentication",eChipData.AAAuthenticated);

	$("#page2").toggleClass("hdn");
    $("#page4").toggleClass("hdn");
}

function clearTable(table){
	try{
		var numOfRow = table.rows.length;
		for(var i =0;i<numOfRow;i++){
			table.deleteRow(0);
		}
	}catch(e){

	}
}
function addEChipResultRow(table,index,key,value){

	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(index);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);

	// Add some text to the new cells:
	cell1.innerHTML = key;
	cell2.innerHTML = value;
}

var success = function (data) {
    log("success: " + JSON.stringify(data));
    if (typeof data === 'object') {
        if (data.id == 'mobileSDKWasValidated') {
            $("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('dismiss');
            if (data.data === true) {
            	log('Framework validated');
            } else {
                log('Framework is not validated');
            }
            isAssureIDAllowed = data.isAssureIDAllowed;
            isFacialAllowed = data.isFacialAllowed;
            //set Back button image and PDF417 image
            if (isMobile.Android()) {
                log("BackButton Image Android");
                convertImgToBase64URL("img/barcode.png", PDF417ImageBase64Callback, "image/png");
            } else {
                log("BackButton Image iOS");
                convertImgToBase64URL("img/BackButton.png", backImageBase64Callback);
                if (isIPad == false) {
                    log("PDF417 Image iOS");
                    convertImgToBase64URL("img/PDF417.png", PDF417ImageBase64Callback);
                }
            }
        }
        if(data.id=='nfcReady'){
        	navigator.notification.alert(
                "Searching for passport chip...\n\nTap and place the phone on top of passport chip.",
                alertCallback,
                'AcuantHybridSampleSDK',
                'OK'
                );
        }
        if(data.id=='tagReadSucceeded'){
        	$("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('dismiss');
            loadEChipData(data);
        }
        if (data.id == 'didCaptureCropImage') {
            $("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('dismiss');
            if (typeof data.data === 'string') {
                if (isFrontSide) {
                    frontCardImage = data.data;
                    isBarcodeSide = data.scanBackSide;
                    var srcFront = "data:image/png;base64," + data.data;
                    var imgFront = $('<img class="bordered" src="' + srcFront + '">');
                    $("#front-image").empty();
                    $("#front-image").prepend(imgFront);
                    $("#front-image").removeClass("bordered");
                    if (cardType == 2) {
                        if (isWindows) {
                            navigator.notification.alert(
                                'Scan the backside of the license.',
                                showCameraInterfaceBack,
                                'AcuantHybridSampleSDK',
                                'OK'
                                );
                        } else {
                            navigator.notification.alert(
                                'Scan the backside of the license.',
                                showCameraInterfaceDLBack,
                                'AcuantHybridSampleSDK',
                                'OK'
                                );
                        }
                    }
                } else {
                    backCardImage = data.data;
                    var srcBack = "data:image/png;base64," + data.data;
                    var imgBack = $('<img class="bordered" src="' + srcBack + '">');
                    $("#back-image").show();
                    $("#back-image").empty();
                    $("#back-image").prepend(imgBack);
                    $("#back-image").removeClass("bordered");
                }
            }
        }
        if (data.id == 'didCaptureData') {
            if (typeof data.data === 'string') {
                barcodeStringData = data.data;
            }
        }
        if (data.id == 'didCaptureOriginalImage') {
            if (typeof data.data === 'string') {
                originalImage = data.data;
            }
        }

        if (data.id == 'cropBarcode') {
            if (typeof data.data === 'string') {
                backCardImage = data.data;
                var srcBack = "data:image/png;base64," + data.data;
                var imgBack = $('<img class="bordered" src="' + srcBack + '">');
                $("#back-image").show();
                $("#back-image").empty();
                $("#back-image").prepend(imgBack);
                $("#back-image").removeClass("bordered");
            }
        }
        if (data.id == 'didCardCroppingStart') {
            if (isMobile.Android()) {
                $("#progress_modal").toggleClass("hdn");
                $('#progress_modal').nsProgress('showWithStatusAndMaskType', 'Croppping image...', 'clear');
            }
        }
        if (data.id == 'didFinishProcessingCardWithResult') {
        	dataCaptured = true;
            $("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('dismiss');
            cardResult = data.data;
            log("success: " + JSON.stringify(cardResult));
            if(!isFacialAllowed || isWindows || cardType==1){
            	loadResultScreen();
            }
        }
        if(data.id=='didFinishProcessingFacialMatchWithResult'){
        	$("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('dismiss');
            facialResult = data.data;
            loadResultScreen();
        }
        if(data.id=='barcodeScanTimeOut'){
        	log("success: "+data.id);
        	if (typeof data.croppedData === 'string') {
                backCardImage = data.croppedData;
                var srcBack = "data:image/png;base64," + data.croppedData;
                var imgBack = $('<img class="bordered" src="' + srcBack + '">');
                $("#back-image").show();
                $("#back-image").empty();
                $("#back-image").prepend(imgBack);
                $("#back-image").removeClass("bordered");
            }
            if (typeof data.originalData === 'string') {
                originalImage = data.originalData;
            }
            $("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('dismiss');
            AcuantMobileSDK.dismissCardCaptureInterface();

        }

        if(data.id=='didCancelToCaptureData'){
        	$("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('dismiss');
            AcuantMobileSDK.dismissCardCaptureInterface();
        	if (isFrontSide) {
                    frontCardImage = data.croppedImageData;
                    isBarcodeSide = data.scanBackSide;
                    var srcFront = "data:image/png;base64," + data.croppedImageData;
                    var imgFront = $('<img class="bordered" src="' + srcFront + '">');
                    $("#front-image").empty();
                    $("#front-image").prepend(imgFront);
                    $("#front-image").removeClass("bordered");
                } else {
                    backCardImage = data.croppedImageData;
                    var srcBack = "data:image/png;base64," + data.croppedImageData;
                    var imgBack = $('<img class="bordered" src="' + srcBack + '">');
                    $("#back-image").show();
                    $("#back-image").empty();
                    $("#back-image").prepend(imgBack);
                    $("#back-image").removeClass("bordered");
                }
        }


        if(data.id=='onFacialRecognitionCanceled'){
        	AcuantMobileSDK.dismissCardCaptureInterface();
            loadResultScreen();
        }

        if(data.id=='onFacialRecognitionTimedOut'){
        	AcuantMobileSDK.dismissCardCaptureInterface();
            selfieImageData = data.selfieImageData;
            $("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('showWithStatusAndMaskType', 'Capturing Data...', 'clear');
            waitfor(dataCaptureStatus, true, 1, 0, 'waiting for data capture to finish.', function() {
    			processFacialMatch();
			});

        }

        if(data.id=='onFacialRecognitionCompleted'){
        	AcuantMobileSDK.dismissCardCaptureInterface();
            selfieImageData = data.selfieImageData;
            $("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('showWithStatusAndMaskType', 'Capturing Data...', 'clear');
            waitfor(dataCaptureStatus, true, 1, 0, 'waiting for data capture to finish.', function() {
    			processFacialMatch();
			});
        }
        if(data.id=='onCardImageCaptured'){
        	log("success: " + JSON.stringify(data));
    	}

    }
};
var failure = function (data) {
    log("failure: " + JSON.stringify(data));
    if (data.errorType) {
        if (data.id == "didFailWithError") {
        if(data.ErrorInMethod!='onOriginalCapture')
			{   navigator.notification.alert(
                data.errorMessage,
                alertCallback,
                'AcuantHybridSampleSDK',
                'OK'
                );
            }
        }
        if(data.id=='tagReadFailed'){
        	navigator.notification.alert(
               data.errorMessage,
               alertCallback,
               'AcuantHybridSampleSDK',
               'OK'
               );
        }
        if(data.id=='nfcError'){
        	navigator.notification.alert(
               data.errorMessage,
               alertCallback,
               'AcuantHybridSampleSDK',
               'OK'
               );
        }
        if (data.errorType == 8) {
            var srcFront = "data:image/png;base64," + originalImage;
            var img = $('<img class="bordered" src="' + srcFront + '">');
            if (isFrontSide) {
                $("#front-image").show();
                $("#front-image").empty();
                $("#front-image").prepend(img);
                $("#front-image").removeClass("bordered");
            } else {
                $("#back-image").show();
                $("#back-image").empty();
                $("#back-image").prepend(img);
                $("#back-image").removeClass("bordered");
            }
        }
        $("#progress_modal").toggleClass("hdn");
        $('#progress_modal').nsProgress('dismiss');
    } else {
        $("#progress_modal").toggleClass("hdn");
        $('#progress_modal').nsProgress('dismiss');

    }
};
var barcodeScanTimeOut = function (id) {
    if (id == 2) {
        AcuantMobileSDK.resumeScanningBarcodeCamera();
    } else {
        AcuantMobileSDK.dismissCardCaptureInterface();
    }
};
var selectedRegionAction = function (id) {
    log("selectedRegionAction: " + id + " " + jQuery.type(id));
    cardRegion = parseInt(id);
    $("#page1").toggleClass("hdn");
    $("#page3").toggleClass("hdn");
    frontCardText = "<div class='t1'>Tap to capture card</div>";
    backCardText = "";
    clearCardHolder();
    cardType = 2;
    if(isAssureIDAllowed){
        cardWidth = 2024;
    }else{
        cardWidth = 1250;
    }
    cardAspectRatio = 0.637;
    var height = $("#front-image").width() * 0.637;
    $("#front-image").height(height);
    $("#front-image").show();
    $("#back-image").hide();
    if (isMobile.Android()) {
        AcuantMobileSDK.setInitialMessage(success, failure, "ALING AND TAP", 0, 0, 0, 0, 39, 100, 138, 255, 10, 0);
        AcuantMobileSDK.setCapturingMessage(success, failure, "HOLD STEADY", 0, 0, 0, 0, 39, 100, 138, 255, 10, 0);
    }
};
var driverLicenseAction = function () {
    log('driverLicenseAction');
    AcuantMobileSDK.enableLocationTracking(null,null);
    $("#page1").toggleClass("hdn");
    $("#page3").toggleClass("hdn");
};
var passportAction = function () {
    log('passportAction');
    frontCardText = "<div class='t1'>Tap to capture card</div>";
    backCardText = "";
    clearCardHolder();
    cardType = 3;
    cardWidth = 1478;
    cardAspectRatio = 0.675;
    var height = $("#front-image").width() * 0.675;
    $("#front-image").height(height);
    $("#front-image").show();
    $("#back-image").hide();
    AcuantMobileSDK.enableLocationTracking(null,null);
    if (isMobile.Android()) {
        AcuantMobileSDK.setInitialMessage(success, failure, "ALING AND TAP", 0, 0, 0, 0, 39, 100, 138, 255, 10, 0);
        AcuantMobileSDK.setCapturingMessage(success, failure, "HOLD STEADY", 0, 0, 0, 0, 39, 100, 138, 255, 10, 0);
    }
};
var medicalInsuranceAction = function () {
    log('medicalInsuranceAction');
    frontCardText = "<div class='t1'>Tap to capture front side</div>";
    backCardText = "<div class='t2'>Tap to capture back side </br> (Optional)</div>";
    clearCardHolder();
    isBarcodeSide = false;
    cardType = 1;
    cardWidth = 1500;
    cardAspectRatio = 0.637;
    var height = $("#front-image").width() * 0.637;
    $("#front-image").height(height);
    $("#back-image").height(height);
    $("#front-image").show();
    $("#back-image").show();
    if (isMobile.Android()) {
        AcuantMobileSDK.setInitialMessage(success, failure, "ALING AND TAP", 0, 0, 0, 0, 39, 100, 138, 255, 10, 0);
        AcuantMobileSDK.setCapturingMessage(success, failure, "HOLD STEADY", 0, 0, 0, 0, 39, 100, 138, 255, 10, 0);
    }
};

var backAction = function () {
	clearCardHolder();
    $("#page1").toggleClass("hdn");
    $("#page2").toggleClass("hdn");
    adjustCardHolder();
};

var eChipBackAction = function () {
    $("#page2").toggleClass("hdn");
    $("#page4").toggleClass("hdn");
};

var scanEChipAction = function () {
	AcuantMobileSDK.scanEChip(success, failure);
};

function readEChipAction(Intent) {
	navigator.notification.dismissAlertView();
	var documentNumber = $("#eChipDocNum").val();
	var dateOfBirth = $("#eChipDOB").val();
	var dateOfExpiry = $("#eChipDOE").val();
	dateOfBirth = echipFormat(dateOfBirth);
	dateOfExpiry = echipFormat(dateOfExpiry);
	if(documentNumber && documentNumber.length>0 && dateOfBirth && dateOfBirth.length===6 && dateOfExpiry && dateOfExpiry.length===6){
		$('html,body').scrollTop(0);
		$("#progress_modal").toggleClass("hdn");
        $("#progress_modal").nsProgress('showWithStatusAndMaskType', "Reading chip...", 'clear');
		AcuantMobileSDK.readEChip(success, failure,Intent,documentNumber,dateOfBirth,dateOfExpiry);
	}else{
		navigator.notification.alert(
                "Please enter a valid document number, date of birth and date of expiry.",
                alertCallback,
                'AcuantHybridSampleSDK',
                'OK'
                );
	}
};

function echipFormat(dateStr){
	var arr = dateStr.split("-");
	var mm = arr[0];
	var dd = arr[1];
	var yyyy = arr[2];
	var yy = yyyy.substring(2,4);
	var ret = yy.concat(mm);
	ret = ret.concat(dd);
	return ret;
}

var processAction = function () {
	dataCaptured = false;
	log('processAction');
    if (frontCardImage) {
        AcuantMobileSDK.processCardImage(success, failure, frontCardImage, backCardImage, barcodeStringData, true, -1, true, 0, 150, false, true, true, cardRegion,true,390);
        if(isFacialAllowed && !isWindows && cardType!=1){
            	navigator.notification.alert(
                                'Please position your face in front of the front camera and blink when red rectangle appears.',
                                showFacialInterface,
                                'AcuantHybridSampleSDK',
                                'OK'
                                );
        }else{
        	$("#progress_modal").toggleClass("hdn");
            $('#progress_modal').nsProgress('showWithStatusAndMaskType', 'Capturing Data...', 'clear');
        }
    }
};

var processFacialMatch = function () {
	log('processFacialMatch');
    faceImageResult = cardResult.faceImage;
    if(faceImageResult===null){
    	loadResultScreen();
    }else{
    	$("#progress_modal").toggleClass("hdn");
        $('#progress_modal').nsProgress('showWithStatusAndMaskType', 'Capturing Data...', 'clear');
    	AcuantMobileSDK.processFacialImageValidation(success, failure, selfieImageData,faceImageResult,true);
    }
};

var showFacialInterface = function() {
    AcuantMobileSDK.setFacialRecognitionTimeout(success, failure,20);
    AcuantMobileSDK.setFacialInstructionText(success, failure,"Get closer until Red Rectangle appears and Blink");
    if(isAndroid){
    	AcuantMobileSDK.setFacialInstructionLocation(success, failure,120,100);
    	AcuantMobileSDK.setFacialSubInstructionLocation(success, failure,450,150);
    	AcuantMobileSDK.setFacialSubInstructionColor(success, failure,'#FF0000');
    	AcuantMobileSDK.setFacialInstructionTextStyle(success,failure,'#ffffff',50);
    }else if(isIOS){
        AcuantMobileSDK.setFacialInstructionLocation(success, failure,0,50);
        AcuantMobileSDK.setFacialSubInstructionString(success, failure,'Analyzing');
        AcuantMobileSDK.setFacialSubInstructionColor(success, failure,'#FF0000');
        AcuantMobileSDK.setFacialInstructionTextStyle(success,failure,'#ffffff',13);
    }
    AcuantMobileSDK.showFacialInterface(success, failure);
}

var showCameraInterfaceFront = function () {
    log('showCameraInterfaceFront');
    isFrontSide = true;
    AcuantMobileSDK.setWidth(success, failure, cardWidth);
    AcuantMobileSDK.showManualCameraInterfaceInViewController(success, failure, cardType, cardRegion, false);
};
var showCameraInterfaceBack = function () {
    log('showCameraInterfaceBack');
    isFrontSide = false;
    if (isWindows) {
        isBarcodeSide = true;
    }
    AcuantMobileSDK.setWidth(success, failure, cardWidth);
    AcuantMobileSDK.showManualCameraInterfaceInViewController(success, failure, cardType, cardRegion, isBarcodeSide);
};
var showCameraInterfaceDLBack = function () {
    log('showCameraInterfaceBack');
    isFrontSide = false;
    if (cardRegion == 0 || cardRegion == 1) {
        AcuantMobileSDK.setWidth(success, failure, cardWidth);
        AcuantMobileSDK.showBarcodeCameraInterfaceInViewController(success, failure, cardType, cardRegion);
    } else {
        AcuantMobileSDK.setWidth(success, failure, cardWidth);
        AcuantMobileSDK.showManualCameraInterfaceInViewController(success, failure, cardType, cardRegion, isBarcodeSide);
    }
};

var adjustCardHolder = function () {
    var height = $("#front-image").width() * cardAspectRatio;
    var heightResult = $("#front-image-result").width() * 0.637;
    $("#front-image").height(height);
    $("#back-image").height(height);
    if (backCardImage == null && cardType != 1) {
        $("#back-image").hide();
    }
    $("#front-image-result").height(heightResult);
    $("#back-image-result").height(heightResult);
    log(height);
};

function handleIntent(Intent){
	if(isAndroid){
        readEChipAction(Intent);
	}
}

//**********************************************************************
// function waitfor - Wait until a condition is met
//
// Needed parameters:
//    test: function that returns a value
//    expectedValue: the value of the test function we are waiting for
//    msec: delay between the calls to test
//    callback: function to execute when the condition is met
// Parameters for debugging:
//    count: used to count the loops
//    source: a string to specify an ID, a message, etc
//**********************************************************************
function waitfor(test, expectedValue, msec, count, source, callback) {
    // Check if condition met. If not, re-check later (msec).
    while (test() !== expectedValue) {
        count++;
        setTimeout(function() {
            waitfor(test, expectedValue, msec, count, source, callback);
        }, msec);
        return;
    }
    // Condition finally met. callback() can be executed.
    console.log(source + ': ' + test() + ', expected: ' + expectedValue + ', ' + count + ' loops.');
    callback();
}

var dataCaptureStatus = function (){
	return dataCaptured;
}

var app = {
    // Application Constructor
    initialize: function () {
        log("initialize");
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        log("bindEvents");
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("resize", adjustCardHolder, false);
        window.addEventListener("resize", adjustCardHolder, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        try {
            log("onDeviceReady");
            checkConnection();
            // Custom Settings
            $('#progress_modal').nsProgress({
                img_path: 'img'
            });
            window.shouldRotateToOrientation = function (degrees) {
                return true;
            }

            if(isAndroid){
            	window.plugins.intent.getCordovaIntent(function (Intent) {
        				console.log(Intent);
    				}, function () {
        				console.log('Error');
    			});
    			window.plugins.intent.setNewIntentHandler(function (Intent) {
        			console.log(Intent);
        			handleIntent(Intent);
    			});
    		}
            $("#driver-license-btn").click(driverLicenseAction);
            $("#passport-btn").click(passportAction);
            $("#medical-insurance-btn").click(medicalInsuranceAction);
            $("#front-image").click(showCameraInterfaceFront);
            $("#back-image").click(showCameraInterfaceBack);
            $("#process-btn").click(processAction);
            $("#back-btn").click(backAction);
            $("#echip-back-btn").click(eChipBackAction);
            $("#eChipButton").click(scanEChipAction);
            $('.button-region').click(function () {
                log("selectedRegionAction");
                selectedRegionAction(this.id);
            });

            	firstLoad = true;
            	AcuantMobileSDK.initAcuantMobileSDK(success, failure, licenseKey, null);
            	AcuantMobileSDK.stringForWatermarkLabel(success, failure, "Powered By Acuant");
            	//set Customization methods
            	AcuantMobileSDK.setCanCropBarcode(success, failure, false);
            	AcuantMobileSDK.setCropBarcodeOnCancel(success, failure, true);
            	AcuantMobileSDK.setCanShowMessage(success, failure, false);
            	AcuantMobileSDK.setCanCaptureOriginalImage(success,failure,false);
            	AcuantMobileSDK.cameraPrefersStatusBarHidden(success, failure, false);
            	AcuantMobileSDK.enableLocationTracking(null,null);
            log("end onDeviceReady");
        } catch (err) {
            log("onDeviceReady: " + err.message);
        }
    }
};
app.initialize();
