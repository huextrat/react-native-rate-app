#import "RateApp.h"
#import <React/RCTBridgeModule.h>
#import <StoreKit/StoreKit.h>
#import <UIKit/UIKit.h>

static NSString *const kNoActiveSceneError = @"no_active_scene";
static NSString *const kUnsupportedPlatformError = @"unsupported_platform";

@implementation RateApp

#pragma mark - Private

- (UIWindowScene *)findActiveScene
{
  if (@available(iOS 13.0, *)) {
    NSSet<UIScene *> *scenes = [UIApplication sharedApplication].connectedScenes;
    for (UIScene *scene in scenes) {
      if ([scene isKindOfClass:[UIWindowScene class]] &&
          scene.activationState == UISceneActivationStateForegroundActive) {
        return (UIWindowScene *)scene;
      }
    }
  }
  return nil;
}

#pragma mark - NativeRateAppSpec

- (void)requestReview:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  UIWindowScene *scene = [self findActiveScene];
  if (scene == nil) {
    reject(kNoActiveSceneError, @"No active scene found", nil);
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    if (@available(iOS 14.0, *)) {
      [SKStoreReviewController requestReviewInScene:scene];
    } else {
      [SKStoreReviewController requestReview];
    }
    resolve(@YES);
  });
}

- (void)requestReviewAppGallery:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  reject(kUnsupportedPlatformError,
         @"App Gallery reviews are not supported on iOS",
         nil);
}

- (void)requestReviewGalaxyStore:(NSString *)packageName
                        resolve:(RCTPromiseResolveBlock)resolve
                         reject:(RCTPromiseRejectBlock)reject
{
  reject(kUnsupportedPlatformError,
         @"Galaxy Store reviews are not supported on iOS",
         nil);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRateAppSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"RateApp";
}

@end
