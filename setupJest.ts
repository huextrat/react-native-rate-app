jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  RateApp: {
    requestReview: jest.fn(),
    requestReviewGalaxyStore: jest.fn(),
    requestReviewAppGallery: jest.fn(),
  },
  PlatformConstants: {},
}));
