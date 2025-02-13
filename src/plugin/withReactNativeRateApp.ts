import { withInfoPlist, withXcodeProject } from "@expo/config-plugins";
import type { ConfigPlugin } from "expo/config-plugins";

/**
 * Modifies the `Info.plist` file to add `LSApplicationQueriesSchemes`,
 * allowing the app to open App Store links.
 *
 * @param {ConfigPlugin} config - The Expo configuration object.
 * @returns {ConfigPlugin} - The modified Expo configuration.
 */
const withCustomInfoPlist: ConfigPlugin = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults.LSApplicationQueriesSchemes = ["itms-apps"];
    return config;
  });
};

/**
 * Adds the `StoreKit.framework` to the iOS Xcode project.
 * This framework is required for in-app review prompts.
 *
 * @param {ConfigPlugin} config - The Expo configuration object.
 * @returns {ConfigPlugin} - The modified Expo configuration.
 */
const withStoreKitFramework: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    config.modResults.addFramework("StoreKit.framework", { required: true });
    return config;
  });
};

/**
 * Applies both `withCustomInfoPlist` and `withStoreKitFramework`
 * to enable in-app rating functionality in a React Native app.
 *
 * @param {ConfigPlugin} config - The Expo configuration object.
 * @returns {ConfigPlugin} - The modified Expo configuration.
 */
const withReactNativeRateApp: ConfigPlugin = (config) => {
  config = withCustomInfoPlist(config);
  config = withStoreKitFramework(config);
  return config;
};

export default withReactNativeRateApp;