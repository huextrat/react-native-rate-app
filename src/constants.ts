import { AndroidMarket } from "./types";

export const IOS_REVIEW_URL = "itms-apps://apps.apple.com/app/id";

export const ANDROID_MARKET_URLS: Record<AndroidMarket, string> = {
  [AndroidMarket.GOOGLE]: "market://details?id={packageName}",
  [AndroidMarket.AMAZON]: "amzn://apps/android?p={packageName}",
  [AndroidMarket.SAMSUNG]: "samsungapps://ProductDetail/{packageName}",
  [AndroidMarket.HUAWEI]: "appmarket://details?id={packageName}",
};
