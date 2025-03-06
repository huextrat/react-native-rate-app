import { Linking, Platform } from "react-native";
import NativeRateApp from "../codegenSpec/NativeRateApp";
import RateApp, { IOS_REVIEW_URL } from "../index";
import { AndroidMarket } from "../types";

describe("RateApp", () => {
  describe("requestReview", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should request a review successfully", async () => {
      jest.spyOn(NativeRateApp, "requestReview").mockResolvedValue(true);
      const result = await RateApp.requestReview();
      expect(result).toBe(true);
    });

    it("Samsung - should request a review successfully", async () => {
      Platform.OS = "android";
      jest
        .spyOn(NativeRateApp, "requestReviewGalaxyStore")
        .mockResolvedValue(true);
      const result = await RateApp.requestReview({
        androidMarket: AndroidMarket.SAMSUNG,
        androidPackageName: "com.example.app",
      });
      expect(result).toBe(true);
    });

    it("Samsung - androidPackageName should be required", async () => {
      Platform.OS = "android";
      await expect(
        RateApp.requestReview({
          androidMarket: AndroidMarket.SAMSUNG,
        }),
      ).rejects.toThrow(
        "androidPackageName is required for Samsung Galaxy Store",
      );
    });

    it("Huawei - should request a review successfully", async () => {
      Platform.OS = "android";
      jest
        .spyOn(NativeRateApp, "requestReviewAppGallery")
        .mockResolvedValue(true);
      const result = await RateApp.requestReview({
        androidMarket: AndroidMarket.HUAWEI,
      });
      expect(result).toBe(true);
    });

    it("should throw RateAppError if requestReview fails", async () => {
      jest
        .spyOn(NativeRateApp, "requestReview")
        .mockRejectedValue(new Error("Test error"));
      await expect(RateApp.requestReview()).rejects.toThrow(
        "Failed to request review: Error: Test error",
      );
    });
  });

  describe("openStoreForReview", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should open iOS store listing successfully", async () => {
      Platform.OS = "ios";
      const iOSAppId = "123456789";
      const url = `${IOS_REVIEW_URL}${iOSAppId}?action=write-review`;
      jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
      jest.spyOn(Linking, "openURL").mockResolvedValue(true);

      const result = await RateApp.openStoreForReview({ iOSAppId });
      expect(result).toBe(true);
      expect(Linking.canOpenURL).toHaveBeenCalledWith(url);
      expect(Linking.openURL).toHaveBeenCalledWith(url);
    });

    it("should throw RateAppError if iOSAppId is missing", async () => {
      Platform.OS = "ios";
      await expect(RateApp.openStoreForReview({})).rejects.toThrow(
        "iOSAppId is required for iOS and macOS",
      );
    });

    it("should open Android store listing successfully", async () => {
      Platform.OS = "android";
      const androidPackageName = "com.example.app";
      const url = `market://details?id=${androidPackageName}`;
      jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
      jest.spyOn(Linking, "openURL").mockResolvedValue(true);

      const result = await RateApp.openStoreForReview({ androidPackageName });
      expect(result).toBe(true);
      expect(Linking.canOpenURL).toHaveBeenCalledWith(url);
      expect(Linking.openURL).toHaveBeenCalledWith(url);
    });

    it("should throw RateAppError if androidPackageName is missing", async () => {
      Platform.OS = "android";
      await expect(RateApp.openStoreForReview({})).rejects.toThrow(
        "androidPackageName is required for Android",
      );
    });

    it("should throw RateAppError for unsupported platform", async () => {
      Platform.OS = "windows";
      await expect(RateApp.openStoreForReview({})).rejects.toThrow(
        "Unsupported platform: windows",
      );
    });
  });

  describe("getAndroidMarketUrl", () => {
    it("should return the correct URL for Google Play", () => {
      const packageName = "com.example.app";
      const url = RateApp.getAndroidMarketUrl(
        AndroidMarket.GOOGLE,
        packageName,
      );
      expect(url).toBe(`market://details?id=${packageName}`);
    });

    it("Samsung - should return the correct URL for Samsung Galaxy Store", () => {
      const packageName = "com.example.app";
      const url = RateApp.getAndroidMarketUrl(
        AndroidMarket.SAMSUNG,
        packageName,
      );
      expect(url).toBe(`samsungapps://ProductDetail/${packageName}`);
    });

    it("Huawei - should return the correct URL for Huawei AppGallery", () => {
      const packageName = "com.example.app";
      const url = RateApp.getAndroidMarketUrl(
        AndroidMarket.HUAWEI,
        packageName,
      );
      expect(url).toBe(`appmarket://details?id=${packageName}`);
    });

    it("Amazon - should return the correct URL for Amazon Appstore", () => {
      const packageName = "com.example.app";
      const url = RateApp.getAndroidMarketUrl(
        AndroidMarket.AMAZON,
        packageName,
      );
      expect(url).toBe(`amzn://apps/android?p=${packageName}`);
    });

    it("should throw RateAppError for unsupported Android market", () => {
      const packageName = "com.example.app";
      expect(() =>
        RateApp.getAndroidMarketUrl(
          "unsupported_market" as AndroidMarket,
          packageName,
        ),
      ).toThrow("Unsupported Android market: unsupported_market");
    });

    it("should return false when canOpenURL returns false", async () => {
      Platform.OS = "ios";
      const mockIosAppId = "123456789";
      jest.spyOn(Linking, "canOpenURL").mockResolvedValue(false);
      const result = await RateApp.openStoreForReview({
        iOSAppId: mockIosAppId,
      });
      expect(result).toBe(false);
    });

    it("should throw RateAppError if opening the store fails", async () => {
      Platform.OS = "ios";
      const iOSAppId = "123456789";
      const url = `${IOS_REVIEW_URL}${iOSAppId}?action=write-review`;
      jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
      jest
        .spyOn(Linking, "openURL")
        .mockRejectedValue(new Error("Failed to open URL"));

      await expect(RateApp.openStoreForReview({ iOSAppId })).rejects.toThrow(
        "Failed to open store for review: Error: Failed to open URL",
      );
      expect(Linking.canOpenURL).toHaveBeenCalledWith(url);
      expect(Linking.openURL).toHaveBeenCalledWith(url);
    });
  });
});
