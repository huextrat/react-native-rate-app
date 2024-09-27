import { Linking, Platform } from "react-native";
import NativeRateApp from "./codegenSpec/NativeRateApp";
import { ANDROID_MARKET_URLS, IOS_REVIEW_URL } from "./constants";
import {
  AndroidMarket,
  type OpenStoreForReviewProps,
  type RequestReviewProps,
} from "./types";

/**
 * Custom error for rate app operations
 */
class RateAppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateAppError";
  }
}

const RateApp = {
  /**
   * Requests a review from the user.
   *
   * @param {RequestReviewProps} props - The properties for the review request.
   * @param {AndroidMarket} [props.androidMarket=AndroidMarket.GOOGLE] - The market where the app's review request should be directed on Android.
   * @param {string} [props.androidPackageName] - The package name of the app to request a review for on Samsung Galaxy Store.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the review was successfully requested.
   */
  async requestReview({
    androidMarket = AndroidMarket.GOOGLE,
    androidPackageName,
  }: RequestReviewProps = {}): Promise<boolean> {
    try {
      if (Platform.OS === "android") {
        switch (androidMarket) {
          case AndroidMarket.SAMSUNG:
            if (!androidPackageName) {
              throw new RateAppError(
                "androidPackageName is required for Samsung Galaxy Store",
              );
            }
            return await NativeRateApp.requestReviewGalaxyStore(
              androidPackageName,
            );
          case AndroidMarket.HUAWEI:
            return await NativeRateApp.requestReviewAppGallery();
          default:
            return await NativeRateApp.requestReview();
        }
      }
      return await NativeRateApp.requestReview();
    } catch (error) {
      throw new RateAppError(`Failed to request review: ${error}`);
    }
  },

  /**
   * Opens the store listing for the app.
   * @param props The properties for the store listing.
   * @returns A promise that resolves to a boolean indicating whether the store listing was successfully opened.
   */
  async openStoreForReview({
    iOSAppId,
    androidPackageName,
    androidMarket = AndroidMarket.GOOGLE,
  }: OpenStoreForReviewProps): Promise<boolean> {
    const isIOS = Platform.OS === "ios";
    const ismacOS = Platform.OS === "macos";
    const isAndroid = Platform.OS === "android";
    let url = "";

    if (isIOS || ismacOS) {
      if (!iOSAppId) {
        throw new RateAppError("iOSAppId is required for iOS and macOS");
      }
      url = `${IOS_REVIEW_URL}${iOSAppId}?action=write-review`;
    } else if (isAndroid) {
      if (!androidPackageName) {
        throw new RateAppError("androidPackageName is required for Android");
      }
      url = this.getAndroidMarketUrl(androidMarket, androidPackageName);
    } else {
      throw new RateAppError(`Unsupported platform: ${Platform.OS}`);
    }

    try {
      const canOpenURL = await Linking.canOpenURL(url);
      if (canOpenURL) {
        await Linking.openURL(url);
      }
      return canOpenURL;
    } catch (error) {
      throw new RateAppError(`Failed to open store for review: ${error}`);
    }
  },

  /**
   * Gets the URL for the Android market.
   * @param androidMarket The market where the app's store listing should be opened on Android.
   * @param androidPackageName The package name of the app to open the store listing for on Android.
   * @returns The URL for the Android market.
   */
  getAndroidMarketUrl(
    androidMarket: AndroidMarket,
    androidPackageName: string,
  ): string {
    const urlTemplate = ANDROID_MARKET_URLS[androidMarket];
    if (!urlTemplate) {
      throw new RateAppError(`Unsupported Android market: ${androidMarket}`);
    }
    return urlTemplate.replace("{packageName}", androidPackageName);
  },
};

export * from "./types";
export * from "./constants";
export const { requestReview, openStoreForReview, getAndroidMarketUrl } =
  RateApp;
export default RateApp;
