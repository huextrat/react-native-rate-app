import { Platform } from 'react-native';
import NativeRateApp from './NativeRateApp';

const RateApp = {
  async requestReview() {
    return await NativeRateApp.requestReview();
  },
  async openStoreListing({ appId }: { appId?: string }) {
    const isIOS = Platform.OS === 'ios';
    if (isIOS) {
      console.log('appId', appId);
      return await NativeRateApp.openStoreListing(appId);
    }
    return await NativeRateApp.openStoreListing();
  },
};

export default RateApp;
