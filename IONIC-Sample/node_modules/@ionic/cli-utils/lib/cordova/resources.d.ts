import { ImageResource, ImageUploadResponse, IonicEnvironment, KnownPlatform, ResourcesConfig, SourceImage } from '../../definitions';
import { ConfigXml } from './config';
export declare function getImageResources(env: IonicEnvironment): Promise<ImageResource[]>;
/**
 * Create the destination directories for the provided image resources.
 */
export declare function createImgDestinationDirectories(imgResources: ImageResource[]): Promise<void[]>;
/**
 * Find all source images within the resources directory
 */
export declare function getSourceImages(env: IonicEnvironment, buildPlatforms: string[], resourceTypes: string[]): Promise<SourceImage[]>;
/**
 * Find the source image that matches the requirements of the image resource provided.
 */
export declare function findMostSpecificImage(imageResource: ImageResource, srcImagesAvailable: SourceImage[]): SourceImage | null;
/**
 * Upload the provided source image through the resources web service. This will make it available
 * for transforms for the next 5 minutes.
 */
export declare function uploadSourceImages(env: IonicEnvironment, srcImages: SourceImage[]): Promise<ImageUploadResponse[]>;
/**
 * Using the transformation web service transform the provided image resource
 * into the appropriate w x h and then write this file to the provided destination directory.
 */
export declare function transformResourceImage(env: IonicEnvironment, imageResource: ImageResource): Promise<void>;
/**
 * Add image resource references for the provided platforms to the project's config.xml file.
 */
export declare function addResourcesToConfigXml(conf: ConfigXml, platformList: KnownPlatform[], resourceJson: ResourcesConfig): Promise<void>;
export declare const RESOURCES: ResourcesConfig;
