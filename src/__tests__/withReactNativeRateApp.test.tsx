import { withInfoPlist, withXcodeProject } from "@expo/config-plugins";
import withReactNativeRateApp from "../plugin/withReactNativeRateApp";

// Mock the Expo config plugins
jest.mock("@expo/config-plugins", () => {
  return {
    withInfoPlist: jest.fn((config) => {
      // Just return the config to simulate the plugin chain
      return config;
    }),
    withXcodeProject: jest.fn((config) => {
      // Just return the config to simulate the plugin chain
      return config;
    }),
  };
});

describe("withReactNativeRateApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls withInfoPlist and withXcodeProject with the correct config", () => {
    const mockConfig = { name: "test-app", slug: "test-app" };

    withReactNativeRateApp(mockConfig);

    expect(withInfoPlist).toHaveBeenCalledWith(
      mockConfig,
      expect.any(Function),
    );
    expect(withXcodeProject).toHaveBeenCalledWith(
      mockConfig,
      expect.any(Function),
    );
  });

  describe("iOS Info.plist configuration", () => {
    it("adds LSApplicationQueriesSchemes with itms-apps to Info.plist", () => {
      const mockConfig = { name: "test-app", slug: "test-app" };

      withReactNativeRateApp(mockConfig);

      const configToTransform = {
        modResults: {},
      };

      const transformerFn = (withInfoPlist as jest.Mock).mock.calls[0][1];

      const result = transformerFn(configToTransform);

      expect(result.modResults.LSApplicationQueriesSchemes).toEqual([
        "itms-apps",
      ]);
    });

    it("preserves existing LSApplicationQueriesSchemes and adds itms-apps", () => {
      const mockConfig = { name: "test-app", slug: "test-app" };

      withReactNativeRateApp(mockConfig);

      const configToTransform = {
        modResults: {
          LSApplicationQueriesSchemes: ["existing-scheme"],
        },
      };

      const transformerFn = (withInfoPlist as jest.Mock).mock.calls[0][1];

      const result = transformerFn(configToTransform);

      expect(result.modResults.LSApplicationQueriesSchemes).toEqual([
        "existing-scheme",
        "itms-apps",
      ]);
    });

    it("doesn't add duplicate itms-apps to LSApplicationQueriesSchemes", () => {
      const mockConfig = { name: "test-app", slug: "test-app" };

      withReactNativeRateApp(mockConfig);

      const configToTransform = {
        modResults: {
          LSApplicationQueriesSchemes: ["itms-apps", "other-scheme"],
        },
      };

      const transformerFn = (withInfoPlist as jest.Mock).mock.calls[0][1];

      const result = transformerFn(configToTransform);

      expect(result.modResults.LSApplicationQueriesSchemes).toEqual([
        "itms-apps",
        "other-scheme",
      ]);
    });
  });

  describe("iOS Xcode project configuration", () => {
    it("adds StoreKit.framework to the Xcode project", () => {
      const mockConfig = { name: "test-app", slug: "test-app" };

      withReactNativeRateApp(mockConfig);

      const mockXcodeProject = {
        addFramework: jest.fn(),
      };

      const configToTransform = {
        modResults: mockXcodeProject,
      };

      const transformerFn = (withXcodeProject as jest.Mock).mock.calls[0][1];

      transformerFn(configToTransform);

      expect(mockXcodeProject.addFramework).toHaveBeenCalledWith(
        "StoreKit.framework",
        { required: true },
      );
    });
  });
});
