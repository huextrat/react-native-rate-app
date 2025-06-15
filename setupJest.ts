jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => ({
  getEnforcing: jest.fn((moduleName: string) => {
    if (moduleName === "RateApp") {
      return {
        requestReview: jest.fn(),
        requestReviewGalaxyStore: jest.fn(),
        requestReviewAppGallery: jest.fn(),
      };
    }
    return {};
  }),
}));
