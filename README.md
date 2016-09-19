![alt tag](https://github.com/Acuant/AcuantAndroidMobileSDK/blob/master/Logo.png)

Acuant Hybrid SDK API
======================

Last updated on – 08/25/2016

# Introduction

The AcuantMobileSDK Plugin is a Cordova Plugin designed to simplify your
development efforts. The processing of the captured images takes place
via Acuant’s Web Services. Our Web Services offer fast data extraction
and zero maintenance as software is looked after by Acuant on our
optimized cloud infrastructure.

Benefits:

-   Process Enhancement: Faster data extraction and process images via Acuant’s Web Services.

-   Easy to set up and deploy.

-   No maintenance and support: All maintenance and updates are done on Acuant servers.

-   Secured Connection: Secured via SSL and HTTPS AES 256-bit encryption.

Acuant Web Services supports processing of drivers licenses, state IDs,
other govt issued IDs, custom IDs, driver’s license barcodes, passports,
medical insurance cards etc. It also supports address verification,
identity verification and personal verification.

For IDs from Asia, Australia, Europe, South America, Africa – we are
support dd-mm-yyyy date format.

For IDs from Canada, USA – we are support mm-dd-yyyy date format.

For a complete list of regions, states, and countries supported for ID
processing, please see Appendix F of ScanW document -
<http://www.id-reader.com/ftp/applications/sdk/docs/ScanW.pdf>

To execute any Acuant Hybrid Mobile SDK method, a valid license key is
required. Please contact <sales@acuantcorp.com> to obtain a license key.

This Acuant Hybrid Mobile SDK API documentation document has the
detailed description of all the important functions a developer would
need to write integration with Acuant Hybrid Mobile SDK.

Note: The Plugin will not modify the Status bar of the app.

# Requirements

-	Windows 10

-	iOS 8.0 or later is required.

-   AndroidSDK Version 17 or later.

-   iPhone 4S and above.

-   iPad 3 and above.

-   iPad mini.

-   iPod Touch 5G and above.

-   5 MP camera resolution or higher

-   The card image must be taken in an acceptable light conditions to avoid glare and overhead lights for example.

-   The card must preferably be fitted with in the brackets on the camera screen, to allow the picture to be taken at a maximum resolution.

NOTE: All methods require a success and failure callback. You can know which methods were called by checking if “id” equals to the name of the executed method.

Example:

> var success = function (data) {
> 
> log("success: " + data.id);
> 
> if (typeof data === 'object') {
> 
> if (data.id == 'mobileSDKWasValidated') {
> 
> \$("\#progress\_modal").toggleClass("hdn");
> 
> \$('\#progress\_modal').nsProgress('dismiss');
> 
> if (data.data === true) {
> 
> log('Framework validated');
> 
> } else {
> 
> log('Framework is not validated');
> 
> }
> 
> }
> 
> }
> 
> }

# Integration

Note : GitHub has recently changed the versioning for large files. To be able to download large files while cloning from GitHub repositories please make sure git-lfs is installed in the build machine. More information for git-lfs is available at https://git-lfs.github.com/. Please clone/update our SDK repository only after the git-lfs is installed.


After cloning the repository execute the following command to make sure all files are pulled.

	git lfs pull
	
## Common Error

If git-lfs is not setup, then GitHub doesn't download of large files. Therefore, if the following build error appears while building the iOS app, that means some of the files are missing. 

	ld: warning: ignoring file ../com.acuant.plugin.AcuantMobileSDK/AcuantMobileSDK.framework/AcuantMobileSDK, file was built for unsupported file format ( 0x76 0x65 0x72 0x73 0x69 0x6F 0x6E 0x20 0x68 0x74 0x74 0x70 0x73 0x3A 0x2F 0x2F ) which is not the architecture being linked (armv7): ../com.acuant.plugin.AcuantMobileSDK/AcuantMobileSDK.framework/AcuantMobileSDK
	Undefined symbols for architecture armv7:

	"_OBJC_CLASS_$_AcuantCardProcessRequestOptions", referenced from:

		objc-class-ref in AcuantMobileSDK.o

	"_OBJC_CLASS_$_AcuantMobileSDKController", referenced from:

		objc-class-ref in AcuantMobileSDK.o
	ld: symbol(s) not found for architecture armv7
	clang: error: linker command failed with exit code 1 (use -v to see invocation)
	
## Add AcuantMobileSDK Plugin on each project 

In order to add the plugin to your project, follow the below two steps:

Step - 1 : After cloning the Git repository , find the path to cordova-plugin-AcuantMobileSDK 

Step - 2 : Execute the following command

	cordova plugin add < path to cordova-plugin-AcuantMobileSDK>

	For example :

	cordova plugin add Users/user/Desktop/AcuantHybridMobileSDK/cordova-plugin-AcuantHybridSDK`


*Note : In Windows please make sure the zcard.dll is present in “<Project folder>\platforms\windows\plugins\com.acuant.plugin.AcuantMobileSDK” in folder.Otherwise copy it from cordova-plugin-AcuantHybridSDK plugin folder.*

Also make sure the following cordova plugins are installed. 

- cordova-plugin-compat
- cordova-plugin-console
- cordova-plugin-dialogs
- cordova-plugin-network-information
- cordova-plugin-whitelist


For Windows platform the following plugin is also required.

- cordova-plugin-camera


# Activate the license key

In order to activate the license key, use the following method:

> AcuantMobileSDK.activateLicenseKey(successCallback, failureCallback, licenseKey);

Note: The license key only needs to be activated once. Execute this
method only one time. Some licensees are issued by Acuant pre-activated
and don’t need further actions.

# Initialize and create the SDK’s instance

## Initialize with license key

In the below call, license key is validated and instance is created.

>AcuantMobileSDK.initAcuantMobileSDK(successCallbalck, failureCallback, licenseKey, null);

Note: This method verifies if the license key is valid and it returns an
instance that can be used to reference the methods. We recommend that
you create one instance per session in order to optimize your resources.

##  With license key and cloud address.

In the below call, license key is validated, the instance is created
with the specified cloud address if you are hosting Acuant web services
in your own data center. By default, iOS MobileSDK communicates with the
Acuant data center.

> AcuantMobileSDK.initAcuantMobileSDK(successCallbalck, failureCallback, licenseKey, "cloud.myAddress.com");

The cloud Address must not contain “https://”\
Ex: “https://cloud.myAddress.com/” must be written “cloud.myAddress.com”

Note: This method verifies if the license key is valid and it returns an instance that can be used to reference the methods. We recommend that you create one instance per session in order to optimize your resources.

## Check if the license key validation was successful or not.

In order to know if the license key validation has finished or to know if it was successful, catch the id type below on the success callback. 
This id is sent after the instance of the MobileSDK has been created.

> var success = function (data) {
> 
> if (data.id == 'mobileSDKWasValidated'){
> 
> }
> 
> }

# Capturing a card

## Add the card capture method.

In order to show the camera interface, set the card type (Medical Insurance, Driver’s License or Passport) as int value:

-   Medical Insurance Card = 1

-   Drivers License Card = 2

-   Passport Card = 3

Depending upon the selected region and the variable state (isBackSide) it will show the correct camera interface.

For AcuantCardTypeMedicalInsuranceCard you can only use the manual capture interface.

For AcuantCardTypeDriversLicenseCard, depending on the region, you can only use the manual capture interface and the barcode capture interface.

For IDs from USA and Canada, use manual capture interface for the front side and use barcode capture or manual capture interface for backside.

For IDs from South America, Europe, Asia, Australia, Africa region use manual capture interface for both front and backside.

For AcuantCardTypePassportCard you can only use manual capture interface.

### Card capture interface with SDK initializations

In order to initialize the SDK and show the camera interface in the same step you must use the following method:

> AcuantMobileSDK.initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController(successCallback, failure, licenseKey, cardType, region, isBackSide);

Note: if you are going to use any customization method, then you should create a previous instance of the SDK in order to set the camera customization.

### Manual Card capture interface without initialization

In order to call this function, you will need to initialize the SDK first and create an instance of the SDK to call the function (see point 5)

> AcuantMobileSDK.showManualCameraInterfaceInViewController(successCallback, failure, cardType, region, isBackSide);

### Barcode capture interface without initialization

In order to call this function, you will need to initialize the SDK first and create an instance of the SDK to call the function (see point 5)

> AcuantMobileSDK.showBarcodeCameraInterfaceInViewController(successCallback, failure, cardType, region, isBackSide);

###  For all camera interfaces add the following methods to set the size of the card. 

If the proper card size is not set, AcuantMobileSDK will not be able to process the card.

**For Driver's License Cards**

> AcuantMobileSDK.setWidth(successCallback, failureCallback, 1250);

**For Medical Insurance Cards**

> AcuantMobileSDK.setWidth(successCallback, failureCallback, 1012);

**For Passport Documents**

> AcuantMobileSDK.setWidth(successCallback, failureCallback, 1478);

### Optional for all camera interfaces add the following methods to customize the appearance and final message on the camera screen. 

Customize the initial message, default implementation says "Align and Tap" or “Tap to Focus”.

For iOS:

Use the following method to customize the text, duration, background color, position, and orientation

> AcuantMobileSDK.setInitialMessage(successCallback, failureCallback, initialMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation);

For Android:

Use the following method to customize the text, duration, background color, position, and orientation

>AcuantMobileSDK.setInitialMessage(successCallback, failureCallback, initialMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation);

Customize the capturing message, default implementation says "hold steady".

For iOS:

Use the following method to customize the text, duration, background color, position, and orientation

> AcuantMobileSDK.setCapturingMessage(successCallback, failureCallback, capturingMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation);

For Android:

Use the following method to customize the text, duration, background color, position, and orientation

> AcuantMobileSDK.setCapturingMessage(successCallback, failureCallback, capturingMessage, frameX, frameY, frameWidth, frameHeight, backgroundColorRed, backgroundColorGreen, backgroundColorBlue, backgroundColorAlpha, duration, orientation);

NOTE:

Orientation values must be int 0 - 1 (Landscape - 0, Portrait – 1)

BackgroundColorRed values must be float 0 - 255

BackgroundColorGreen values must be float 0 - 255

BackgroundColorBlue values must be float 0 - 255

BackgroundColorAlpha values must be float 0 – 255

### Optional for all camera interfaces add the following methods to enable the flashlight and customize the flashlight button. 

In order to enable the flashlight button (default customization).

> AcuantMobileSDK.showFlashlightButton(successCallback, failure, showFlashlightButton);

In order to customize the flashlight button image.

> AcuantMobileSDK.imageForFlashlightButton(successCallback, failure, flashlightButtonImageOn, flashlightButtonImageOff);

In order to customize the flashlight button frame.

> AcuantMobileSDK.frameForFlashlightButton(successCallback, failure, frameX, frameY, frameWidth, frameHeight);

### Optional for barcode camera interfaces add the following methods to enable the barcode image cropping.

> AcuantMobileSDK.setCanCropBarcode(success, failure, true);

### Optional method to enable the initial message on the barcode camera interface. 

By default it is disabled.

> AcuantMobileSDK.setCanShowMessage(success, failure, true);

### Optional method to pause the scanning of the barcode camera

> AcuantMobileSDK.pauseScanningBarcodeCamera(success, failure);

### Optional method to resume the scanning of the barcode camera

> AcuantMobileSDK.resumeScanningBarcodeCamera(success, failure);

### Optional method to show or not show the iPad brackets on the card capture interface

> AcuantMobileSDK.showiPadBrackets(success, failure, true);

## Get the crop image from the success callback.

The cropped image returned came under base 64 format.

> var success = function (data) {
> 
> log("success: " + data.id);
> 
> if (typeof data === 'object') {
> 
> if (data.id == 'didCaptureCropImage') {
> 
> \$("\#progress\_modal").toggleClass("hdn");
> 
> \$('\#progress\_modal').nsProgress('dismiss');
> 
> if (typeof data.data === 'string') {
> 
> if (isFrontSide) {
> 
> frontCardImage = data.data;
> 
> isBarcodeSide = data.scanBackSide;
> 
> var srcFront = "data:image/png;base64," + data.data;
> 
> var imgFront = \$('&lt;img class="bordered" src="' + srcFront +
> '"&gt;');
> 
> \$("\#front-image").empty();
> 
> \$("\#front-image").prepend(imgFront);
> 
> \$("\#front-image").removeClass("bordered");
> 
> if (cardType == 2) {
> 
> navigator.notification.alert(
> 
> 'Scan the backside of the license.',
> 
> showCameraInterfaceDLBack,
> 
> 'AcuantHybridSampleSDK',
> 
> 'OK'
> 
> );
> 
> }
> 
> } else {
> 
> backCardImage = data.data;
> 
> var srcBack = "data:image/png;base64," + data.data;
> 
> var imgBack = \$('&lt;img class="bordered" src="' + srcBack + '"&gt;');
> 
> \$("\#back-image").show();
> 
> \$("\#back-image").empty();
> 
> \$("\#back-image").prepend(imgBack);
> 
> \$("\#back-image").removeClass("bordered");
> 
> }
> 
> }
> 
> }
> 
> }
> 
> };

## Get the original image from the success callback.

The original image returned came under base 64 format.

> var success = function (data) {
> 
> log("success: " + data.id);
> 
> if (typeof data === 'object') {
> 
> if (data.id == 'didCaptureOriginalImage') {
> 
> if (typeof data.data === 'string') {
> 
> originalImage = data.data;
> 
> }
> 
> }
> 
> }
> 
> }

## Get the barcode data from the success callback.

In order to retrieve the cropped image captured by all card capture
interface must use the following method:

> var success = function (data) {
> 
> log("success: " + data.id);
> 
> if (typeof data === 'object') {
> 
> if (data.id == 'didCaptureData') {
> 
> if (typeof data.data === 'string') {
> 
> barcodeStringData = data.data;
> 
> }
> 
> }
> 
> }
> 
> }

# Processing a card

## Add the card processing method.

> processCardImage(successCallback, failureCallback, frontImage, backImage, barcodeStringData, autoDetectState, stateID, reformatImage, reformatImageColor, DPI, cropImage, faceDetection, signatureDetection, region, imageSource);

### For Driver's License Cards

In order to setup Driver License Card, set the following values.

> AcuantMobileSDK.processCardImage(success, failure, frontImage, backImage, barcodeStringData, autoDetectState, stateID, reformatImage, reformatImageColor, DPI, cropImage, faceDetection, signatureDetection, region, imageSource);

Eg:

> AcuantMobileSDK.processCardImage(success, failure, 2, backCardImage, barcodeStringData, true, -1, true, 0, 150, false, true, true, 0, 101);

**Explanation of the parameters:**

**region** - Integer parameter for the Region ID. Parameter value -

United States – 0

Australia – 4

Asia – 5

Canada – 1

America – 2

Europe – 3

Africa – 7

General Documents – 6

**autoDetectState** - Boolean value. True – SDK will auto detect the state of the ID. False – SDK wont auto detect the state of the ID and will use the value of ProcState integer.

**stateID** - Integer value of the state to which ID belongs to. If AutoDetectState is true, SDK automatically detects the state of the ID and stateID value is ignored. If AutoDetectState is false, SDK uses stateID integer value for processing. For a complete list of the different countries supported by the SDK and their different State integer values, please see Appendix F of ScanW document - <http://www.id-reader.com/ftp/applications/sdk/docs/ScanW.pdf>

**faceDetection** - Boolean value. True - Return face image. False – Won’t return face image.

**signatureDetection** - Boolean value. True – Return signature image. False – Won’t return signature image.

**reformatImage** - Boolean value. True – Return formatted processed image. False – Won’t return formatted image. Values of ReformatImageColor and ReformatImageDpi will be ignored.

**reformatImageColor** - Integer value specifying the color value to reformat the image. Values –

Image same color – 0

Black and White – 1

Grayscale 256 – 2

Color 256 – 3

True color – 4

Enhanced Image – 5

**DPI -** Integer value up to 600. Reformats the image to the provided DPI value. Size of the image will depend on the DPI value. Lower value (150) is recommended to get a smaller image.

**cropImage –** Boolean value. When true, cloud will crop the RAW image. Boolean value. Since MobileSDK crops the image, leave this flag to
false.

**sourceImage –** Define the source or type of image.

MobileSDK – 101

### For Medical Insurance Cards

In order to setup Medical Insurance Card, just set the following values.

> AcuantMobileSDK.processCardImage(success, failure, frontImage, backImage, barcodeStringData, autoDetectState, stateID, reformatImage, reformatImageColor, DPI, cropImage, faceDetection, signatureDetection, region, imageSource);

Eg:

> AcuantMobileSDK.processCardImage(success, failure, 1, backCardImage, barcodeStringData, true, -1, true, 0, 150, false, true, true, 0, 101);

**Explanation of the parameters:**

**reformatImage** - Boolean value. True – Return formatted processed image. False – Won’t return formatted image. Values of ReformatImageColor and ReformatImageDpi will be ignored.

**reformatImageColor** - Integer value specifying the color value to reformat the image. Values –

Image same color – 0

Black and White – 1

Grayscale 256 – 2

Color 256 – 3

True color – 4

Enhanced Image – 5

**DPI -** Integer value up to 600. Reformats the image to the provided DPI value. Size of the image will depend on the DPI value. Lower value (150) is recommended to get a smaller image.

**cropImage –** Boolean value. When true, cloud will crop the RAW image. Boolean value. Since MobileSDK crops the image, leave this flag to false.

### For Passport

In order to setup Passport Card, just set the following values.

> AcuantMobileSDK.processCardImage(success, failure, frontImage, backImage, barcodeStringData, autoDetectState, stateID, reformatImage, reformatImageColor, DPI, cropImage, faceDetection, signatureDetection, region, imageSource);

Eg:

> AcuantMobileSDK.processCardImage(success, failure, 3, backCardImage, barcodeStringData, true, -1, true, 0, 150, false, true, true, 0, 101);

**Explanation of the parameters:**

**faceDetection** - Boolean value. True - Return face image. False – Won’t return face image.

**signatureDetection** - Boolean value. True – Return signature image. False – Won’t return signature image.

**reformatImage** - Boolean value. True – Return formatted processed image. False – Won’t return formatted image. Values of ReformatImageColor and ReformatImageDpi will be ignored.

**reformatImageColor** - Integer value specifying the color value to reformat the image. Values –

Image same color – 0

Black and White – 1

Grayscale 256 – 2

Color 256 – 3

True color – 4

Enhanced Image – 5

**DPI -** Integer value up to 600. Reformats the image to the provided DPI value. Size of the image will depend on the DPI value. Lower value (150) is recommended to get a smaller image.

**cropImage –** Boolean value. When true, cloud will crop the RAW image. Boolean value. Since MobileSDK crops the image, leave this flag to false.

## Finally, check the callback process asking if “data.id” is equal to “didFinishProcessingCardWithResult”.

### For Driver's License Cards

If using the Driver’s License Card, add the following code:

> if (cardType == 2) {
> 
> frontCardImageResult = cardResult.licenceImage;
> 
> backCardImageResult = cardResult.licenceImageTwo;
> 
> faceImageResult = cardResult.faceImage;
> 
> signatureImageResult = cardResult.signatureImage;
> 
> resultString = "First Name - " + cardResult.nameFirst + "&lt;/br&gt;Middle Name - " + cardResult.nameMiddle + "&lt;/br&gt;Last Name - " + cardResult.nameLast + "&lt;/br&gt;Name Suffix - " + cardResult.nameSuffix + "&lt;/br&gt;ID - " + cardResult.licenceId + "&lt;/br&gt;License - " + cardResult.license + "&lt;/br&gt;DOB Long - " + cardResult.dateOfBirth4 + "&lt;/br&gt;DOB Short - " + cardResult.dateOfBirth + "&lt;/br&gt;Date Of Birth Local - " + cardResult.dateOfBirthLocal + "&lt;/br&gt;Issue Date Long - " + cardResult.issueDate4 + "&lt;/br&gt;Issue Date Short - " + cardResult.issueDate + "&lt;/br&gt;Issue Date Local - " + cardResult.issueDateLocal + "&lt;/br&gt;Expiration Date Long - " + cardResult.expirationDate4 + "&lt;/br&gt;Expiration Date Short - " + cardResult.expirationDate + "&lt;/br&gt;Eye Color - " + cardResult.eyeColor + "&lt;/br&gt;Hair Color - " + cardResult.hairColor + "&lt;/br&gt;Height - " + cardResult.height + "&lt;/br&gt;Weight - " + cardResult.weight + "&lt;/br&gt;Address - " + cardResult.address + "&lt;/br&gt;Address 2 - " + cardResult.address2 + "&lt;/br&gt;Address 3 - " + cardResult.address3 + "&lt;/br&gt;Address 4 - " + cardResult.address4 + "&lt;/br&gt;Address 5 - " + cardResult.address5 + "&lt;/br&gt;Address 6 - " + cardResult.address6 + "&lt;/br&gt;City - " + cardResult.city + "&lt;/br&gt;Zip - " + cardResult.zip + "&lt;/br&gt;State - " + cardResult.state + "&lt;/br&gt;County - " + cardResult.county + "&lt;/br&gt;Country Short - " + cardResult.countryShort + "&lt;/br&gt;Country Long - " + cardResult.idCountry + "&lt;/br&gt;Class - " + cardResult.licenceClass + "&lt;/br&gt;Restriction - " + cardResult.restriction + "&lt;/br&gt;Sex - " + cardResult.sex + "&lt;/br&gt;Audit - " + cardResult.audit + "&lt;/br&gt;Endorsements - " + cardResult.endorsements + "&lt;/br&gt;Fee - " + cardResult.fee + "&lt;/br&gt;CSC - " + cardResult.CSC + "&lt;/br&gt;SigNum - " + cardResult.sigNum + "&lt;/br&gt;Text1 - " + cardResult.text1 + "&lt;/br&gt;Text2 - " + cardResult.text2 + "&lt;/br&gt;Text3 - " + cardResult.text3 + "&lt;/br&gt;Type - " + cardResult.type + "&lt;/br&gt;Doc Type - " + cardResult.docType + "&lt;/br&gt;Father Name - " + cardResult.fatherName + "&lt;/br&gt;Mother Name - " + cardResult.motherName + "&lt;/br&gt;NameFirst\_NonMRZ - " + cardResult.nameFirst\_NonMRZ + "&lt;/br&gt;NameLast\_NonMRZ - " + cardResult.nameLast\_NonMRZ + "&lt;/br&gt;NameLast1 - " + cardResult.nameLast1 + "&lt;/br&gt;NameLast2 - " + cardResult.nameLast2 + "&lt;/br&gt;NameMiddle\_NonMRZ - " + cardResult.nameMiddle\_NonMRZ + "&lt;/br&gt;NameSuffix\_NonMRZ - " + cardResult.nameSuffix\_NonMRZ + "&lt;/br&gt;Document Detected Name - " + cardResult.documentDetectedName + "&lt;/br&gt;Nationality - " + cardResult.nationality + "&lt;/br&gt;Original - " + cardResult.original + "&lt;/br&gt;PlaceOfBirth - " + cardResult.placeOfBirth + "&lt;/br&gt;PlaceOfIssue - " + cardResult.placeOfIssue + "&lt;/br&gt;Social Security - " + cardResult.socialSecurity + "&lt;/br&gt;IsAddressCorrected - " + cardResult.isAddressCorrected + "&lt;/br&gt;IsAddressVerified - " + cardResult.isAddressVerified;
>
> if (cardRegion == 0 || cardRegion == 1){
> 
> resultString = resultString + "&lt;/br&gt;IsBarcodeRead - " + cardResult.isBarcodeRead + "&lt;/br&gt;IsIDVerified - " + cardResult.isIDVerified + "&lt;/br&gt;IsOcrRead - " + cardResult.isOcrRead;
>
> }
>
> resultString = resultString + "&lt;/br&gt;Document Verification Confidence Rating - " + cardResult.documentVerificationRating;
>
> }

### For Medical Insurance Cards

If using the Medical Insurance Card, add the following code:

> if (cardType == 1) {
> 
> frontCardImageResult = cardResult.reformattedImage;
> 
> backCardImageResult = cardResult.reformattedImageTwo;
> 
> resultString = "First Name - " + cardResult.firstName + "&lt;/br&gt;Last Name - " + cardResult.lastName + "&lt;/br&gt;Middle Name - " + cardResult.middleName + "&lt;/br&gt;MemberID - " + cardResult.memberId + "&lt;/br&gt;Group No. - " + cardResult.groupNumber + "&lt;/br&gt;Contract Code - " + cardResult.contractCode + "&lt;/br&gt;Copay ER - " + cardResult.copayEr + "&lt;/br&gt;Copay OV - " + cardResult.copayOv + "&lt;/br&gt;Copay SP - " + cardResult.copaySp + "&lt;/br&gt;Copay UC - " + cardResult.copayUc + "&lt;/br&gt;Coverage - " + cardResult.coverage + "&lt;/br&gt;Date of Birth - " + cardResult.dateOfBirth + "&lt;/br&gt;Deductible - " + cardResult.deductible + "&lt;/br&gt;Effective Date - " + cardResult.effectiveDate + "&lt;/br&gt;Employer - " + cardResult.employer + "&lt;/br&gt;Expire Date - " + cardResult.expirationDate + "&lt;/br&gt;Group Name - " + cardResult.groupName + "&lt;/br&gt;Issuer Number - " + cardResult.issuerNumber + "&lt;/br&gt;Other - " + cardResult.other + "&lt;/br&gt;Payer ID - " + cardResult.payerId + "&lt;/br&gt;Plan Admin - " + cardResult.planAdmin + "&lt;/br&gt;Plan Provider - " + cardResult.planProvider + "&lt;/br&gt;Plan Type - " + cardResult.planType + "&lt;/br&gt;RX Bin - " + cardResult.rxBin + "&lt;/br&gt;RX Group - " + cardResult.rxGroup + "&lt;/br&gt;RX ID - " + cardResult.rxId + "&lt;/br&gt;RX PCN - " + cardResult.rxPcn + "&lt;/br&gt;Telephone - " + cardResult.phoneNumber + "&lt;/br&gt;Web - " + cardResult.webAddress + "&lt;/br&gt;Email - " + cardResult.email + "&lt;/br&gt;Address - " + cardResult.fullAddress + "&lt;/br&gt;City - " + cardResult.city + "&lt;/br&gt;Zip - " + cardResult.zip + "&lt;/br&gt;State - " + cardResult.state; }

### For Passport Card

If using the Passport Card, add the following code:

> if (cardType == 3) {
> 
> frontCardImageResult = cardResult.passportImage;
> 
> faceImageResult = cardResult.faceImage;
> 
> signatureImageResult = cardResult.signImage;
> 
> resultString = "First Name - " + cardResult.nameFirst + "&lt;/br&gt;Middle Name - " + cardResult.nameMiddle + "&lt;/br&gt;Last Name - " + cardResult.nameLast + "&lt;/br&gt;Passport Number - " + cardResult.passportNumber + "&lt;/br&gt;Personal Number - " + cardResult.personalNumber + "&lt;/br&gt;Sex - " + cardResult.sex + "&lt;/br&gt;Country Long - " + cardResult.countryLong + "&lt;/br&gt;Nationality Long - " + cardResult.nationalityLong + "&lt;/br&gt;DOB Long - " + cardResult.dateOfBirth4 + "&lt;/br&gt;Issue Date Long - " + cardResult.issueDate4 + "&lt;/br&gt;Expiration Date Long - " + cardResult.expirationDate4 + "&lt;/br&gt;Place of Birth - " + cardResult.end\_POB;
>
> }

### For failure case.

If the image process fails for any reason you can then check the error in the failure callback by asking if error.id is equal to ‘didFailWithError’.

> var failure = function (data) {
> 
> if (data.id == ‘didFailWithError’) {
> 
> log("Process error type:" + data.errorType + " Message: " + data.errorMessage);
> 
> alert(data.errorMessage);
> 
> \$('\#progress\_modal').nsProgress('dismiss');
> 
> } else if (data.errorType) {
> 
> log("Error Type:" + data.errorType + " Message: " + data.errorMessage);
> 
> alert(data.errorMessage);
> 
> \$('\#progress\_modal').nsProgress('dismiss');
> 
> } else {
> 
> {
> 
> log("failure: " + data.error);
> 
> }
> 
> };

# Error Types

AcuantErrorCouldNotReachServer = 0, //check internet connection

AcuantErrorUnableToAuthenticate = 1, //keyLicense are incorrect

AcuantErrorUnableToProcess = 2, //image received by the server was
unreadable, take a new one

AcuantErrorInternalServerError = 3, //there was an error in our server,
try again later

AcuantErrorUnknown = 4, //there was an error but we were unable to
determine the reason, try again later

AcuantErrorTimedOut = 5, //request timed out, may be because internet
connection is too slow

AcuantErrorAutoDetectState = 6, //Error when try to detect the state

AcuantErrorWebResponse = 7, //the json was received by the server
contain error

AcuantErrorUnableToCrop = 8, //the received image can't be cropped.

AcuantErrorInvalidLicenseKey = 9, //Is an invalid license key.

AcuantErrorInactiveLicenseKey = 10, //Is an inative license key.

AcuantErrorAccountDisabled = 11, //Is an account disabled.

AcuantErrorOnActiveLicenseKey = 12, //there was an error on activation
key.

AcuantErrorValidatingLicensekey = 13, //The validation is still in
process.

AcuantErrorCameraUnauthorized = 14, //The privacy settings are
preventing us from accessing your camera.

AcuantErrorOpenCamera = 15 //There are an error when the camera is
opened.

# Supported Hybrid Frameworks

Acuant Hybrid Mobile SDK supports following hybrid frameworks:

Sencha

Phonegap

Intel XDK

ionic

Mobile Angular UI

# Change Log

- Improved cropping in Android platform
- libpng version updated to resolve security vulnerabilities issue in Android platform 
- Memory optimization to fix memory out of bound crashes in low memory devices
- Added DocumentDetectNameShort field for Android platform
