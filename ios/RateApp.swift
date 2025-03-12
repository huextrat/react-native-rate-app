import Foundation
import StoreKit

@objc(RateApp)
class RateApp: NSObject {
  
  private let noActiveSceneError = "no_active_scene"
  private let unsupportedPlatformError = "unsupported_platform"
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func requestReview(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if let scene = findActiveScene() {
      if #available(iOS 16.0, *) {
        Task { @MainActor in
          AppStore.requestReview(in: scene)
        }
      } else {
        SKStoreReviewController.requestReview(in: scene)
      }
      resolve(true)
    } else {
      reject(noActiveSceneError, "No active scene found", nil)
    }
  }
  
  @objc
  func requestReviewAppGallery(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    reject(unsupportedPlatformError, "App Gallery reviews are not supported on iOS", nil)
  }
  
  @objc
  func requestReviewGalaxyStore(_ packageName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    reject(unsupportedPlatformError, "Galaxy Store reviews are not supported on iOS", nil)
  }
  
  private func findActiveScene() -> UIWindowScene? {
    for scene in UIApplication.shared.connectedScenes {
      if let windowScene = scene as? UIWindowScene, 
         windowScene.activationState == .foregroundActive {
        return windowScene
      }
    }
    return nil
  }
}