import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-rate-app' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RateAppModule = isTurboModuleEnabled
  ? require('./NativeRateApp').default
  : NativeModules.RateApp;

const RateApp = RateAppModule
  ? RateAppModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return RateApp.multiply(a, b);
}
