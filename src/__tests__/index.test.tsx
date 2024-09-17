import { Linking, Platform } from "react-native";
import NativeRateApp from "../NativeRateApp";
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

    it("should throw RateAppError for unsupported Android market", () => {
      const packageName = "com.example.app";
      expect(() =>
        RateApp.getAndroidMarketUrl(
          "unsupported_market" as AndroidMarket,
          packageName,
        ),
      ).toThrow("Unsupported Android market: unsupported_market");
    });
  });
});
