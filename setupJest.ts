jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  RateApp: {
    requestReview: jest.fn(),
  },
  PlatformConstants: {},
}));
