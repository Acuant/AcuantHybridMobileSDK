package com.acuant.plugin;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.nfc.NfcAdapter;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;

import com.acuant.mobilesdk.AcuantAndroidMobileSDKController;
import com.acuant.mobilesdk.AcuantErrorListener;
import com.acuant.mobilesdk.AcuantNFCCardDetails;
import com.acuant.mobilesdk.AcuantTagReadingListener;
import com.acuant.mobilesdk.Card;
import com.acuant.mobilesdk.CardCroppingListener;
import com.acuant.mobilesdk.CardType;
import com.acuant.mobilesdk.DriversLicenseCard;
import com.acuant.mobilesdk.ErrorType;
import com.acuant.mobilesdk.FacialData;
import com.acuant.mobilesdk.FacialRecognitionListener;
import com.acuant.mobilesdk.LicenseDetails;
import com.acuant.mobilesdk.MedicalCard;
import com.acuant.mobilesdk.PassportCard;
import com.acuant.mobilesdk.ProcessImageRequestOptions;
import com.acuant.mobilesdk.WebServiceListener;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;

public class AcuantMobileSDK extends CordovaPlugin implements WebServiceListener, CardCroppingListener, AcuantErrorListener, FacialRecognitionListener, AcuantTagReadingListener {
    
    private String key = "";
    private String cloudAddressString = "";
    private String methodId = "";
    private int cardType;
    private int cardRegion;
    private boolean isBarcodeSide;
    private boolean canCropBarcode;
    private boolean canCaptureOriginalImage;
    private boolean sdkValidated;
    private boolean cropBarcodeOnCancel;
    private boolean canShowMessage;
    private boolean canShowStatusBar;
    private CallbackContext callbackId;
    private CallbackContext callbackIdImageProcess;
    private CallbackContext callbackIdFacialProcess;
    private AcuantAndroidMobileSDKController acuantAndroidMobileSDKController = null;
    private static AcuantAndroidMobileSDKController sdkController = null;
    
    private String watermarkText = "Powered By Acuant";
    private String facialInstrunctionText = null;
    
    private int xWatermark = 0;
    private int yWatermark = 30;
    private int widthWatermark = 0;
    private int heightWatermark = 0;
    
    private int facialInstructionLeft = 0;
    private int facialInstructionTop = 0;
    
    private String facialSubInstructionString = "Analyzing";
    private String facialSubInstHexColor = null;
    private int facialSubInstLeft = 0;
    private int facialSubInstTop = 0;
    private String facialInstructionTextFontColor = "#ffffff";
    private int facialInstructionTextFontSize = 50;
    
    private int facialTimeOut = 20;
    
    private int xFlashlight = 0;
    private int yFlashlight = 0;
    private int widthFlashlight = 0;
    private int heightFlashlight = 0;
    
    NfcAdapter nfcAdapter;
    private String echip_docNumber = null;
    private String echip_dateOfBirth = null;
    private String echip_dateOfExpiry = null;
    
    private Intent nfcIntent = null;
    
    private enum Action {
        initAcuantMobileSDK, initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController, showManualCameraInterfaceInViewController, showBarcodeCameraInterfaceInViewController, dismissCardCaptureInterface, startCamera, stopCamera, pauseScanningBarcodeCamera, resumeScanningBarcodeCamera, setLicenseKey, setCloudAddress, setWidth, setCanCropBarcode, setCanCaptureOriginalImage, setCropBarcodeOnCancel, setCanShowMessage, setInitialMessage, setCapturingMessage, processCardImage, cameraPrefersStatusBarHidden, frameForWatermarkView, stringForWatermarkLabel, frameForHelpImageView, imageForHelpImageView, showBackButton, frameForBackButton, imageForBackButton, showiPadBrackets, showFlashlightButton, frameForFlashlightButton, imageForFlashlightButton, enableLocationAuthentication, showFacialInterface, setFacialInstructionText, setFacialInstructionLocation, setFacialInstructionTextStyle, setFacialRecognitionTimeout, processFacialImageValidation, setFacialSubInstructionString, setFacialSubInstructionColor, setFacialSubInstructionLocation, scanEChip, readEChip, isSDKValidated;
    }
    
    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {
        Action actionMethods;
        try {
            actionMethods = Action.valueOf(action);
        } catch (Exception ex) {
            ex.printStackTrace();
            JSONObject obj = new JSONObject();
            try {
                obj.put("id", "execute");
                obj.put("error", String.valueOf(ex));
                PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                result.setKeepCallback(true);
                callbackId.sendPluginResult(result);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return false;
        }
        JSONObject obj = new JSONObject();
        
        switch (actionMethods) {
            case initAcuantMobileSDK:
                methodId = "initAcuantMobileSDK";
                callbackId = callbackContext;
                if (data.getString(0) != null) {
                    key = data.getString(0);
                } else {
                    key = "";
                }
                if (data.getString(1) != null && !data.getString(1).trim().equalsIgnoreCase("")) {
                    cloudAddressString = data.getString(1);
                } else {
                    cloudAddressString = "cssnwebservices.com";
                }
                
                // load the controller instance
                acuantAndroidMobileSDKController = AcuantAndroidMobileSDKController.getInstance(cordova.getActivity(), cloudAddressString, key);
                acuantAndroidMobileSDKController.setWebServiceListener(this);
                acuantAndroidMobileSDKController.setCardCroppingListener(this);
                acuantAndroidMobileSDKController.setAcuantErrorListener(this);
                sdkController = acuantAndroidMobileSDKController;
                break;
            case initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController:
                methodId = "initAcuantMobileSDKAndShowCardCaptureInterfaceInViewController";
                
                callbackId = callbackContext;
                if (data.getString(0) != null) {
                    key = data.getString(0);
                } else {
                    key = "";
                }
                
                if (data.getInt(1) == 1) {
                    cardType = CardType.MEDICAL_INSURANCE;
                } else if (data.getInt(1) == 2) {
                    cardType = CardType.DRIVERS_LICENSE;
                } else if (data.getInt(1) == 3) {
                    cardType = CardType.PASSPORT;
                }
                
                
                if (cardType == CardType.DRIVERS_LICENSE) {
                    cardRegion = data.getInt(2);
                    isBarcodeSide = data.getBoolean(3);
                } else {
                    cardRegion = 0;
                    isBarcodeSide = false;
                }
                
                // load the controller instance
                acuantAndroidMobileSDKController = AcuantAndroidMobileSDKController.getInstanceAndShowCameraInterface(cordova.getActivity(), key, cordova.getActivity(), cardType, cardRegion, isBarcodeSide);
                break;
            case showManualCameraInterfaceInViewController:
                methodId = "showManualCameraInterfaceInViewController";
                callbackId = callbackContext;
                
                if (data.getInt(0) == 1) {
                    cardType = CardType.MEDICAL_INSURANCE;
                } else if (data.getInt(0) == 2) {
                    cardType = CardType.DRIVERS_LICENSE;
                } else if (data.getInt(0) == 3) {
                    cardType = CardType.PASSPORT;
                }
                
                if (cardType == CardType.DRIVERS_LICENSE) {
                    cardRegion = data.getInt(1);
                    isBarcodeSide = data.getBoolean(2);
                } else {
                    cardRegion = 0;
                    isBarcodeSide = false;
                }
                acuantAndroidMobileSDKController.showManualCameraInterface(cordova.getActivity(), cardType, cardRegion, isBarcodeSide);
                break;
            case showBarcodeCameraInterfaceInViewController:
                methodId = "showBarcodeCameraInterfaceInViewController";
                callbackId = callbackContext;
                
                if (data.getInt(0) == 1) {
                    cardType = CardType.MEDICAL_INSURANCE;
                } else if (data.getInt(0) == 2) {
                    cardType = CardType.DRIVERS_LICENSE;
                } else if (data.getInt(0) == 3) {
                    cardType = CardType.PASSPORT;
                }
                
                if (cardType == CardType.DRIVERS_LICENSE) {
                    cardRegion = data.getInt(1);
                } else {
                    cardRegion = 0;
                }
                
                acuantAndroidMobileSDKController.showCameraInterfacePDF417(cordova.getActivity(), cardType, cardRegion);
                break;
            case dismissCardCaptureInterface:
                callbackId = callbackContext;
                try {
                    obj.put("id", "dismissCardCaptureInterface");
                    obj.put("error", "No " + action + " Method");
                    if (acuantAndroidMobileSDKController.getBarcodeCameraContext() != null) {
                        acuantAndroidMobileSDKController.finishScanningBarcodeCamera();
                    }
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case startCamera:
                methodId = "startCamera";
                callbackId = callbackContext;
                try {
                    obj.put("id", methodId);
                    obj.put("error", "No " + action + " Method");
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case stopCamera:
                methodId = "stopCamera";
                callbackId = callbackContext;
                try {
                    obj.put("id", methodId);
                    obj.put("error", "No " + action + " Method");
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case pauseScanningBarcodeCamera:
                methodId = "pauseScanningBarcodeCamera";
                callbackId = callbackContext;
                acuantAndroidMobileSDKController.pauseScanningBarcodeCamera();
                break;
            case resumeScanningBarcodeCamera:
                methodId = "resumeScanningBarcodeCamera";
                callbackId = callbackContext;
                acuantAndroidMobileSDKController.resumeScanningBarcodeCamera();
                break;
            case setLicenseKey:
                methodId = "setLicenseKey";
                callbackId = callbackContext;
                if (data.getString(0) != null && data.getString(0).trim().length() > 0) {
                    key = data.getString(0);
                } else {
                    obj.put("id", methodId);
                    obj.put("data", false);
                    obj.put("errorType", ErrorType.AcuantErrorOnActiveLicenseKey);
                    obj.put("errorMessage", "The license key cannot be empty.");
                    PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                    break;
                }
                if (key.contains(" ")) {
                    obj.put("id", methodId);
                    obj.put("data", false);
                    obj.put("errorType", ErrorType.AcuantErrorOnActiveLicenseKey);
                    obj.put("errorMessage", "The license key cannot be empty.");
                    PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                    break;
                }
                acuantAndroidMobileSDKController.setLicensekey(key);
                break;
            case setCloudAddress:
                methodId = "setCloudAddress";
                callbackId = callbackContext;
                if (data.getString(0) != null) {
                    cloudAddressString = data.getString(0);
                } else {
                    cloudAddressString = "cssnwebservices.com";
                }
                acuantAndroidMobileSDKController.setCloudUrl(cloudAddressString);
                break;
            case setWidth:
                methodId = "setWidth";
                callbackId = callbackContext;
                int width = data.getInt(0);
                if (width == 0) {
                    width = 637;
                }
                acuantAndroidMobileSDKController.setWidth(width);
                break;
            case setCanCropBarcode:
                methodId = "setCanCropBarcode";
                callbackId = callbackContext;
                canCropBarcode = data.getBoolean(0);
                acuantAndroidMobileSDKController.setCropBarcode(canCropBarcode);
                break;
            case setCanCaptureOriginalImage:
                methodId = "setCanCaptureOriginalImage";
                callbackId = callbackContext;
                canCaptureOriginalImage = data.getBoolean(0);
                acuantAndroidMobileSDKController.setCaptureOriginalCapture(canCaptureOriginalImage);
                break;
            case setCropBarcodeOnCancel:
                methodId = "setCropBarcodeOnCancel";
                callbackId = callbackContext;
                cropBarcodeOnCancel = data.getBoolean(0);
                acuantAndroidMobileSDKController.setCropBarcodeOnCancel(cropBarcodeOnCancel);
                break;
            case enableLocationAuthentication:
                methodId = "enableLocationAuthentication";
                acuantAndroidMobileSDKController.enableLocationAuthentication(cordova.getActivity());
                break;
            case setCanShowMessage:
                methodId = "setCanShowMessage";
                callbackId = callbackContext;
                canShowMessage = data.getBoolean(0);
                acuantAndroidMobileSDKController.setShowInitialMessage(canShowMessage);
                break;
            case setInitialMessage:
                methodId = "setInitialMessage";
                callbackId = callbackContext;
                String initialMessage = data.getString(0);
                int initialMessageRed = data.getInt(5);
                int initialMessageGreen = data.getInt(6);
                int initialMessageBlue = data.getInt(7);
                int initialMessageApha = data.getInt(8);
                acuantAndroidMobileSDKController.setInitialMessageDescriptor(initialMessage, initialMessageRed, initialMessageGreen, initialMessageBlue, initialMessageApha);
                break;
            case setCapturingMessage:
                methodId = "setCapturingMessage";
                callbackId = callbackContext;
                String capturingMessage = data.getString(0);
                int capturingMessageRed = data.getInt(5);
                int capturingMessageGreen = data.getInt(6);
                int capturingMessageBlue = data.getInt(7);
                int capturingMessageApha = data.getInt(8);
                acuantAndroidMobileSDKController.setFinalMessageDescriptor(capturingMessage, capturingMessageRed, capturingMessageGreen, capturingMessageBlue, capturingMessageApha);
                break;
            case processCardImage:
                methodId = "processCardImage";
                callbackId = callbackContext;
                callbackIdImageProcess = callbackContext;
                String frontImageEcodedString = data.getString(0);
                byte[] frontImageDecodedString = Base64.decode(frontImageEcodedString, Base64.DEFAULT);
                Bitmap frontImageDecodedByte = BitmapFactory.decodeByteArray(frontImageDecodedString, 0, frontImageDecodedString.length);
                Drawable frontImageDrawable = new BitmapDrawable(cordova.getActivity().getResources(), frontImageDecodedByte);
                
                String backImageEcodedString = data.getString(1);
                byte[] backImageDecodedString = Base64.decode(backImageEcodedString, Base64.DEFAULT);
                Bitmap backImageDecodedByte = BitmapFactory.decodeByteArray(backImageDecodedString, 0, backImageDecodedString.length);
                Drawable backImageDrawable = new BitmapDrawable(cordova.getActivity().getResources(), backImageDecodedByte);
                
                String stringData = data.getString(2);
                if (stringData != null && stringData.equalsIgnoreCase("null")) {
                    stringData = null;
                }
                
                ProcessImageRequestOptions options = ProcessImageRequestOptions.getInstance();
                options.autoDetectState = data.getBoolean(3);
                options.stateID = data.getInt(4);
                options.reformatImage = data.getBoolean(5);
                options.reformatImageColor = data.getInt(6);
                options.DPI = data.getInt(7);
                options.cropImage = data.getBoolean(8);
                options.faceDetec = data.getBoolean(9);
                options.signDetec = data.getBoolean(10);
                if (cardType == CardType.DRIVERS_LICENSE) {
                    options.iRegion = data.getInt(11);
                } else {
                    options.iRegion = 0;
                }
                options.logTransaction = data.getBoolean(12);
                options.imageSettings = data.getInt(13);
                options.acuantCardType = cardType;
                acuantAndroidMobileSDKController.callProcessImageServices(frontImageDecodedByte, backImageDecodedByte, stringData, cordova.getActivity(), options);
                break;
            case cameraPrefersStatusBarHidden:
                methodId = "cameraPrefersStatusBarHidden";
                callbackId = callbackContext;
                canShowStatusBar = data.getBoolean(0);
                acuantAndroidMobileSDKController.setShowStatusBar(canShowStatusBar);
                break;
            case frameForWatermarkView:
                callbackId = callbackContext;
                xWatermark = data.getInt(0);
                yWatermark = data.getInt(1);
                widthWatermark = data.getInt(2);
                heightWatermark = data.getInt(3);
                acuantAndroidMobileSDKController.setWatermarkText(watermarkText, xWatermark, yWatermark, widthWatermark, heightWatermark);
                break;
            case stringForWatermarkLabel:
                callbackId = callbackContext;
                watermarkText = data.getString(0);
                acuantAndroidMobileSDKController.setWatermarkText(watermarkText, xWatermark, yWatermark, widthWatermark, heightWatermark);
                break;
            case frameForHelpImageView:
                callbackId = callbackContext;
                try {
                    obj.put("id", "frameForHelpImageView");
                    obj.put("error", "No " + action + " Method");
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case imageForHelpImageView:
                callbackId = callbackContext;
                String encodedImage = data.getString(0);
                if (encodedImage.contains("data:image/png;base64,")) {
                    encodedImage = encodedImage.replaceFirst("data:image/png;base64,", "");
                }
                byte[] decodedString = Base64.decode(encodedImage, Base64.DEFAULT);
                Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
                Drawable pdf417BarcodeImageDrawable = new BitmapDrawable(cordova.getActivity().getResources(), decodedByte);
                acuantAndroidMobileSDKController.setPdf417BarcodeImageDrawable(pdf417BarcodeImageDrawable);
                break;
            case showBackButton:
                callbackId = callbackContext;
                try {
                    obj.put("id", "showBackButton");
                    obj.put("error", "No " + action + " Method");
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case frameForBackButton:
                callbackId = callbackContext;
                try {
                    obj.put("id", "frameForBackButton");
                    obj.put("error", "No " + action + " Method");
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case imageForBackButton:
                callbackId = callbackContext;
                try {
                    obj.put("id", "imageForBackButton");
                    obj.put("error", "No " + action + " Method");
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case showiPadBrackets:
                methodId = "showiPadBrackets";
                callbackId = callbackContext;
                boolean showiPadBrackets = false;
                showiPadBrackets = data.getBoolean(0);
                acuantAndroidMobileSDKController.setCanShowBracketsOnTablet(showiPadBrackets);
                break;
            case showFlashlightButton:
                methodId = "showFlashlightButton";
                callbackId = callbackContext;
                boolean showFlashlight = false;
                showFlashlight = data.getBoolean(0);
                acuantAndroidMobileSDKController.setFlashlight(showFlashlight);
                break;
            case frameForFlashlightButton:
                methodId = "frameForFlashlightButton";
                callbackId = callbackContext;
                xFlashlight = data.getInt(0);
                yFlashlight = data.getInt(1);
                widthFlashlight = data.getInt(2);
                heightFlashlight = data.getInt(3);
                acuantAndroidMobileSDKController.setFlashlight(xFlashlight, yFlashlight, widthFlashlight, heightFlashlight);
                break;
            case imageForFlashlightButton:
                methodId = "imageForFlashlightButton";
                callbackId = callbackContext;
                String encodedImageOn = data.getString(0);
                if (encodedImageOn.contains("data:image/png;base64,")) {
                    encodedImageOn = encodedImageOn.replaceFirst("data:image/png;base64,", "");
                }
                byte[] decodedStringOn = Base64.decode(encodedImageOn, Base64.DEFAULT);
                Bitmap decodedByteOn = BitmapFactory.decodeByteArray(decodedStringOn, 0, decodedStringOn.length);
                Drawable flashlightButtonImageDrawableOn = new BitmapDrawable(cordova.getActivity().getResources(), decodedByteOn);
                String encodedImageOff = data.getString(1);
                if (encodedImageOff.contains("data:image/png;base64,")) {
                    encodedImageOff = encodedImageOff.replaceFirst("data:image/png;base64,", "");
                }
                byte[] decodedStringOff = Base64.decode(encodedImageOff, Base64.DEFAULT);
                Bitmap decodedByteOff = BitmapFactory.decodeByteArray(decodedStringOff, 0, decodedStringOff.length);
                Drawable flashlightButtonImageDrawableOff = new BitmapDrawable(cordova.getActivity().getResources(), decodedByteOff);
                acuantAndroidMobileSDKController.setFlashlightImageDrawable(flashlightButtonImageDrawableOn, flashlightButtonImageDrawableOff);
                break;
            case showFacialInterface:
                methodId = "showFacialInterface";
                callbackId = callbackContext;
                acuantAndroidMobileSDKController.setFacialListener(this);
                Paint subInstPaint = null;
                if (facialSubInstHexColor != null) {
                    subInstPaint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.DITHER_FLAG);
                    Typeface currentTypeFace = subInstPaint.getTypeface();
                    Typeface bold = Typeface.create(currentTypeFace, Typeface.BOLD);
                    subInstPaint.setColor(Color.parseColor(facialSubInstHexColor));
                    subInstPaint.setTextSize(30);
                    subInstPaint.setTextAlign(Paint.Align.LEFT);
                    subInstPaint.setTypeface(bold);
                }
                if (facialInstrunctionText != null) {
                    Paint InstPaint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.DITHER_FLAG);
                    Typeface currentTypeFace = InstPaint.getTypeface();
                    Typeface bold = Typeface.create(currentTypeFace, Typeface.BOLD);
                    InstPaint.setColor(Color.parseColor(facialInstructionTextFontColor));
                    InstPaint.setTextSize(facialInstructionTextFontSize);
                    InstPaint.setTextAlign(Paint.Align.LEFT);
                    InstPaint.setTypeface(bold);
                    acuantAndroidMobileSDKController.setInstructionText(facialInstrunctionText, facialInstructionLeft, facialInstructionTop, InstPaint);
                }
                acuantAndroidMobileSDKController.setSubInstructionText(facialSubInstructionString, facialSubInstLeft, facialSubInstTop, subInstPaint);
                acuantAndroidMobileSDKController.showManualFacialCameraInterface(cordova.getActivity());
                break;
            case setFacialInstructionText:
                methodId = "setFacialInstructionText";
                callbackId = callbackContext;
                String facialInstruction = data.getString(0);
                if (facialInstruction != null) {
                    facialInstrunctionText = facialInstruction;
                }
                break;
            case setFacialInstructionLocation:
                methodId = "setFacialInstructionLocation";
                callbackId = callbackContext;
                facialInstructionLeft = data.getInt(0);
                facialInstructionTop = data.getInt(1);
                
                break;
            case setFacialInstructionTextStyle:
                methodId = "setFacialInstructionTextStyle";
                callbackId = callbackContext;
                facialInstructionTextFontColor = data.getString(0);
                facialInstructionTextFontSize = data.getInt(1);
                break;
            case setFacialRecognitionTimeout:
                methodId = "setFacialRecognitionTimeout";
                callbackId = callbackContext;
                facialTimeOut = data.getInt(0);
                acuantAndroidMobileSDKController.setFacialRecognitionTimeoutInSeconds(facialTimeOut);
                break;
            case processFacialImageValidation:
                methodId = "processFacialImageValidation";
                callbackId = callbackContext;
                callbackIdFacialProcess = callbackContext;
                cardType = CardType.FACIAL_RECOGNITION;
                String selfieImageEcodedString = data.getString(0);
                byte[] selfieImageDecodedString = Base64.decode(selfieImageEcodedString, Base64.DEFAULT);
                Bitmap selfieImageDecodedByte = BitmapFactory.decodeByteArray(selfieImageDecodedString, 0, selfieImageDecodedString.length);
                
                String faceImageEcodedString = data.getString(1);
                byte[] faceImageDecodedString = Base64.decode(faceImageEcodedString, Base64.DEFAULT);
                Bitmap faceImageDecodedByte = BitmapFactory.decodeByteArray(faceImageDecodedString, 0, faceImageDecodedString.length);
                
                
                ProcessImageRequestOptions facialOptions = ProcessImageRequestOptions.getInstance();
                facialOptions.logTransaction = data.getBoolean(2);
                
                facialOptions.acuantCardType = CardType.FACIAL_RECOGNITION;
                acuantAndroidMobileSDKController.callProcessImageServices(selfieImageDecodedByte, faceImageDecodedByte, null, cordova.getActivity(), facialOptions);
                break;
            case setFacialSubInstructionString:
                methodId = "setFacialSubInstructionString";
                callbackId = callbackContext;
                facialSubInstructionString = data.getString(0);
                break;
            case setFacialSubInstructionColor:
                methodId = "setFacialSubInstructionColor";
                callbackId = callbackContext;
                facialSubInstHexColor = data.getString(0);
                break;
            case setFacialSubInstructionLocation:
                methodId = "setFacialSubInstructionLocation";
                callbackId = callbackContext;
                facialSubInstLeft = data.getInt(0);
                facialSubInstTop = data.getInt(1);
                break;
                
            case scanEChip:
                methodId = "scanEChip";
                if (nfcAdapter == null) {
                    nfcAdapter = NfcAdapter.getDefaultAdapter(cordova.getActivity());
                }
                
                if (nfcAdapter == null) {
                    JSONObject errorObj = new JSONObject();
                    errorObj.put("id", "nfcError");
                    errorObj.put("errorMessage", "NFC is not available for this device");
                    errorObj.put("errorType", ErrorType.AcuantErrorUnknown);
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, errorObj);
                    pluginResult.setKeepCallback(true);
                    callbackId.sendPluginResult(pluginResult);
                } else if (this.nfcAdapter != null && !this.nfcAdapter.isEnabled()) {
                    JSONObject errorObj = new JSONObject();
                    errorObj.put("id", "nfcError");
                    errorObj.put("errorType", ErrorType.AcuantErrorUnknown);
                    errorObj.put("errorMessage", "In order to use scan eChip, the NFC sensor must be turned on.");
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, errorObj);
                    pluginResult.setKeepCallback(true);
                    callbackId.sendPluginResult(pluginResult);
                } else {
                    acuantAndroidMobileSDKController.listenNFC(cordova.getActivity(), nfcAdapter);
                    JSONObject errorObj = new JSONObject();
                    errorObj.put("id", "nfcReady");
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, errorObj);
                    pluginResult.setKeepCallback(true);
                    callbackId.sendPluginResult(pluginResult);
                }
                break;
                
            case readEChip:
                methodId = "readEChip";
                if (nfcAdapter == null) {
                    JSONObject errorObj = new JSONObject();
                    errorObj.put("id", "nfcError");
                    errorObj.put("errorMessage", "NFC is not available for this device");
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, errorObj);
                    pluginResult.setKeepCallback(true);
                    callbackId.sendPluginResult(pluginResult);
                } else if (this.nfcAdapter != null && !this.nfcAdapter.isEnabled()) {
                    JSONObject errorObj = new JSONObject();
                    errorObj.put("id", "nfcError");
                    errorObj.put("errorMessage", "In order to use scan eChip, the NFC sensor must be turned on.");
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, errorObj);
                    pluginResult.setKeepCallback(true);
                    callbackId.sendPluginResult(pluginResult);
                } else {
                    nfcIntent.setAction("android.nfc.action.TECH_DISCOVERED");
                    Intent intent = nfcIntent;
                    echip_docNumber = data.getString(1);
                    echip_dateOfBirth = data.getString(2);
                    echip_dateOfExpiry = data.getString(3);
                    acuantAndroidMobileSDKController.setAcuantTagReadingListener(this);
                    acuantAndroidMobileSDKController.readNFCTag(intent, echip_docNumber, echip_dateOfBirth, echip_dateOfExpiry);
                }
                break;
            case isSDKValidated:
                try {
                    obj.put("id", "isSDKValidated");
                    obj.put("data", sdkValidated);
                    PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            default:
                callbackId = callbackContext;
                try {
                    obj.put("id", "default");
                    obj.put("error", "No " + action + " Method");
                    PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                return false;
        }
        return true;
    }
    
    @Override
    public void onFacialRecognitionTimedOut(final Bitmap bitmap) {
        
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", "onFacialRecognitionTimedOut");
            if (bitmap != null) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream.toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                obj.put("selfieImageData", encoded);
            }
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj);
            pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(pluginResult);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        
    }
    
    @Override
    public void onFacialRecognitionCompleted(final Bitmap bitmap) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", "onFacialRecognitionCompleted");
            if (bitmap != null) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream.toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                obj.put("selfieImageData", encoded);
            }
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj);
            pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(pluginResult);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void onFacialRecognitionCanceled() {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", "onFacialRecognitionCanceled");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj);
            pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(pluginResult);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    
    
    @Override
    public void onCancelCapture(Bitmap croppedImage, HashMap<String, Object> imageMetrics, Bitmap originalImage) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", "didCancelToCaptureData");
            if (croppedImage != null) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                croppedImage.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream.toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                obj.put("croppedImageData", encoded);
            }
            if (originalImage != null) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                originalImage.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream.toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                obj.put("originalImageData", encoded);
            }
            if (imageMetrics != null && imageMetrics.get("HAS_GLARE") != null) {
                boolean hasGlare = Boolean.parseBoolean(imageMetrics.get("HAS_GLARE").toString());
                obj.put("HAS_GLARE", hasGlare);
            }
            if (imageMetrics != null && imageMetrics.get("GLARE_GRADE") != null) {
                float glareGrade = Float.parseFloat(imageMetrics.get("GLARE_GRADE").toString());
                obj.put("GLARE_GRADE", glareGrade);
            }
            
            if (imageMetrics != null && imageMetrics.get("IS_SHARP") != null) {
                boolean isSHarp = Boolean.parseBoolean(imageMetrics.get("IS_SHARP").toString());
                obj.put("IS_SHARP", isSHarp);
            }
            if (imageMetrics != null && imageMetrics.get("SHARPNESS_GRADE") != null) {
                float sharpnessGrade = Float.parseFloat(imageMetrics.get("SHARPNESS_GRADE").toString());
                obj.put("SHARPNESS_GRADE", sharpnessGrade);
            }
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj);
            pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(pluginResult);
        }catch(JSONException e){
            e.printStackTrace();
        }
        
    }
    
    @Override
    public void didFailWithError(int code, String message) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", "didFailWithError");
            obj.put("data", false);
            obj.put("errorType", code);
            obj.put("errorMessage", message);
            PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
            result.setKeepCallback(true);
            callbackId.sendPluginResult(result);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void processImageServiceCompleted(final Card card) {
        final Handler handler = new Handler(Looper.getMainLooper());
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject obj = new JSONObject();
                    if (card == null || card.isEmpty()) {
                        obj.put("id", "didFailWithError");
                        obj.put("errorType", ErrorType.AcuantErrorUnableToProcess);
                        obj.put("errorMessage", "No data found for this license card!");
                        sendCardData(PluginResult.Status.INVALID_ACTION, obj, handler);
                    } else {
                        obj.put("id", "didFinishProcessingCardWithResult");
                        switch (cardType) {
                            case CardType.DRIVERS_LICENSE:
                                callbackId = callbackIdImageProcess;
                                DriversLicenseCard driversLicenseCard = (DriversLicenseCard) card;
                                obj.put("data", DLCardWithCard(driversLicenseCard));
                                sendCardData(PluginResult.Status.OK, obj, handler);
                                break;
                            case CardType.MEDICAL_INSURANCE:
                                callbackId = callbackIdImageProcess;
                                MedicalCard medicalCard = (MedicalCard) card;
                                obj.put("data", MICardWithCard(medicalCard));
                                sendCardData(PluginResult.Status.OK, obj, handler);
                                break;
                            case CardType.PASSPORT:
                                callbackId = callbackIdImageProcess;
                                PassportCard passportCard = (PassportCard) card;
                                obj.put("data", PCardWithCard(passportCard));
                                sendCardData(PluginResult.Status.OK, obj, handler);
                                break;
                            case CardType.FACIAL_RECOGNITION:
                                callbackId = callbackIdFacialProcess;
                                FacialData facialData = (FacialData) card;
                                obj.put("id", "didFinishProcessingFacialMatchWithResult");
                                obj.put("data", FacialDataWithCard(facialData));
                                sendCardData(PluginResult.Status.OK, obj, handler);
                                break;
                            default:
                                throw new IllegalStateException("There is not implementation for processing the card type");
                        }
                    }
                } catch (Exception e) {
                    try {
                        JSONObject obj = new JSONObject();
                        obj.put("id", "didFailWithError");
                        obj.put("ErrorType", ErrorType.AcuantErrorUnknown);
                        obj.put("errorMessage", "Sorry! Internal error has occurred, please contact us!");
                        sendCardData(PluginResult.Status.INVALID_ACTION, obj, handler);
                    } catch (JSONException ex) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }
    
    private void sendCardData(final PluginResult.Status statusCallback, final JSONObject objCallback, Handler handler) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                PluginResult resultCallback = new PluginResult(statusCallback, objCallback);
                resultCallback.setKeepCallback(true);
                callbackId.sendPluginResult(resultCallback);
            }
        });
    }
    
    @Override
    public void validateLicenseKeyCompleted(LicenseDetails details) {
        JSONObject obj = new JSONObject();
        try {
            if (details != null && details.isLicenseKeyActivated()) {
                sdkValidated = true;
                obj.put("id", "mobileSDKWasValidated");
                obj.put("data", true);
                obj.put("message", details.getWebResponseDescription());
                obj.put("isAssureIDAllowed", details.isAssureIDAllowed());
                obj.put("isFacialAllowed", details.isFacialAllowed());
                PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                result.setKeepCallback(true);
                callbackId.sendPluginResult(result);
            } else {
                sdkValidated = false;
                obj.put("id", "didFailWithError");
                obj.put("data", false);
                obj.put("errorType", ErrorType.AcuantErrorInvalidLicenseKey);
                obj.put("errorMessage", details.getResponseMessageAuthorization());
                PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
                result.setKeepCallback(true);
                callbackId.sendPluginResult(result);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void onCardImageCaptured() {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("id", "onCardImageCaptured");
                    PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    @Override
    public void onCardCroppingStart(Activity activity) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("id", "didCardCroppingStart");
                    PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    @Override
    public void onCardCroppingFinish(final Bitmap bitmap,int detectedType,final HashMap<String,Object>imageMetrics) {
        
        if (bitmap != null){
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        JSONObject obj=new JSONObject();
                        obj.put("id", "didCaptureCropImage");
                        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                        byte[] byteArray = byteArrayOutputStream.toByteArray();
                        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                        obj.put("data", encoded);
                        
                        if(imageMetrics!=null && imageMetrics.get("HAS_GLARE")!=null) {
                            boolean hasGlare = Boolean.parseBoolean(imageMetrics.get("HAS_GLARE").toString());
                            obj.put("HAS_GLARE", hasGlare);
                        }
                        if(imageMetrics!=null && imageMetrics.get("GLARE_GRADE")!=null) {
                            float glareGrade = Float.parseFloat(imageMetrics.get("GLARE_GRADE").toString());
                            obj.put("GLARE_GRADE", glareGrade);
                        }
                        
                        if(imageMetrics!=null && imageMetrics.get("IS_SHARP")!=null){
                            boolean isSHarp = Boolean.parseBoolean(imageMetrics.get("IS_SHARP").toString());
                            obj.put("IS_SHARP", isSHarp);
                        }
                        if(imageMetrics!=null && imageMetrics.get("SHARPNESS_GRADE")!=null){
                            float sharpnessGrade = Float.parseFloat(imageMetrics.get("SHARPNESS_GRADE").toString());
                            obj.put("SHARPNESS_GRADE", sharpnessGrade);
                        }
                        PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                        result.setKeepCallback(true);
                        callbackId.sendPluginResult(result);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }else {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        JSONObject obj=new JSONObject();
                        obj.put("id", "didFailWithError");
                        obj.put("errorType", 8);
                        obj.put("errorMessage", "Unable to detect the card. Please try again.");
                        PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
                        result.setKeepCallback(true);
                        callbackId.sendPluginResult(result);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
        
    }
    
    @Override
    public void onCardCroppingFinish(final Bitmap bitmap, final boolean scanBackSide,int detectedType,final HashMap<String,Object>imageMetrics) {
        if (bitmap != null){
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        JSONObject obj=new JSONObject();
                        if ((cardRegion == 0 || cardRegion == 1) && isBarcodeSide) {
                            obj.put("id", "cropBarcode");
                        }else{
                            obj.put("id", "didCaptureCropImage");
                        }
                        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                        byte[] byteArray = byteArrayOutputStream.toByteArray();
                        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                        obj.put("data", encoded);
                        obj.put("scanBackSide", scanBackSide);
                        if(imageMetrics!=null && imageMetrics.get("HAS_GLARE")!=null) {
                            boolean hasGlare = Boolean.parseBoolean(imageMetrics.get("HAS_GLARE").toString());
                            obj.put("HAS_GLARE", hasGlare);
                        }
                        if(imageMetrics!=null && imageMetrics.get("GLARE_GRADE")!=null) {
                            float glareGrade = Float.parseFloat(imageMetrics.get("GLARE_GRADE").toString());
                            obj.put("GLARE_GRADE", glareGrade);
                        }
                        
                        if(imageMetrics!=null && imageMetrics.get("IS_SHARP")!=null){
                            boolean isSHarp = Boolean.parseBoolean(imageMetrics.get("IS_SHARP").toString());
                            obj.put("IS_SHARP", isSHarp);
                        }
                        if(imageMetrics!=null && imageMetrics.get("SHARPNESS_GRADE")!=null){
                            float sharpnessGrade = Float.parseFloat(imageMetrics.get("SHARPNESS_GRADE").toString());
                            obj.put("SHARPNESS_GRADE", sharpnessGrade);
                        }
                        PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                        result.setKeepCallback(true);
                        callbackId.sendPluginResult(result);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }else {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        JSONObject obj=new JSONObject();
                        obj.put("id", "didFailWithError");
                        obj.put("errorType", 8);
                        obj.put("errorMessage", "Unable to detect the card. Please try again.");
                        PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
                        result.setKeepCallback(true);
                        callbackId.sendPluginResult(result);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
            
            
        }
        
    }
    
    @Override
    public void onOriginalCapture(final Bitmap bitmap) {
        if (bitmap != null) {
            
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        JSONObject obj = new JSONObject();
                        obj.put("id", "didCaptureOriginalImage");
                        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                        byte[] byteArray = byteArrayOutputStream.toByteArray();
                        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                        obj.put("data", encoded);
                        PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                        result.setKeepCallback(true);
                        callbackId.sendPluginResult(result);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
            
        } else {
            
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        JSONObject obj = new JSONObject();
                        obj.put("id", "didFailWithError");
                        obj.put("errorType", 8);
                        obj.put("errorMessage", "Unable to detect the card. Please try again.");
                        obj.put("ErrorInMethod", "onOriginalCapture");
                        PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
                        result.setKeepCallback(true);
                        callbackId.sendPluginResult(result);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
            
        }
        
    }
    
    @Override
    public void onPDF417Finish(String result) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", "didCaptureData");
            obj.put("data", result);
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj);
            pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(pluginResult);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void onBarcodeTimeOut(Bitmap croppedImage,HashMap<String,Object>imageMetrics,Bitmap originalImage) {
        JSONObject obj=new JSONObject();
        try {
            obj.put("id", "barcodeScanTimeOut");
            
            if(croppedImage!=null) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                croppedImage.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream.toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                obj.put("croppedData",encoded);
            }
            if(originalImage!=null) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                originalImage.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream.toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                obj.put("originalData",encoded);
            }
            
            if(imageMetrics!=null && imageMetrics.get("HAS_GLARE")!=null) {
                boolean hasGlare = Boolean.parseBoolean(imageMetrics.get("HAS_GLARE").toString());
                obj.put("HAS_GLARE", hasGlare);
            }
            if(imageMetrics!=null && imageMetrics.get("GLARE_GRADE")!=null) {
                float glareGrade = Float.parseFloat(imageMetrics.get("GLARE_GRADE").toString());
                obj.put("GLARE_GRADE", glareGrade);
            }
            
            if(imageMetrics!=null && imageMetrics.get("IS_SHARP")!=null){
                boolean isSHarp = Boolean.parseBoolean(imageMetrics.get("IS_SHARP").toString());
                obj.put("IS_SHARP", isSHarp);
            }
            if(imageMetrics!=null && imageMetrics.get("SHARPNESS_GRADE")!=null){
                float sharpnessGrade = Float.parseFloat(imageMetrics.get("SHARPNESS_GRADE").toString());
                obj.put("SHARPNESS_GRADE", sharpnessGrade);
            }
            
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj);
            pluginResult.setKeepCallback(true);
            callbackId.sendPluginResult(pluginResult);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * @param sResult json string
     * @return a JSON's object from the sResult
     */
    private static JSONObject DLCardWithCard(DriversLicenseCard sResult) {
        
        try {
            JSONObject dlCard = new JSONObject();
            dlCard.put("licenceId", sResult.getLicenceID());
            dlCard.put("address", sResult.getAddress());
            dlCard.put("city", sResult.getCity());
            dlCard.put("zip", sResult.getZip());
            dlCard.put("state", sResult.getState());
            dlCard.put("idCountry", sResult.getIdCountry());
            dlCard.put("eyeColor", sResult.getEyeColor());
            dlCard.put("hairColor", sResult.getHair());
            dlCard.put("height", sResult.getHeight());
            dlCard.put("weight", sResult.getWeight());
            dlCard.put("licenceClass", sResult.getLicenceClass());
            dlCard.put("restriction", sResult.getRestriction());
            dlCard.put("sex", sResult.getSex());
            dlCard.put("dateOfBirth4", sResult.getDateOfBirth4());
            dlCard.put("issueDate4", sResult.getIssueDate4());
            dlCard.put("expirationDate4", sResult.getExpirationDate4());
            dlCard.put("address2", sResult.getAddress2());
            dlCard.put("address3", sResult.getAddress3());
            dlCard.put("address4", sResult.getAddress4());
            dlCard.put("address5", sResult.getAddress5());
            dlCard.put("address6", sResult.getAddress6());
            dlCard.put("audit", sResult.getAudit());
            dlCard.put("CSC", sResult.getCSC());
            dlCard.put("countryShort", sResult.getCountryShort());
            dlCard.put("county", sResult.getCounty());
            dlCard.put("dateOfBirth", sResult.getDateOfBirth());
            dlCard.put("dateOfBirthLocal", sResult.getDateOfBirthLocal());
            dlCard.put("docType", sResult.getDocType());
            dlCard.put("endorsements", sResult.getEndorsements());
            dlCard.put("expirationDate", sResult.getExpirationDate());
            dlCard.put("fatherName", sResult.getFatherName());
            dlCard.put("fee", sResult.getFee());
            dlCard.put("issueDate", sResult.getIssueDate());
            dlCard.put("issueDateLocal", sResult.getIssueDateLocal());
            dlCard.put("motherName", sResult.getMotherName());
            dlCard.put("nameLast", sResult.getNameLast());
            dlCard.put("nameLast1", sResult.getNameLast1());
            dlCard.put("nameLast2", sResult.getNameLast2());
            dlCard.put("nameMiddle", sResult.getNameMiddle());
            dlCard.put("nameSuffix", sResult.getNameSuffix());
            dlCard.put("nationality", sResult.getNationality());
            dlCard.put("original", sResult.getOriginal());
            dlCard.put("placeOfBirth", sResult.getPlaceOfBirth());
            dlCard.put("placeOfIssue", sResult.getPlaceOfIssue());
            dlCard.put("results2D", sResult.getResults2D());
            dlCard.put("sigNum", sResult.getSigNum());
            dlCard.put("socialSecurity", sResult.getSocialSecurity());
            dlCard.put("text1", sResult.getText1());
            dlCard.put("text2", sResult.getText2());
            dlCard.put("text3", sResult.getText3());
            dlCard.put("type", sResult.getType());
            dlCard.put("license", sResult.getLicense());
            dlCard.put("nameFirst", sResult.getNameFirst());
            dlCard.put("nameFirst_NonMRZ", sResult.getNameFirst_NonMRZ());
            dlCard.put("nameLast_NonMRZ", sResult.getNameLast_NonMRZ());
            dlCard.put("nameMiddle_NonMRZ", sResult.getNameMiddle_NonMRZ());
            dlCard.put("nameSuffix_NonMRZ", sResult.getNameSuffix_NonMRZ());
            dlCard.put("documentDetectedName", sResult.getDocumentDetectedName());
            dlCard.put("documentDetectedNameShort", sResult.getDocumentDetectedNameShort());
            dlCard.put("templateType", sResult.getTemplateType());
            try {
                dlCard.put("isBarcodeRead", sResult.getIsBarcodeRead());
            } catch (NullPointerException e) {
                dlCard.put("isBarcodeRead", false);
            }
            try {
                dlCard.put("isIDVerified", sResult.getIsIDVerified());
            } catch (NullPointerException e) {
                dlCard.put("isIDVerified", false);
            }
            try {
                dlCard.put("isOcrRead", sResult.getIsOcrRead());
            } catch (NullPointerException e) {
                dlCard.put("isOcrRead", false);
            }
            dlCard.put("authenticationResult", sResult.getAuthenticationResult());
            dlCard.put("authenticationObject", sResult.getAuthenticationObject());
            ArrayList<String> authResultList = new ArrayList<String>();
            authResultList = sResult.getAuthenticationResultSummaryList();
            String authResults = "";
            int count = 0;
            if (authResultList != null && authResultList.size() > 0) {
                for (String result : authResultList) {
                    if (count == 0) {
                        authResults = result;
                    } else {
                        authResults = authResults + "," + result;
                    }
                    count++;
                }
            }
            dlCard.put("authenticationResultSummaryList", authResults);
            dlCard.put("idLocationCityTestResult", sResult.idLocationCityTestResult);
            dlCard.put("idLocationCountryTestResult", sResult.idLocationCountryTestResult);
            dlCard.put("idLocationStateTestResult", sResult.idLocationStateTestResult);
            dlCard.put("idLocationZipcodeTestResult", sResult.idLocationZipcodeTestResult);
            dlCard.put("documentVerificationRating", sResult.getDocumentVerificationConfidenceRating());
            dlCard.put("isAddressCorrected", sResult.isAddressCorrected());
            dlCard.put("isAddressVerified", sResult.isAddressVerified());
            
            dlCard.put("DeviceCity", sdkController.getDeviceCity());
            dlCard.put("DeviceArea", sdkController.getDeviceArea());
            dlCard.put("DeviceState", sdkController.getDeviceState());
            dlCard.put("DeviceCountry", sdkController.getDeviceCountryName());
            dlCard.put("DeviceCountryCode", sdkController.getDeviceCountryCode());
            dlCard.put("DeviceZipcode", sdkController.getDeviceZipCode());
            dlCard.put("DeviceStreetAddress", sdkController.getDeviceAddress());
            
            
            Bitmap faceImageBitmap = sResult.getFaceImage();
            if (faceImageBitmap != null) {
                ByteArrayOutputStream faceImageByteArrayOutputStream = new ByteArrayOutputStream();
                faceImageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, faceImageByteArrayOutputStream);
                byte[] faceImageByte = faceImageByteArrayOutputStream.toByteArray();
                dlCard.put("faceImage", Base64.encodeToString(faceImageByte, Base64.DEFAULT));
            }
            Bitmap signImageBitmap = sResult.getSignImage();
            if (signImageBitmap != null) {
                ByteArrayOutputStream signImageByteArrayOutputStream = new ByteArrayOutputStream();
                signImageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, signImageByteArrayOutputStream);
                byte[] signImageByte = signImageByteArrayOutputStream.toByteArray();
                dlCard.put("signatureImage", Base64.encodeToString(signImageByte, Base64.DEFAULT));
            }
            Bitmap reformatImageBitmap = sResult.getReformatImage();
            if (reformatImageBitmap != null) {
                ByteArrayOutputStream reformatImageByteArrayOutputStream = new ByteArrayOutputStream();
                reformatImageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, reformatImageByteArrayOutputStream);
                byte[] reformatImageByte = reformatImageByteArrayOutputStream.toByteArray();
                dlCard.put("licenceImage", Base64.encodeToString(reformatImageByte, Base64.DEFAULT));
            }
            Bitmap reformatImageTwoBitmap = sResult.getReformatImageTwo();
            if (reformatImageTwoBitmap != null) {
                ByteArrayOutputStream reformatImageTwoByteArrayOutputStream = new ByteArrayOutputStream();
                reformatImageTwoBitmap.compress(Bitmap.CompressFormat.JPEG, 100, reformatImageTwoByteArrayOutputStream);
                byte[] reformatImageTwoByte = reformatImageTwoByteArrayOutputStream.toByteArray();
                dlCard.put("licenceImageTwo", Base64.encodeToString(reformatImageTwoByte, Base64.DEFAULT));
            }
            return dlCard;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * @param sResult json string
     * @return a JSON's object from the sResult
     */
    private static JSONObject MICardWithCard(MedicalCard sResult) {
        try {
            JSONObject miCard = new JSONObject();
            miCard.put("copayEr", sResult.getCopayEr());
            miCard.put("copayOv", sResult.getCopayOv());
            miCard.put("copaySp", sResult.getCopaySp());
            miCard.put("copayUc", sResult.getCopayUc());
            miCard.put("coverage", sResult.getCoverage());
            miCard.put("contractCode", sResult.getContractCode());
            miCard.put("dateOfBirth", sResult.getDateOfBirth());
            miCard.put("deductible", sResult.getDeductible());
            miCard.put("effectiveDate", sResult.getEffectiveDate());
            miCard.put("employer", sResult.getEmployer());
            miCard.put("expirationDate", sResult.getExpirationDate());
            miCard.put("firstName", sResult.getFirstName());
            miCard.put("groupName", sResult.getGroupName());
            miCard.put("groupNumber", sResult.getGroupNumber());
            miCard.put("issuerNumber", sResult.getIssuerNumber());
            miCard.put("lastName", sResult.getLastName());
            miCard.put("memberId", sResult.getMemberId());
            miCard.put("memberName", sResult.getMemberName());
            miCard.put("middleName", sResult.getMiddlename());
            miCard.put("namePrefix", sResult.getNamePrefix());
            miCard.put("nameSuffix", sResult.getNameSuffix());
            miCard.put("other", sResult.getOther());
            miCard.put("payerId", sResult.getPayerId());
            miCard.put("planAdmin", sResult.getPlanAdmin());
            miCard.put("planProvider", sResult.getPlanProvider());
            miCard.put("planType", sResult.getPlanType());
            miCard.put("rxBin", sResult.getRxBin());
            miCard.put("rxGroup", sResult.getRxGroup());
            miCard.put("rxId", sResult.getRxId());
            miCard.put("rxPcn", sResult.getRxPcn());
            miCard.put("fullAddress", sResult.getFullAddress());
            miCard.put("state", sResult.getState());
            miCard.put("street", sResult.getStreet());
            miCard.put("zip", sResult.getZip());
            miCard.put("city", sResult.getCity());
            miCard.put("planCode", sResult.getPlanCode());
            miCard.put("phoneNumber", sResult.getPhoneNumber());
            miCard.put("email", sResult.getEmail());
            miCard.put("webAddress", sResult.getWebAddress());
            
            Bitmap reformatImageBitmap = sResult.getReformattedImage();
            if (reformatImageBitmap != null) {
                ByteArrayOutputStream reformatImageByteArrayOutputStream = new ByteArrayOutputStream();
                reformatImageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, reformatImageByteArrayOutputStream);
                byte[] reformatImageByte = reformatImageByteArrayOutputStream.toByteArray();
                miCard.put("reformattedImage", Base64.encodeToString(reformatImageByte, Base64.DEFAULT));
            }
            Bitmap reformatImageTwoBitmap = sResult.getReformattedImageTwo();
            if (reformatImageTwoBitmap != null) {
                ByteArrayOutputStream reformatImageTwoByteArrayOutputStream = new ByteArrayOutputStream();
                reformatImageTwoBitmap.compress(Bitmap.CompressFormat.JPEG, 100, reformatImageTwoByteArrayOutputStream);
                byte[] reformatImageTwoByte = reformatImageTwoByteArrayOutputStream.toByteArray();
                miCard.put("reformattedImageTwo", Base64.encodeToString(reformatImageTwoByte, Base64.DEFAULT));
            }
            return miCard;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * @param sResult json string
     * @return a JSON's object from the sResult
     */
    private static JSONObject PCardWithCard(PassportCard sResult) {
        try {
            JSONObject pCard = new JSONObject();
            pCard.put("address", sResult.getAddress2());
            pCard.put("address2", sResult.getAddress3());
            pCard.put("country", sResult.getCountry());
            pCard.put("countryLong", sResult.getCountryLong());
            pCard.put("dateOfBrth", sResult.getDateOfBirth());
            pCard.put("dateOfBirth4", sResult.getDateOfBirth4());
            pCard.put("end_POB", sResult.getEnd_POB());
            pCard.put("expirationDate", sResult.getExpirationDate());
            pCard.put("expirationDate4", sResult.getExpirationDate4());
            pCard.put("issueDate", sResult.getIssueDate());
            pCard.put("issueDate4", sResult.getIssueDate4());
            pCard.put("nameFirst", sResult.getNameFirst());
            pCard.put("nameFirst_NonMRZ", sResult.getNameFirst_NonMRZ());
            pCard.put("nameLast", sResult.getNameLast());
            pCard.put("nameLast_NonMRZ", sResult.getNameLast_NonMRZ());
            pCard.put("nameMiddle", sResult.getNameMiddle());
            pCard.put("nationality", sResult.getNationality());
            pCard.put("nationalityLong", sResult.getNationalityLong());
            pCard.put("passportNumber", sResult.getPassportNumber());
            pCard.put("personalNumber", sResult.getPersonalNumber());
            pCard.put("sex", sResult.getSex());
            pCard.put("authenticationResult", sResult.getAuthenticationResult());
            pCard.put("authenticationObject", sResult.getAuthenticationObject());
            ArrayList<String> authResultList = new ArrayList<String>();
            authResultList = sResult.getAuthenticationResultSummaryList();
            String authResults = "";
            int count = 0;
            if (authResultList != null && authResultList.size() > 0) {
                for (String result : authResultList) {
                    if (count == 0) {
                        authResults = result;
                    } else {
                        authResults = authResults + "," + result;
                    }
                    count++;
                }
            }
            pCard.put("authenticationResultSummaryList", authResults);
            pCard.put("idLocationCityTestResult", sResult.idLocationCityTestResult);
            pCard.put("idLocationCountryTestResult", sResult.idLocationCountryTestResult);
            pCard.put("idLocationStateTestResult", sResult.idLocationStateTestResult);
            pCard.put("idLocationZipcodeTestResult", sResult.idLocationZipcodeTestResult);
            
            pCard.put("DeviceCity", sdkController.getDeviceCity());
            pCard.put("DeviceArea", sdkController.getDeviceArea());
            pCard.put("DeviceState", sdkController.getDeviceState());
            pCard.put("DeviceCountry", sdkController.getDeviceCountryName());
            pCard.put("DeviceCountryCode", sdkController.getDeviceCountryCode());
            pCard.put("DeviceZipcode", sdkController.getDeviceZipCode());
            pCard.put("DeviceStreetAddress", sdkController.getDeviceAddress());
            
            
            Bitmap faceImageBitmap = sResult.getFaceImage();
            if (faceImageBitmap != null) {
                ByteArrayOutputStream faceImageByteArrayOutputStream = new ByteArrayOutputStream();
                faceImageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, faceImageByteArrayOutputStream);
                byte[] faceImageByte = faceImageByteArrayOutputStream.toByteArray();
                pCard.put("faceImage", Base64.encodeToString(faceImageByte, Base64.DEFAULT));
            }
            Bitmap signImageBitmap = sResult.getSignImage();
            if (signImageBitmap != null) {
                ByteArrayOutputStream signImageByteArrayOutputStream = new ByteArrayOutputStream();
                signImageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, signImageByteArrayOutputStream);
                byte[] signImageByte = signImageByteArrayOutputStream.toByteArray();
                pCard.put("signImage", Base64.encodeToString(signImageByte, Base64.DEFAULT));
            }
            Bitmap reformatImageBitmap = sResult.getReformattedImage();
            if (reformatImageBitmap != null) {
                ByteArrayOutputStream reformatImageByteArrayOutputStream = new ByteArrayOutputStream();
                reformatImageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, reformatImageByteArrayOutputStream);
                byte[] reformatImageByte = reformatImageByteArrayOutputStream.toByteArray();
                pCard.put("passportImage", Base64.encodeToString(reformatImageByte, Base64.DEFAULT));
            }
            return pCard;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    private static JSONObject FacialDataWithCard(FacialData sResult) {
        try {
            JSONObject facialData = new JSONObject();
            facialData.put("FaceLivelinessDetection", sResult.faceLivelinessDetection);
            facialData.put("FacialMatch", sResult.facialMatch);
            facialData.put("FacialMatchConfidenceRating", sResult.facialMatchConfidenceRating);
            facialData.put("TransactionId", sResult.transactionId);
            return facialData;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    private static JSONObject EChipDataWithCard(AcuantNFCCardDetails cardDetails) {
        try {
            JSONObject nfcData = new JSONObject();
            nfcData.put("PrimaryIdentifier", cardDetails.getPrimaryIdentifier());
            nfcData.put("SecondaryIdentifier", cardDetails.getSecondaryIdentifier());
            nfcData.put("Gender", cardDetails.getGender());
            nfcData.put("DateOfBirth", cardDetails.getDateOfBirth());
            nfcData.put("Nationality", cardDetails.getNationality());
            nfcData.put("DateOfExpiry", cardDetails.getDateOfExpiry());
            nfcData.put("DocumentCode", cardDetails.getDocumentCode());
            nfcData.put("DocumentType", cardDetails.getDocumentType());
            nfcData.put("IssuingState", cardDetails.getIssuingState());
            nfcData.put("DocumentNumber", cardDetails.getDocumentNumber());
            nfcData.put("PersonalNumber", cardDetails.getPersonalNumber());
            nfcData.put("OptionalData1", cardDetails.getOptionalData1());
            nfcData.put("OptionalData2", cardDetails.getOptionalData2());
            nfcData.put("SupportedAuths", cardDetails.supportedMethodsString());
            nfcData.put("UnsupportedAuths", cardDetails.notSupportedMethodsString());
            nfcData.put("DocumentSignerValidity", cardDetails.getDocSignerValidity());
            nfcData.put("BACAuthenticated", cardDetails.bacAunthenticated);
            nfcData.put("AuthenticDataGroupHashes", cardDetails.authenticDataGroupHashes);
            nfcData.put("AuthenticDocSignature", cardDetails.authenticDocSignature);
            nfcData.put("AAAuthenticated", cardDetails.aaAunthenticated);
            return nfcData;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    @Override
    public void tagReadSucceeded(final AcuantNFCCardDetails cardDetails, final Bitmap face_image, final Bitmap sign_image) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("id", "tagReadSucceeded");
                    if (face_image != null) {
                        ByteArrayOutputStream faceImageByteArrayOutputStream = new ByteArrayOutputStream();
                        face_image.compress(Bitmap.CompressFormat.JPEG, 100, faceImageByteArrayOutputStream);
                        byte[] faceImageByte = faceImageByteArrayOutputStream.toByteArray();
                        obj.put("faceImage", Base64.encodeToString(faceImageByte, Base64.DEFAULT));
                    }
                    if (sign_image != null) {
                        ByteArrayOutputStream faceImageByteArrayOutputStream = new ByteArrayOutputStream();
                        sign_image.compress(Bitmap.CompressFormat.JPEG, 100, faceImageByteArrayOutputStream);
                        byte[] signImageByte = faceImageByteArrayOutputStream.toByteArray();
                        obj.put("signImage", Base64.encodeToString(signImageByte, Base64.DEFAULT));
                    }
                    JSONObject dataObject = EChipDataWithCard(cardDetails);
                    obj.put("EChipData", dataObject);
                    PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    @Override
    public void tagReadFailed(final String tag_read_error_message) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("id", "tagReadFailed");
                    obj.put("errorType", ErrorType.AcuantErrorUnknown);
                    obj.put("errorMessage", tag_read_error_message);
                    PluginResult result = new PluginResult(PluginResult.Status.ERROR, obj);
                    result.setKeepCallback(true);
                    callbackId.sendPluginResult(result);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(nfcIntent);
        nfcIntent = intent;
    }
    
}

