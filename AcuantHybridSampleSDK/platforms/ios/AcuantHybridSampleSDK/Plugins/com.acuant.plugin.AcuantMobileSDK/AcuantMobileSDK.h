#import <Cordova/CDV.h>

@interface AcuantMobileSDK : CDVPlugin


/**
 Use this method to obtain an instance of the CSSNMobileSDKController if License key was set
 @discussion never try to alloc/init this class, always obtain an instance through this method.
 @return the CSSNMobileSDKController instance
 */
- (void)initAcuantMobileSDK:(CDVInvokedUrlCommand*)command;

/**
 Use this method to obtain an instance of the AcuantMobileSDKController if License key is correct and show the camera interface after the key was validated and approved
 @param command CDVInvokedUrlCommand
 @discussion never try to alloc/init this class, always obtain an instance through this method.
 @return the AcuantMobileSDKController instance
 */
- (void)initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController:(CDVInvokedUrlCommand*)command;

/**
Use this method to present the card capture interface.
@param command CDVInvokedUrlCommand
@discussion a valid viewController is required
*/
- (void)showManualCameraInterfaceInViewController:(CDVInvokedUrlCommand*)command;
/**
Use this method to present the card capture interface.
@param command CDVInvokedUrlCommand
@discussion a valid viewController is required
*/
- (void)showBarcodeCameraInterfaceInViewController:(CDVInvokedUrlCommand*)command;

/**
 Use this method to dismiss the card capture interface
 @param command CDVInvokedUrlCommand
 @discussion You cannot use [UIPopOverController dismissPopoverAnimated:] method to dismiss the UIPopOverController
 */
- (void)dismissCardCaptureInterface:(CDVInvokedUrlCommand*)command;

/**
 Use this method to start the camera
 @param command CDVInvokedUrlCommand
 @discussion you don't need to call this method after presenting the camera interface
 @discussion if we're already capturing video this method does nothing
 */
- (void)startCamera:(CDVInvokedUrlCommand*)command;

/**
 Use this method to stop the camera
 @param command CDVInvokedUrlCommand
 @discussion if camera is already stop, this method does nothing
 */
- (void)stopCamera:(CDVInvokedUrlCommand*)command;

/**
 Use this method to pause the scanning of the barcode
 @param command CDVInvokedUrlCommand
 @discussion if the scanning is already stopped, this method does nothing
 */
- (void)pauseScanningBarcodeCamera:(CDVInvokedUrlCommand*)command;

/**
 Use this method to resume the scanning of the barcode
 @param command CDVInvokedUrlCommand
 @discussion if the scanning is already running this method does nothing
 */
- (void)resumeScanningBarcodeCamera:(CDVInvokedUrlCommand*)command;

/**
 Use this method to configure the License key
 @param command CDVInvokedUrlCommand
 @discussion you are in charge of setting License key on each application launch as part of the setup of the framework
 */
- (void)setLicenseKey:(CDVInvokedUrlCommand*)command;

/**
 Use this method to configure the Cloud Address of the server
 @param command CDVInvokedUrlCommand
 */
- (void)setCloudAddress:(CDVInvokedUrlCommand*)command;

/**
 Use this method to activate the license key
 @param command CDVInvokedUrlCommand
 */
- (void)activateLicenseKey:(CDVInvokedUrlCommand*)command;

/**
 Use this method to set the width of the cropped image
 @param command CDVInvokedUrlCommand
 @discussion you need to set the height with setHeight:(int)height to crop the image with these values
*/
-(void)setWidth:(CDVInvokedUrlCommand*)command;

/**
 Use it to enable or disable the barcode Cropping
 @param command CDVInvokedUrlCommand
 */
-(void)setCanCropBarcode:(CDVInvokedUrlCommand*)command;

/**
 Use it to enable or disable the Initial Message on Barcode Camera
 @param command CDVInvokedUrlCommand
 */
-(void)setCanShowMessage:(CDVInvokedUrlCommand*)command;

/**
 Called to set a customize appear message, background color, time lenght and frame.
 @param command CDVInvokedUrlCommand
 @discussion in case this method in not implementd by the delegate, we'll set a default message, background color, time lenght and frame.
 */
- (void)setInitialMessage:(CDVInvokedUrlCommand*)command;

/**
 Called to set a customize finaly message, background color, time lenght and frame.
 @param command CDVInvokedUrlCommand
 @discussion in case this method in not implementd by the delegate, we'll set a default message, background color, time lenght and frame.
 */
- (void)setCapturingMessage:(CDVInvokedUrlCommand*)command;

/**
 Use this method to process a card.
 @param command CDVInvokedUrlCommand
 @discussion you must always provide a front image, back image is optional
 @discussion use the options object to indicate the type of card you're trying to process (i.e. License, Medical). Processing will fail if you don't provide this parameter.
 @discussion you're encourage to provide a delegate to be informed about what happened with your processing request. You can change the delegate using the cardProcessingDelegate property of this class.
 @discussion you should call this method only once and wait until your delegate is informed. If you call this method while we're already processing a card, we'll ignore your second call.
 @discussion The recommended size to this images is 1009 width and relative height to the width.
 */
 - (void)processCardImage:(CDVInvokedUrlCommand*)command;

/**
 These methods control the attributes of the status bar when this view controller is shown.
 */
- (void)cameraPrefersStatusBarHidden:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the watermark label position in the screen.
 @param command CDVInvokedUrlCommand
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the help image though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 */
- (void)frameForWatermarkView:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the watermark Message displayed in the card capture interface
 @param command CDVInvokedUrlCommand
 @discussion if this method is not implemented or nil is returned, we'll not display a watermark Message view
 */
- (void)stringForWatermarkLabel:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the help image position in the screen.
 @param command CDVInvokedUrlCommand
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the help image though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 */
- (void)frameForHelpImageView:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the help image displayed in the card capture interface
 @param command CDVInvokedUrlCommand
 @discussion if this method is not implemented or nil is returned, we'll not display a help image view
 */
- (void)imageForHelpImageView:(CDVInvokedUrlCommand*)command;

/**
 Called to show or not show the back button in the card capture interface
 @param command CDVInvokedUrlCommand
 @discussion if this method is not implemented or nil is returned, we'll display a the button with "back" text
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is not called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)showBackButton:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the back button position in the screen.
 @param command CDVInvokedUrlCommand
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the button though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is noot called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)frameForBackButton:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the back button image displayed in the card capture interface
 @param command CDVInvokedUrlCommand
 @discussion if this method is not implemented or nil is returned, we'll display a white rounded button with "back" text
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is not called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)imageForBackButton:(CDVInvokedUrlCommand*)command;

 /**
 Called to show or not show the iPad brackets on the card capture interface
 @param command CDVInvokedUrlCommand
 @return show or not show the iPad brackets
 @discussion if this method is not implemented, we'll not display a brackets on the view
 */
- (void)showiPadBrackets:(CDVInvokedUrlCommand*)command;

/**
 Called to show or not show the flashlight button in the card capture interface
 @return show or not show the flashlight button
 @discussion if this method is not implemented or nil is returned, we'll display a the button with "flash" text
 */
- (void)showFlashlightButton:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the flashlight button position in the screen.
 @return the point where the flashlight button should be positioned
 @discussion in case this method is not implemented by the delegate, we'll set a default location for the button though we encourage you to set the position manually.
 @discussion if your application supports multiple screen sizes then you are in charge of returning the correct position for each screen size.
 */
- (void)frameForFlashlightButton:(CDVInvokedUrlCommand*)command;

/**
 Called to obtain the flashlight button image displayed in the card capture interface
 @return the flashlight button image
 @discussion if this method is not implemented or nil is returned, we'll display a white rounded button with "flash" text
 @discussion this delegate method is only called when presenting the card capture interface full screen. If card capture interface is presented in a UIPopOverController, this method is not called at all because a Cancel UIBarButtonItem in the UINavigationBar is used instead.
 */
- (void)imageForFlashlightButton:(CDVInvokedUrlCommand*)command;

@end