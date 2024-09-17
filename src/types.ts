export enum AndroidMarket {
  GOOGLE = "google",
  AMAZON = "amazon",
  SAMSUNG = "samsung",
  HUAWEI = "huawei",
}

export interface OpenStoreForReviewProps {
  /**
   * The App Store ID of the app to open the store listing for on iOS.
   */
  iOSAppId?: string;
  /**
   * The package name of the app to open the store listing for on Android.
   */
  androidPackageName?: string;
  /**
   * The market where the app's store listing should be opened on Android.
   * @default AndroidMarket.GOOGLE
   */
  androidMarket?: AndroidMarket;
}
