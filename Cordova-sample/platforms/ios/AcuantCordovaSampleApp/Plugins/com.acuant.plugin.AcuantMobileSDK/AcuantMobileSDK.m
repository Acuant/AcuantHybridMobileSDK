#import "AcuantMobileSDK.h"
#import <AcuantMobileSDK/AcuantMobileSDKController.h>
#import <AcuantMobileSDK/AcuantFacialRecognitionViewController.h>
#import <AcuantMobileSDK/AcuantFacialData.h>
#import <objc/runtime.h>


@interface AcuantMobileSDK() <AcuantMobileSDKControllerCapturingDelegate, AcuantMobileSDKControllerProcessingDelegate,AcuantFacialCaptureDelegate>
//Framework init
@property (strong, nonatomic) NSString *key;
@property (strong, nonatomic) NSString *cloudAddressString;
@property (strong, nonatomic) AcuantMobileSDKController *instance;

//Framework Customization
@property (strong, nonatomic) UIImage *backButtonImage;
@property (nonatomic) CGRect backButtonFrame;
@property (nonatomic) BOOL showBackButton;
@property (nonatomic) BOOL canCropOnCancel;
@property (nonatomic) BOOL canCaptureOriginalImage;
@property (strong, nonatomic) UIImage *helpImage;
@property (nonatomic) CGRect helpImageFrame;
@property (strong, nonatomic) UIImage *flashlightButtonImage;
@property (nonatomic) CGRect flashlightButtonFrame;
@property (nonatomic) BOOL showFlashlightButton;
@property (strong, nonatomic) NSString *watermarkLabel;
@property (nonatomic) CGRect watermarkLabelFrame;
@property (strong, nonatomic) NSString *barcodeErrorMessage;
@property (strong, nonatomic) NSString *barcodeTitleError;
@property (nonatomic) int timeBarcodeErrorMessage;
@property (nonatomic) BOOL hiddenBarcodeErrorMessage;
@property (nonatomic) BOOL hiddenStatusBar;
@property (nonatomic) BOOL showiPadBrackets;
@property (strong, nonatomic) NSString *facialInstructionString;
@property (strong, nonatomic) NSString *subInstructionString;
@property (strong, nonatomic) NSNumber *facialTimeout;
@property (nonatomic) CGRect facialMessageFrame;
@property (nonatomic) CGRect facialSubMessageFrame;
@property(nonatomic,strong) NSNumber* facialTextLeft;
@property(nonatomic,strong) NSNumber* facialTextTop;
@property(nonatomic,strong) NSNumber* facialSubInstructionLeft;
@property(nonatomic,strong) NSNumber* facialSubInstructionTop;
@property(nonatomic,strong) NSString* facialInstructionFontColor;
@property(nonatomic,strong) NSString* facialSubInstructionFontColor;
@property(nonatomic,strong) NSNumber* facialInstructionFontSize;
//Framework Process
@property (strong, nonatomic) NSString *callbackId;
@property (strong, nonatomic) NSString *callbackIdImageProcess;
@property (strong, nonatomic) NSString *callbackIdFacialProcess;
@property (nonatomic) BOOL sdkValidated;

@property AcuantCardType cardType;
@property BOOL isBackSide;
@property AcuantCardRegion region;

//Internal Methods
@property (strong, nonatomic) NSString *methodId;

@end
@implementation AcuantMobileSDK

// Plugin Methods
#pragma mark -
#pragma mark AcuantMobileSDK Methods

/**
 Use this method to obtain an instance of the AcuantMobileSDKController if Username and password is correct
 @param command CDVInvokedUrlCommand
 @discussion never try to alloc/init this class, always obtain an instance through this method.
 @return the AcuantMobileSDKController instance
 */
- (void)initAcuantMobileSDK:(CDVInvokedUrlCommand*)command{
    if ([command.arguments objectAtIndex:0])
    {
        _key = [command.arguments objectAtIndex:0];
    }else{
        _key = @"";
    }
    if ([command.arguments objectAtIndex:1] && [[command.arguments objectAtIndex:1]class] != [NSNull class])
    {
        _cloudAddressString = [command.arguments objectAtIndex:1];
    }else{
        _cloudAddressString = @"cssnwebservices.com";
    }
    _methodId = @"initAcuantMobileSDK";
    _callbackId = [command callbackId];
    _hiddenBarcodeErrorMessage = NO;
    _showBackButton = YES;
    _showiPadBrackets = YES;
    _showFlashlightButton = NO;
    _hiddenStatusBar = NO;
    _instance = [AcuantMobileSDKController initAcuantMobileSDKWithLicenseKey:_key delegate:self andCloudAddress:_cloudAddressString];
}

/**
 Use this method to obtain an instance of the AcuantMobileSDKController if License key is correct and show the camera interface after the key was validated and approved
 @param command CDVInvokedUrlCommand
 @discussion never try to alloc/init this class, always obtain an instance through this method.
 @return the AcuantMobileSDKController instance
 */
- (void)initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController:(CDVInvokedUrlCommand*)command{
    if ([command.arguments objectAtIndex:0])
    {
        _key = [command.arguments objectAtIndex:0];
    }else{
        _key = @"";
    }
    _methodId = @"initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController";
    _callbackId = [command callbackId];
    _hiddenBarcodeErrorMessage = NO;
    _showBackButton = YES;
    _showiPadBrackets = YES;
    _showFlashlightButton = NO;
    _hiddenStatusBar = NO;
    NSNumber *cardTypeNumber = [command.arguments objectAtIndex:1];
    _cardType = cardTypeNumber.intValue;
    NSNumber *cardRegionNumber = [command.arguments objectAtIndex:2];
    _region = cardRegionNumber.intValue;
    NSNumber *isBarcodeSideNumber = [command.arguments objectAtIndex:3];
    _isBackSide = isBarcodeSideNumber.boolValue;
    
    UIViewController *rootViewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    
    _instance = [AcuantMobileSDKController initAcuantMobileSDKWithLicenseKey:_key AndShowCardCaptureInterfaceInViewController:rootViewController delegate:self typeCard:_cardType region:_region isBarcodeSide:_isBackSide];
}


/**
 Use this method to present the card capture interface.
 @param command CDVInvokedUrlCommand
 @discussion a valid viewController is required
 */
- (void)showManualCameraInterfaceInViewController:(CDVInvokedUrlCommand*)command{
    _methodId = @"showManualCameraInterfaceInViewController";
    NSNumber *cardTypeNumber = [command.arguments objectAtIndex:0];
    _cardType = cardTypeNumber.intValue;
    NSNumber *isBarcodeSideNumber = [command.arguments objectAtIndex:2];
    _isBackSide = isBarcodeSideNumber.boolValue;
    NSNumber *cardRegionNumber = [command.arguments objectAtIndex:1];
    _region = cardRegionNumber.intValue;
    _callbackId = [command callbackId];
    UIViewController *rootViewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [_instance showManualCameraInterfaceInViewController:rootViewController delegate:self cardType:_cardType region:_region andBackSide:_isBackSide];
}

/**
 Use this method to present the card capture interface.
 @param command CDVInvokedUrlCommand
 @discussion a valid viewController is required
 */
- (void)showBarcodeCameraInterfaceInViewController:(CDVInvokedUrlCommand*)command{
    _methodId = @"showBarcodeCameraInterfaceInViewController";
    NSNumber *cardTypeNumber = [command.arguments objectAtIndex:0];
    _cardType = cardTypeNumber.intValue;
    NSNumber *cardRegionNumber = [command.arguments objectAtIndex:1];
    _region = cardRegionNumber.intValue;
    _callbackId = [command callbackId];
    UIViewController *rootViewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [_instance showBarcodeCameraInterfaceInViewController:rootViewController delegate:self cardType:_cardType andRegion:_region];
}

/**
 Use this method to dismiss the card capture interface
 @param command CDVInvokedUrlCommand
 @discussion You cannot use [UIPopOverController dismissPopoverAnimated:] method to dismiss the UIPopOverController
 */
- (void)dismissCardCaptureInterface:(CDVInvokedUrlCommand*)command{
    _methodId = @"dismissCardCaptureInterface";
    _callbackId = [command callbackId];
    [_instance dismissCardCaptureInterface];
}
/**
 Use this method to start the camera
 @param command CDVInvokedUrlCommand
 @discussion you don't need to call this method after presenting the camera interface
 @discussion if we're already capturing video this method does nothing
 */
- (void)startCamera:(CDVInvokedUrlCommand*)command{
    _methodId = @"startCamera";
    _callbackId = [command callbackId];
    [_instance startCamera];
}
/**
 Use this method to stop the camera
 @param command CDVInvokedUrlCommand
 @discussion if camera is already stop, this method does nothing
 */
- (void)stopCamera:(CDVInvokedUrlCommand*)command{
    _methodId = @"stopCamera";
    _callbackId = [command callbackId];
    [_instance stopCamera];
}

/**
 Use this method to pause the scanning of the barcode
 @param command CDVInvokedUrlCommand
 @discussion if the scanning is already stopped, this method does nothing
 */
- (void)pauseScanningBarcodeCamera:(CDVInvokedUrlCommand*)command{
    _methodId = @"pauseScanningBarcodeCamera";
    _callbackId = [command callbackId];
    [_instance pauseScanningBarcodeCamera];
}

/**
 Use this method to resume the scanning of the barcode
 @param command CDVInvokedUrlCommand
 @discussion if the scanning is already running this method does nothing
 */
- (void)resumeScanningBarcodeCamera:(CDVInvokedUrlCommand*)command{
    _methodId = @"resumeScanningBarcodeCamera";
    _callbackId = [command callbackId];
    [_instance resumeScanningBarcodeCamera];
}

/**
 
Use this method to check if the SDK is already validated with the license key
*/

- (void)isSDKValidated:(CDVInvokedUrlCommand*)command{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"isSDKValidated" forKey:@"id"];
    [resultDictionary setObject:[NSNumber numberWithBool:_sdkValidated] forKey:@"data"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

/**
 Use this method to configure the License key
 @param command CDVInvokedUrlCommand
 @discussion you are in charge of setting License key on each application launch as part of the setup of the framework
 */
- (void)setLicenseKey:(CDVInvokedUrlCommand*)command{
    _methodId = @"setLicenseKey";
    if ([command.arguments objectAtIndex:0])
    {
        _key = [command.arguments objectAtIndex:0];
    }
    _callbackId = [command callbackId];
    [_instance setLicenseKey:_key];
}

/**
 Use this method to configure the Cloud Address of the server
 @param command CDVInvokedUrlCommand
 */
- (void)setCloudAddress:(CDVInvokedUrlCommand*)command{
    _methodId = @"setLicenseKey";
    if ([command.arguments objectAtIndex:0])
    {
        _cloudAddressString = [command.arguments objectAtIndex:0];
    }
    _callbackId = [command callbackId];
    [_instance setCloudAddress:_cloudAddressString];
}

-(void)enableLocationTracking:(CDVInvokedUrlCommand*)command{
    _methodId = @"enableLocationTracking";
    [_instance enableLocationTracking];
}

/**
 Use this method to set the width of the cropped image
 @param command CDVInvokedUrlCommand
 @discussion you need to set the height with setHeight:(int)height to crop the image with these values
 */
-(void)setWidth:(CDVInvokedUrlCommand*)command{
    _methodId = @"setWidth";
    int width = 0;
    if ([command.arguments objectAtIndex:0])
    {
        NSNumber *widthNumber = [command.arguments objectAtIndex:0];
        width = widthNumber.intValue;
    }
    _callbackId = [command callbackId];
    [_instance setWidth:width];
}

/**
 Use it to enable or disable the barcode Cropping
 @param canCropBarcode boolean enable or disable the watermark
 */
-(void)setCanCropBarcode:(CDVInvokedUrlCommand*)command{
    _methodId = @"setCanCropBarcode";
    BOOL canCropBarcode = NO;
    if ([command.arguments objectAtIndex:0])
    {
        NSNumber *canCropBarcodeNumber = [command.arguments objectAtIndex:0];
        canCropBarcode = canCropBarcodeNumber.boolValue;
    }
    _callbackId = [command callbackId];
    [_instance setCanCropBarcode:canCropBarcode];
}

-(void)setCropBarcodeOnCancel:(CDVInvokedUrlCommand*)command{
    _methodId = @"setCropBarcodeOnCancel";
    if ([command.arguments objectAtIndex:0])
    {
        NSNumber *canCropNumber = [command.arguments objectAtIndex:0];
        _canCropOnCancel = canCropNumber.boolValue;
    }
    
    _callbackId = [command callbackId];
}

-(void)setCaptureOriginalImage:(CDVInvokedUrlCommand*)command{
    _methodId = @"setCanCaptureOriginalImage";
    if ([command.arguments objectAtIndex:0])
    {
        NSNumber *setCanCaptureOriginalImageNumber = [command.arguments objectAtIndex:0];
        _canCaptureOriginalImage = setCanCaptureOriginalImageNumber.boolValue;
    }
    
    _callbackId = [command callbackId];
    [_instance setCanCaptureOriginalImage:_canCaptureOriginalImage];
}

- (BOOL)canCropBarcodeOnBackPressed{
    return _canCropOnCancel;
}


-(void)setCanShowMessage:(CDVInvokedUrlCommand*)command{
    _methodId = @"setCanShowMessage";
    BOOL canShowMessage = NO;
    if ([command.arguments objectAtIndex:0])
    {
        NSNumber *canShowMessageNumber = [command.arguments objectAtIndex:0];
        canShowMessage = canShowMessageNumber.boolValue;
    }
    _callbackId = [command callbackId];
    [_instance setCanShowMessage:canShowMessage];
}

/**
 Called to set a customize appear message, background color, time lenght and frame.
 @param command CDVInvokedUrlCommand
 @discussion in case this method in not implementd by the delegate, we'll set a default message, background color, time lenght and frame.
 */
-(void)setInitialMessage:(CDVInvokedUrlCommand*)command{
    _methodId = @"setInitialMessage";
    NSString *initialMessage = [command.arguments objectAtIndex:0];
    
    NSNumber *xnumber = [command.arguments objectAtIndex:1];
    int x = xnumber.intValue;
    NSNumber *ynumber = [command.arguments objectAtIndex:2];
    int y = ynumber.intValue;
    NSNumber *widthnumber = [command.arguments objectAtIndex:3];
    int width = widthnumber.intValue;
    NSNumber *heightnumber = [command.arguments objectAtIndex:4];
    int height = heightnumber.intValue;
    CGRect frame = CGRectMake(x, y, width, height);
    
    NSNumber *rednumber = [command.arguments objectAtIndex:5];
    float red = rednumber.intValue/255;
    NSNumber *greennumber = [command.arguments objectAtIndex:6];
    float green = greennumber.intValue/255;
    NSNumber *bluenumber = [command.arguments objectAtIndex:7];
    float blue = bluenumber.intValue/255;
    NSNumber *alphanumber = [command.arguments objectAtIndex:8];
    float alpha = alphanumber.floatValue/255;
    UIColor *color = [UIColor colorWithRed:red green:green blue:blue alpha:alpha];
    
    NSNumber *durationnumber = [command.arguments objectAtIndex:7];
    int duration = durationnumber.intValue;
    
    NSNumber *orientationnumber = [command.arguments objectAtIndex:7];
    AcuantHUDOrientation orientation =orientationnumber.intValue;
    
    [_instance setInitialMessage:initialMessage frame:frame backgroundColor:color duration:duration orientation:orientation];
}

/**
 Called to set a customize finaly message, background color, time lenght and frame.
 @param command CDVInvokedUrlCommand
 @discussion in case this method in not implementd by the delegate, we'll set a default message, background color, time lenght and frame.
 */
-(void)setCapturingMessage:(CDVInvokedUrlCommand*)command{
    _methodId = @"setCapturingMessage";
    NSString *capturingMessage = [command.arguments objectAtIndex:0];
    
    NSNumber *xnumber = [command.arguments objectAtIndex:1];
    int x = xnumber.intValue;
    NSNumber *ynumber = [command.arguments objectAtIndex:2];
    int y = ynumber.intValue;
    NSNumber *widthnumber = [command.arguments objectAtIndex:3];
    int width = widthnumber.intValue;
    NSNumber *heightnumber = [command.arguments objectAtIndex:4];
    int height = heightnumber.intValue;
    CGRect frame = CGRectMake(x, y, width, height);
    
    NSNumber *rednumber = [command.arguments objectAtIndex:5];
    float red = rednumber.intValue/255;
    NSNumber *greennumber = [command.arguments objectAtIndex:6];
    float green = greennumber.intValue/255;
    NSNumber *bluenumber = [command.arguments objectAtIndex:7];
    float blue = bluenumber.intValue/255;
    NSNumber *alphanumber = [command.arguments objectAtIndex:8];
    float alpha = alphanumber.floatValue/255;
    UIColor *color = [UIColor colorWithRed:red green:green blue:blue alpha:alpha];
    
    NSNumber *durationnumber = [command.arguments objectAtIndex:7];
    int duration = durationnumber.intValue;
    
    NSNumber *orientationnumber = [command.arguments objectAtIndex:7];
    AcuantHUDOrientation orientation =orientationnumber.intValue;
    
    [_instance setCapturingMessage:capturingMessage frame:frame backgroundColor:color duration:duration orientation:orientation];
}

/**
 Use this method to process a card.
 @param command CDVInvokedUrlCommand
 @discussion you must always provide a front image, back image is optional
 @discussion use the options object to indicate the type of card you're trying to process (i.e. License, Medical). Processing will fail if you don't provide this parameter.
 @discussion you're encourage to provide a delegate to be informed about what happened with your processing request. You can change the delegate using the cardProcessingDelegate property of this class.
 @discussion you should call this method only once and wait until your delegate is informed. If you call this method while we're already processing a card, we'll ignore your second call.
 @discussion The recommended size to this images is 1009 width and relative height to the width.
 */
- (void)processCardImage:(CDVInvokedUrlCommand*)command{
    _methodId = @"processCardImage";
    _callbackId = [command callbackId];
    _callbackIdImageProcess = [command callbackId];
    UIImage *frontImage;
    NSString *frontImageEcodedString = [command.arguments objectAtIndex:0];
    if (frontImageEcodedString && ![frontImageEcodedString isKindOfClass:[NSNull class]]) {
        NSRange frontImageReplaceRange = [frontImageEcodedString rangeOfString:@"base64," options:NSBackwardsSearch];
        if (frontImageReplaceRange.location != NSNotFound){
            frontImageEcodedString = [frontImageEcodedString substringFromIndex:frontImageReplaceRange.location ];
            frontImageEcodedString = [frontImageEcodedString stringByReplacingOccurrencesOfString:@"base64," withString:@""];
        }
        NSData *frontImageData = [[NSData alloc]initWithBase64EncodedString:frontImageEcodedString options:NSDataBase64DecodingIgnoreUnknownCharacters];
        frontImage = [UIImage imageWithData:frontImageData];
    }else{
        frontImage = nil;
    }
    UIImage *backImage;
    NSString *backImageEncodedString = [command.arguments objectAtIndex:1];
    if (backImageEncodedString && ![backImageEncodedString isKindOfClass:[NSNull class]]) {
        NSRange backImageReplaceRange = [backImageEncodedString rangeOfString:@"base64," options:NSBackwardsSearch];
        if (backImageReplaceRange.location != NSNotFound){
            backImageEncodedString = [backImageEncodedString substringFromIndex:backImageReplaceRange.location ];
            backImageEncodedString = [backImageEncodedString stringByReplacingOccurrencesOfString:@"base64," withString:@""];
        }
        NSData *backImageData = [[NSData alloc]initWithBase64EncodedString:backImageEncodedString options:NSDataBase64DecodingIgnoreUnknownCharacters];
        backImage = [UIImage imageWithData:backImageData];
    }else{
        backImage = nil;
    }
    NSString *stringData = [command.arguments objectAtIndex:2];
    if ([stringData isKindOfClass:[NSNull class]]) {
        stringData = nil;
    }
    
    //Obtain the default AcuantCardProcessRequestOptions object for the type of card you want to process (License card for this example)
    AcuantCardProcessRequestOptions *options = [AcuantCardProcessRequestOptions defaultRequestOptionsForCardType:_cardType];
    
    //Optionally, configure the options to the desired value
    NSNumber *autoDetectState = [command.arguments objectAtIndex:3];
    NSNumber *stateID = [command.arguments objectAtIndex:4];
    NSNumber *reformatImage = [command.arguments objectAtIndex:5];
    NSNumber *reformatImageColor = [command.arguments objectAtIndex:6];
    NSNumber *DPI = [command.arguments objectAtIndex:7];
    NSNumber *cropImage = [command.arguments objectAtIndex:8];
    NSNumber *faceDetection = [command.arguments objectAtIndex:9];
    NSNumber *signatureDetection = [command.arguments objectAtIndex:10];
    NSNumber *region = [command.arguments objectAtIndex:11];
    NSNumber *canLogTransaction = [command.arguments objectAtIndex:12];
    BOOL logtransaction = canLogTransaction.boolValue;
    NSNumber *imageSettings = [command.arguments objectAtIndex:13];
    
    options.autoDetectState = autoDetectState.boolValue;
    options.stateID = stateID.intValue;
    options.reformatImage = reformatImage.boolValue;
    options.reformatImageColor = reformatImageColor.intValue;
    options.DPI = DPI.intValue;
    options.cropImage = cropImage.boolValue;
    options.faceDetection = faceDetection.boolValue;
    options.signatureDetection = signatureDetection.boolValue;
    options.region = region.intValue;
    options.logtransaction = logtransaction;
    if(imageSettings!=nil){
        options.imageSettings=[imageSettings intValue];
    }
    
    // Now, perform the request
    [_instance processFrontCardImage:frontImage
                       BackCardImage:backImage
                       andStringData:stringData
                        withDelegate:self
                         withOptions:options];
    
}


#pragma mark AcuantMobileSDK Delegate Methods

/**
 These methods control the attributes of the status bar when this view controller is shown.
 */
- (void)cameraPrefersStatusBarHidden:(CDVInvokedUrlCommand*)command{
    NSNumber *cameraPrefersStatusBarHiddenNumber = [command.arguments objectAtIndex:0];
    _hiddenStatusBar = cameraPrefersStatusBarHiddenNumber.boolValue;
    
}
- (BOOL)cameraPrefersStatusBarHidden{
    return _hiddenStatusBar;
}

/**
 Called to obtain the watermark label position in the screen.
 @return the point where the watermark label should be positioned
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the help image though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 */
- (void)frameForWatermarkView:(CDVInvokedUrlCommand*)command{
    NSNumber *xnumber = [command.arguments objectAtIndex:0];
    int x = xnumber.intValue;
    NSNumber *ynumber = [command.arguments objectAtIndex:1];
    int y = ynumber.intValue;
    NSNumber *widthnumber = [command.arguments objectAtIndex:2];
    int width = widthnumber.intValue;
    NSNumber *heightnumber = [command.arguments objectAtIndex:3];
    int height = heightnumber.intValue;
    _watermarkLabelFrame = CGRectMake(x, y, width, height);
}
- (CGRect)frameForWatermarkView{
    return _watermarkLabelFrame;
}

/**
 Called to obtain the watermark Message displayed in the card capture interface
 @return the watermark Message
 @discussion if this method is not implemented or nil is returned, we'll not display a watermark Message view
 */
- (void)stringForWatermarkLabel:(CDVInvokedUrlCommand*)command{
    NSString *watermarkLabelString = [command.arguments objectAtIndex:0];
    _watermarkLabel = watermarkLabelString;
}
- (NSString*)stringForWatermarkLabel{
    return _watermarkLabel;
}

/**
 Called to obtain the help image position in the screen.
 @return the point where the help image should be positioned
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the help image though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 */
- (void)frameForHelpImageView:(CDVInvokedUrlCommand*)command{
    NSNumber *xnumber = [command.arguments objectAtIndex:0];
    int x = xnumber.intValue;
    NSNumber *ynumber = [command.arguments objectAtIndex:1];
    int y = ynumber.intValue;
    NSNumber *widthnumber = [command.arguments objectAtIndex:2];
    int width = widthnumber.intValue;
    NSNumber *heightnumber = [command.arguments objectAtIndex:3];
    int height = heightnumber.intValue;
    _helpImageFrame = CGRectMake(x, y, width, height);
}
- (CGRect)frameForHelpImageView{
    return _helpImageFrame;
}

/**
 Called to obtain the help image displayed in the card capture interface
 @return the help image
 @discussion if this method is not implemented or nil is returned, we'll not display a help image view
 */
- (void)imageForHelpImageView:(CDVInvokedUrlCommand*)command{
    NSString *encodedString = [command.arguments objectAtIndex:0];
    if (encodedString && ![encodedString isKindOfClass:[NSNull class]]) {
        NSRange range = [encodedString rangeOfString:@"base64," options:NSBackwardsSearch];
        if (range.location != NSNotFound) {
            encodedString = [encodedString substringFromIndex:range.location ];
            encodedString = [encodedString stringByReplacingOccurrencesOfString:@"base64," withString:@""];
        }
        NSData *data = [[NSData alloc]initWithBase64EncodedString:encodedString options:NSDataBase64DecodingIgnoreUnknownCharacters];
        _helpImage = [UIImage imageWithData:data];
    }else{
        _helpImage = nil;
    }
}
- (UIImage*)imageForHelpImageView{
    return _helpImage;
}

/**
 Called to show or not show the back button in the card capture interface
 @return show or not show the back button
 @discussion if this method is not implemented or nil is returned, we'll display a the button with "back" text
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is not called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)showBackButton:(CDVInvokedUrlCommand*)command{
    NSNumber *showBackButtonNumber = [command.arguments objectAtIndex:0];
    _showBackButton = showBackButtonNumber.boolValue;
}
- (BOOL)showBackButton{
    return _showBackButton;
}

/**
 Called to obtain the back button position in the screen.
 @return the point where the back button should be positioned
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the button though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is noot called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)frameForBackButton:(CDVInvokedUrlCommand*)command{
    NSNumber *xnumber = [command.arguments objectAtIndex:0];
    int x = xnumber.intValue;
    NSNumber *ynumber = [command.arguments objectAtIndex:1];
    int y = ynumber.intValue;
    NSNumber *widthnumber = [command.arguments objectAtIndex:2];
    int width = widthnumber.intValue;
    NSNumber *heightnumber = [command.arguments objectAtIndex:3];
    int height = heightnumber.intValue;
    _backButtonFrame = CGRectMake(x, y, width, height);
}
- (CGRect)frameForBackButton{
    return _backButtonFrame;
}

/**
 Called to obtain the back button image displayed in the card capture interface
 @return the back button image
 @discussion if this method is not implemented or nil is returned, we'll display a white rounded button with "back" text
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is not called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)imageForBackButton:(CDVInvokedUrlCommand*)command{
    NSString *encodedString = [command.arguments objectAtIndex:0];
    if (encodedString && ![encodedString isKindOfClass:[NSNull class]]) {
        NSRange range = [encodedString rangeOfString:@"base64," options:NSBackwardsSearch];
        if (range.location != NSNotFound) {
            encodedString = [encodedString substringFromIndex:range.location ];
            encodedString = [encodedString stringByReplacingOccurrencesOfString:@"base64," withString:@""];
        }
        
        NSData *data = [[NSData alloc]initWithBase64EncodedString:encodedString options:NSDataBase64DecodingIgnoreUnknownCharacters];
        _backButtonImage = [UIImage imageWithData:data];
        
    }else{
        _backButtonImage = nil;
    }
}
- (UIImage*)imageForBackButton{
    return _backButtonImage;
}


/**
 Called to show or not show the iPad brackets on the card capture interface
 @param command CDVInvokedUrlCommand
 @return show or not show the iPad brackets
 @discussion if this method is not implemented, we'll not display a brackets on the view
 */
- (void)showiPadBrackets:(CDVInvokedUrlCommand*)command{
    NSNumber *showBackButtonNumber = [command.arguments objectAtIndex:0];
    _showiPadBrackets = showBackButtonNumber.boolValue;
}
-(BOOL)showiPadBrackets{
    return _showiPadBrackets;
}

/**
 Called to show or not show the flashlight button in the card capture interface
 @return show or not show the flashlight button
 @discussion if this method is not implemented or nil is returned, we'll display a the button with "flash" text
 */
- (void)showFlashlightButton:(CDVInvokedUrlCommand*)command{
    NSNumber *showFlashlightButtonNumber = [command.arguments objectAtIndex:0];
    _showFlashlightButton = showFlashlightButtonNumber.boolValue;
}
- (BOOL)showFlashlightButton{
    return _showFlashlightButton;
}

/**
 Called to obtain the flashlight button position in the screen.
 @return the point where the flashlight button should be positioned
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the button though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 */
- (void)frameForFlashlightButton:(CDVInvokedUrlCommand*)command{
    NSNumber *xnumber = [command.arguments objectAtIndex:0];
    int x = xnumber.intValue;
    NSNumber *ynumber = [command.arguments objectAtIndex:1];
    int y = ynumber.intValue;
    NSNumber *widthnumber = [command.arguments objectAtIndex:2];
    int width = widthnumber.intValue;
    NSNumber *heightnumber = [command.arguments objectAtIndex:3];
    int height = heightnumber.intValue;
    _flashlightButtonFrame = CGRectMake(x, y, width, height);
}
- (CGRect)frameForFlashlightButton{
    return _flashlightButtonFrame;
}

/**
 Called to obtain the flashlight button image displayed in the card capture interface
 @return the flashlight button image
 @discussion if this method is not implemented or nil is returned, we'll display a white rounded button with "flash" text
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is not called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)imageForFlashlightButton:(CDVInvokedUrlCommand*)command{
    NSString *encodedString = [command.arguments objectAtIndex:0];
    if (encodedString && ![encodedString isKindOfClass:[NSNull class]]) {
        NSRange range = [encodedString rangeOfString:@"base64," options:NSBackwardsSearch];
        if (range.location != NSNotFound) {
            encodedString = [encodedString substringFromIndex:range.location ];
            encodedString = [encodedString stringByReplacingOccurrencesOfString:@"base64," withString:@""];
        }
        NSData *data = [[NSData alloc]initWithBase64EncodedString:encodedString options:NSDataBase64DecodingIgnoreUnknownCharacters];
        _flashlightButtonImage = [UIImage imageWithData:data];
    }else{
        _flashlightButtonImage = nil;
    }
}
- (UIImage *)imageForFlashlightButton{
    return _flashlightButtonImage;
}

//Internal Methods
#pragma mark -
#pragma mark AcuantMobileSDK Delegate Methods

- (void)didTakeCardPhoto{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"onCardImageCaptured" forKey:@"id"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

/**
 Called to inform the delegate that a card image was captured
 @param cardImage the card image
 */
- (void)didCaptureCropImage:(UIImage *)cardImage scanBackSide:(BOOL)scanBackSide andCardType:(AcuantCardType)cardType withImageMetrics:(NSDictionary*)imageMetrics{
    CDVPluginResult* result;
    if ((_region == AcuantCardRegionUnitedStates || _region == AcuantCardRegionCanada) && _isBackSide){
        _methodId = @"cropBarcode";
    }else{
        _methodId = @"didCaptureCropImage";
    }
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];
    if(cardImage){
        [resultDictionary setObject:_methodId forKey:@"id"];
        NSData *data = UIImagePNGRepresentation(cardImage);
        NSString *encodedString = [data base64EncodedStringWithOptions:0];
        
        if(imageMetrics != nil){
            BOOL isSharp = [[imageMetrics objectForKey:@"IS_SHARP"] boolValue];
            float sharpnessGrade = [[imageMetrics objectForKey:@"SHARPNESS_GRADE"] floatValue];
            
            BOOL hasGlare = [[imageMetrics objectForKey:@"HAS_GLARE"] boolValue];
            float glareGrade = [[imageMetrics objectForKey:@"GLARE_GRADE"] floatValue];
            
            [resultDictionary setObject:@(isSharp) forKey:@"IS_SHARP"];
            [resultDictionary setObject:@(sharpnessGrade) forKey:@"SHARPNESS_GRADE"];
            [resultDictionary setObject:@(hasGlare) forKey:@"HAS_GLARE"];
            [resultDictionary setObject:@(glareGrade) forKey:@"GLARE_GRADE"];
        }
        
        [resultDictionary setObject:encodedString forKey:@"data"];
        [resultDictionary setObject:[NSNumber numberWithBool:scanBackSide] forKey:@"scanBackSide"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsDictionary:resultDictionary];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    }else{
        [resultDictionary setObject:@"didFailWithError" forKey:@"id"];
        [resultDictionary setObject:@"Unable to detect the card. Please try again." forKey:@"errorMessage"];
        NSNumber *errorType = [NSNumber numberWithInt:AcuantErrorUnableToCrop];
        [resultDictionary setObject:errorType forKey:@"errorType"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                messageAsDictionary:resultDictionary];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    }
}

- (void)didCancelToCaptureData:(UIImage*)croppedImage withImageMetrics:(NSDictionary*)imageMetrics andOriginalImage:(UIImage*)originalImage{
    _methodId = @"didCancelToCaptureData";
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];
    [resultDictionary setObject:_methodId forKey:@"id"];
    
    if(imageMetrics != nil){
        BOOL isSharp = [[imageMetrics objectForKey:@"IS_SHARP"] boolValue];
        float sharpnessGrade = [[imageMetrics objectForKey:@"SHARPNESS_GRADE"] floatValue];
    
        BOOL hasGlare = [[imageMetrics objectForKey:@"HAS_GLARE"] boolValue];
        float glareGrade = [[imageMetrics objectForKey:@"GLARE_GRADE"] floatValue];
    
        [resultDictionary setObject:@(isSharp) forKey:@"IS_SHARP"];
        [resultDictionary setObject:@(sharpnessGrade) forKey:@"SHARPNESS_GRADE"];
        [resultDictionary setObject:@(hasGlare) forKey:@"HAS_GLARE"];
        [resultDictionary setObject:@(glareGrade) forKey:@"GLARE_GRADE"];
    }
    
    if(croppedImage!=nil){
        NSData *data = UIImagePNGRepresentation(croppedImage);
        NSString *encodedString = [data base64EncodedStringWithOptions:0];
        [resultDictionary setObject:encodedString forKey:@"croppedImageData"];
    }
    
    if(originalImage!=nil){
        NSData *data = UIImagePNGRepresentation(originalImage);
        NSString *encodedString = [data base64EncodedStringWithOptions:0];
        [resultDictionary setObject:encodedString forKey:@"originalImageData"];
    }
    
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}


- (void)didCaptureOriginalImage:(UIImage *)cardImage{
    CDVPluginResult* result;
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"didCaptureOriginalImage" forKey:@"id"];
    if(cardImage){
        NSData *data = UIImagePNGRepresentation(cardImage);
        NSString *encodedString = [data base64EncodedStringWithOptions:0];
        [resultDictionary setObject:encodedString forKey:@"data"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsDictionary:resultDictionary];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    }else{
        [resultDictionary setObject:@"didFailWithError" forKey:@"id"];
        [resultDictionary setObject:@"onOriginalCapture"   forKey:@"ErrorInMethod"];
        [resultDictionary setObject:@"Unable to capture" forKey:@"errorMessage"];
        NSNumber *errorType = [NSNumber numberWithInt:AcuantErrorUnableToCrop];
        [resultDictionary setObject:errorType forKey:@"errorType"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                messageAsDictionary:resultDictionary];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
        
    }
}

/**
 Called to inform the delegate that a barcode image was captured
 @param data the barcode string
 */
- (void)didCaptureData:(NSString*)data{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"didCaptureData" forKey:@"id"];
    [resultDictionary setObject:data forKey:@"data"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

-(void)barcodeScanTimeOut:(UIImage*)croppedImage withImageMetrics:(NSDictionary*)imageMetrics andOriginalImage:(UIImage*)originalImage{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"barcodeScanTimeOut" forKey:@"id"];
    
    if(imageMetrics != nil){
        BOOL isSharp = [[imageMetrics objectForKey:@"IS_SHARP"] boolValue];
        float sharpnessGrade = [[imageMetrics objectForKey:@"SHARPNESS_GRADE"] floatValue];
        
        BOOL hasGlare = [[imageMetrics objectForKey:@"HAS_GLARE"] boolValue];
        float glareGrade = [[imageMetrics objectForKey:@"GLARE_GRADE"] floatValue];
        
        [resultDictionary setObject:@(isSharp) forKey:@"IS_SHARP"];
        [resultDictionary setObject:@(sharpnessGrade) forKey:@"SHARPNESS_GRADE"];
        [resultDictionary setObject:@(hasGlare) forKey:@"HAS_GLARE"];
        [resultDictionary setObject:@(glareGrade) forKey:@"GLARE_GRADE"];
    }
    
    if(croppedImage!=nil){
        NSData *croppedImagedata = UIImagePNGRepresentation(croppedImage);
        NSString *encodedCroppedString = [croppedImagedata base64EncodedStringWithOptions:0];
        [resultDictionary setObject:encodedCroppedString forKey:@"croppedData"];
    }
    
    if(originalImage!=nil){
        NSData *originalImageData = UIImagePNGRepresentation(originalImage);
        NSString *encodedOriginalString = [originalImageData base64EncodedStringWithOptions:0];
        [resultDictionary setObject:encodedOriginalString forKey:@"originalData"];
    }
    
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}
/**
 Called to inform the delegate that the user pressed the back button
 */
- (void)didPressBackButton{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"didPressBackButton" forKey:@"id"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

/**
 Called to inform delegate that the request failed.
 @param error the reason why the request failed
 @discussion the delegate is in charge of analysing the error sent and inform the user.
 */
-(void)didFailWithError:(AcuantError *)error{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"didFailWithError" forKey:@"id"];
    [resultDictionary setObject:error.errorMessage forKey:@"errorMessage"];
    NSNumber *errorType = [NSNumber numberWithInt:error.errorType];
    [resultDictionary setObject:errorType forKey:@"errorType"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

-(void)didFailToCaptureCropImage{
    
}


/**
 Called to inform the delegate that the framework was validated
 */
-(void)mobileSDKWasValidated:(BOOL)wasValidated{
    _sdkValidated = wasValidated;
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"mobileSDKWasValidated" forKey:@"id"];
    NSNumber *wasValidatedNumber = [NSNumber numberWithBool:wasValidated];
    [resultDictionary setObject:[NSNumber numberWithBool:_instance.isAssureIDAllowed] forKey:@"isAssureIDAllowed"];
    [resultDictionary setObject:[NSNumber numberWithBool:_instance.isFacialEnabled] forKey:@"isFacialAllowed"];
    [resultDictionary setObject:wasValidatedNumber forKey:@"data"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

/**
 Called to inform the delegate that the capture interface did appear
 */
- (void)cardCaptureInterfaceDidAppear{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"cardCaptureInterfaceDidAppear" forKey:@"id"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

/**
 Called to inform the delegate that the capture interface did disappear
 */
- (void)cardCaptureInterfaceDidDisappear{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"cardCaptureInterfaceDidDisappear" forKey:@"id"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

/**
 Called to inform the delegate that the capture interface will disappear
 */
- (void)cardCaptureInterfaceWillDisappear{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"cardCaptureInterfaceWillDisappear" forKey:@"id"];
    CDVPluginResult* result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                             messageAsDictionary:resultDictionary];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}

/**
 Called to inform delegate that the request completed succesfully.
 @param result the data parsed from the card image
 */
- (void)didFinishProcessingCardWithResult:(AcuantCardResult*)result{
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"didFinishProcessingCardWithResult" forKey:@"id"];
    
    NSMutableDictionary *cardResult = [NSMutableDictionary dictionary];
    if (_cardType == AcuantCardTypeDriversLicenseCard) {
        cardResult =  [self dictionaryWithPropertiesOfObject: (AcuantDriversLicenseCard *)result];
    }else if(_cardType == AcuantCardTypeMedicalInsuranceCard){
        cardResult =  [self dictionaryWithPropertiesOfObject: (AcuantMedicalInsuranceCard *)result];
    }else{
        cardResult =  [self dictionaryWithPropertiesOfObject: (AcuantPassaportCard *)result];
    }
    
    [resultDictionary setObject:cardResult forKey:@"data"];
    CDVPluginResult* resultPlugin =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDictionary];
    [resultPlugin setKeepCallback:[NSNumber numberWithBool:YES]];
    _callbackId = _callbackIdImageProcess;
    [self.commandDelegate sendPluginResult:resultPlugin callbackId:_callbackId];
}


- (void)didFinishValidatingImageWithResult:(AcuantCardResult*)result{
    AcuantFacialData* facialData = (AcuantFacialData*)result;
    NSMutableDictionary *cardResult = [NSMutableDictionary dictionary];
    [cardResult setObject:[facialData valueForKey:@"isMatch"]  forKey:@"FacialMatch"];
    [cardResult setObject:[facialData valueForKey:@"facialMatchConfidenceRating"] forKey:@"FacialMatchConfidenceRating"];
    [cardResult setObject:[facialData valueForKey:@"faceLivelinessDetection"] forKey:@"FaceLivelinessDetection"];
    [cardResult setObject:facialData.transactionId forKey:@"TransactionId"];
    
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"didFinishProcessingFacialMatchWithResult" forKey:@"id"];
    [resultDictionary setObject:cardResult forKey:@"data"];
    CDVPluginResult* resultPlugin =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDictionary];
    [resultPlugin setKeepCallback:[NSNumber numberWithBool:YES]];
    _callbackId = _callbackIdFacialProcess;
    [self.commandDelegate sendPluginResult:resultPlugin callbackId:_callbackId];
}

#pragma mark -
#pragma mark Pivate Methods

-(NSMutableDictionary *) dictionaryWithPropertiesOfObject:(id)obj
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    
    unsigned count;
    objc_property_t *properties = class_copyPropertyList([obj class], &count);
    
    
    for (int i = 0; i < count; i++) {
        NSString *key = [NSString stringWithUTF8String:property_getName(properties[i])];
        if ([obj valueForKey:key] !=  nil) {
            if ([[obj valueForKey:key] isKindOfClass:[NSData class]]) {
                UIImage *image = [UIImage imageWithData:[obj valueForKey:key]];
                NSData *data = UIImagePNGRepresentation(image);
                NSString *encodedString = [data base64EncodedStringWithOptions:0];
                [dict setObject:encodedString forKey:key];
            }else{
                [dict setObject:[obj valueForKey:key] forKey:key];
            }
        }else{
            [dict setObject:[NSNull null] forKey:key];
        }
    }
    
    if([obj valueForKey:@"_idLocationCountryTestResult"]){
        [dict setObject:[obj valueForKey:@"_idLocationCountryTestResult"] forKey:@"idLocationCountryTestResult"];
    }
    if([obj valueForKey:@"_idLocationCountryTestResult"]){
        [dict setObject:[obj valueForKey:@"_idLocationStateTestResult"] forKey:@"idLocationStateTestResult"];
    }
    
    if([obj valueForKey:@"_idLocationCountryTestResult"]){
        [dict setObject:[obj valueForKey:@"_idLocationCityTestResult"] forKey:@"idLocationCityTestResult"];
    }
    
    if([obj valueForKey:@"_idLocationZipcodeTestResult"]){
        [dict setObject:[obj valueForKey:@"_idLocationZipcodeTestResult"] forKey:@"idLocationZipcodeTestResult"];
    }
    
    [dict setValue:[_instance getDeviceCity] forKey:@"DeviceCity"];
    [dict setValue:[_instance getDeviceArea] forKey:@"DeviceArea"];
    [dict setValue:[_instance getDeviceState] forKey:@"DeviceState"];
    [dict setValue:[_instance getDeviceCountry] forKey:@"DeviceCountry"];
    [dict setValue:[_instance getDeviceZipCode] forKey:@"DeviceZipcode"];
    [dict setValue:[_instance getDeviceCountryCode] forKey:@"DeviceCountryCode"];
    [dict setValue:[_instance getDeviceStreetAddress] forKey:@"DeviceStreetAddress"];
    
    
    return [NSMutableDictionary dictionaryWithDictionary:dict];
}


#pragma mark - Facial Methods

-(void)showFacialInterface:(CDVInvokedUrlCommand*)command{
    UIViewController *rootViewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    NSMutableAttributedString* instStr = [[NSMutableAttributedString alloc] initWithString:_facialInstructionString];
    if(_facialInstructionFontSize!=nil){
        UIFont *font = [UIFont systemFontOfSize:_facialInstructionFontSize.intValue];
        [instStr addAttribute:NSFontAttributeName value:font range:NSMakeRange(0, instStr.length)];
    
    }
    if(_facialInstructionFontColor!=nil){
        UIColor* fontColor = [self colorWithHexString:_facialInstructionFontColor];
        [instStr addAttribute:NSForegroundColorAttributeName value:fontColor range:NSMakeRange(0, instStr.length)];
    }
    [AcuantFacialRecognitionViewController
     presentFacialCaptureInterfaceWithDelegate:self withSDK:_instance inViewController:rootViewController withCancelButton:YES withCancelButtonRect:CGRectZero withWaterMark:_watermarkLabel withBlinkMessage:instStr inRect:_facialMessageFrame];
    
}
-(void)setFacialInstructionText:(CDVInvokedUrlCommand*)command{
    NSString *encodedString = [command.arguments objectAtIndex:0];
    _facialInstructionString = encodedString;
}
-(void)setFacialInstructionLocation:(CDVInvokedUrlCommand*)command{
    _facialTextLeft =[command.arguments objectAtIndex:0];
    _facialTextTop =[command.arguments objectAtIndex:1];
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    CGFloat screenWidth = screenRect.size.width;
    _facialMessageFrame = CGRectMake([_facialTextLeft doubleValue],[_facialTextTop doubleValue],screenWidth,20);
}
-(void)setFacialInstructionTextStyle:(CDVInvokedUrlCommand*)command{
    _facialInstructionFontColor = [command.arguments objectAtIndex:0];
    _facialInstructionFontSize =[command.arguments objectAtIndex:1];
}
-(void)setFacialRecognitionTimeout:(CDVInvokedUrlCommand*)command{
    _facialTimeout = [command.arguments objectAtIndex:0];
    
}

-(void)setFacialSubInstructionString:(CDVInvokedUrlCommand*)command{
    _subInstructionString = [command.arguments objectAtIndex:0];
    
}

-(void)setFacialSubInstructionLocation:(CDVInvokedUrlCommand*)command{
    _facialSubInstructionLeft = [command.arguments objectAtIndex:0];
    _facialSubInstructionTop =[command.arguments objectAtIndex:1];
    
}

-(void)setFacialSubInstructionColor:(CDVInvokedUrlCommand*)command{
    _facialSubInstructionFontColor = [command.arguments objectAtIndex:0];
}

- (UIColor *)colorWithHexString:(NSString *)hexString {
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // bypass '#' character
    [scanner scanHexInt:&rgbValue];
    
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}

-(void)processFacialImageValidation:(CDVInvokedUrlCommand*)command;{
    _callbackId = [command callbackId];
    _callbackIdFacialProcess = [command callbackId];
    NSString *selfiImageString = [command.arguments objectAtIndex:0];
    UIImage* selfieImage = nil;
    if (selfiImageString && ![selfiImageString isKindOfClass:[NSNull class]]) {
        NSRange selfieImageReplaceRange = [selfiImageString rangeOfString:@"base64," options:NSBackwardsSearch];
        if (selfieImageReplaceRange.location != NSNotFound){
            selfiImageString = [selfiImageString substringFromIndex:selfieImageReplaceRange.location ];
            selfiImageString = [selfiImageString stringByReplacingOccurrencesOfString:@"base64," withString:@""];
        }
        NSData *selfieImageData = [[NSData alloc]initWithBase64EncodedString:selfiImageString options:NSDataBase64DecodingIgnoreUnknownCharacters];
        selfieImage = [UIImage imageWithData:selfieImageData];
    }
    
    NSString *faceImageString = [command.arguments objectAtIndex:1];
    NSData *faceImageData = nil;
    if (faceImageString && ![faceImageString isKindOfClass:[NSNull class]]) {
        NSRange faceImageReplaceRange = [faceImageString rangeOfString:@"base64," options:NSBackwardsSearch];
        if (faceImageReplaceRange.location != NSNotFound){
            faceImageString = [faceImageString substringFromIndex:faceImageReplaceRange.location ];
            faceImageString = [faceImageString stringByReplacingOccurrencesOfString:@"base64," withString:@""];
        }
        faceImageData = [[NSData alloc]initWithBase64EncodedString:faceImageString options:NSDataBase64DecodingIgnoreUnknownCharacters];
        //faceImage = [UIImage imageWithData:faceImageData];
    }
    
    
    NSNumber *canLogTransaction = [command.arguments objectAtIndex:2];
    BOOL logtransaction = canLogTransaction.boolValue;
    
    AcuantCardProcessRequestOptions *options = [AcuantCardProcessRequestOptions defaultRequestOptionsForCardType:AcuantCardTypeFacial];
    options.logtransaction = logtransaction;
    _cardType = AcuantCardTypeFacial;
    // Now, perform the request
    [_instance validatePhotoOne:selfieImage withImage:faceImageData withDelegate:self withOptions:options];
}

-(void)didFinishFacialRecognition:(UIImage*)image{
    CDVPluginResult* result;
    _methodId = @"onFacialRecognitionCompleted";
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"onFacialRecognitionCompleted" forKey:@"id"];
    if(image!=nil){
        NSData *data = UIImagePNGRepresentation(image);
        NSString *encodedString = [data base64EncodedStringWithOptions:0];
        [resultDictionary setObject:encodedString forKey:@"selfieImageData"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsDictionary:resultDictionary];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    }else{
        [resultDictionary setObject:[[NSNull alloc] init] forKey:@"selfieImageData"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsDictionary:resultDictionary];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    }
}
-(void)didCancelFacialRecognition{
    CDVPluginResult* result;
    _methodId = @"onFacialRecognitionCanceled";
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"onFacialRecognitionCanceled" forKey:@"id"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsDictionary:resultDictionary];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
}
-(void)didTimeoutFacialRecognition:(UIImage*)lastImage{
    CDVPluginResult* result;
    _methodId = @"onFacialRecognitionTimedOut";
    NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionaryWithObject:@"onFacialRecognitionTimedOut" forKey:@"id"];
    if(lastImage!=nil){
        NSData *data = UIImagePNGRepresentation(lastImage);
        NSString *encodedString = [data base64EncodedStringWithOptions:0];
        [resultDictionary setObject:encodedString forKey:@"selfieImageData"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsDictionary:resultDictionary];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    }else{
        [resultDictionary setObject:[[NSNull alloc] init] forKey:@"selfieImageData"];
        result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsDictionary:resultDictionary];
        [self.commandDelegate sendPluginResult:result callbackId:_callbackId];
    }
}
-(UIImage*)imageForFacialBackButton{
    return nil;
}

-(int)facialRecognitionTimeout{
    return [_facialTimeout intValue];
}
-(NSAttributedString*)messageToBeShownAfterFaceRectangleAppears{
    NSMutableAttributedString* subAttrStr = [[NSMutableAttributedString alloc] initWithString:_subInstructionString];
    if(_facialSubInstructionFontColor!=nil){
        UIColor* fontColor = [self colorWithHexString:_facialSubInstructionFontColor];
        [subAttrStr addAttribute:NSForegroundColorAttributeName value:fontColor range:NSMakeRange(0, subAttrStr.length)];
    }
    return subAttrStr;
}
-(CGRect)frameWhereMessageToBeShownAfterFaceRectangleAppears{
    if(_facialSubInstructionLeft!=nil && _facialSubInstructionTop!=nil){
        CGRect screenRect = [[UIScreen mainScreen] bounds];
        CGFloat screenWidth = screenRect.size.width;
        _facialSubMessageFrame = CGRectMake([_facialSubInstructionLeft doubleValue],[_facialSubInstructionTop doubleValue],screenWidth,20);
    }else{
        _facialSubMessageFrame = CGRectZero;
    }
    return _facialSubMessageFrame;
}

@end
