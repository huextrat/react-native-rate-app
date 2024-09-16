#import "RateApp.h"
#import <StoreKit/StoreKit.h>

@implementation RateApp
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(requestReview:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    UIWindowScene *scene = [self findActiveScene];
    [SKStoreReviewController requestReviewInScene:scene];
    resolve(@(YES));
}

- (UIWindowScene *) findActiveScene {
    for (UIWindowScene *scene in UIApplication.sharedApplication.connectedScenes) {
        if (scene.activationState == UISceneActivationStateForegroundActive) {
            return scene;
        }
    }
    return nil;
}

RCT_EXPORT_METHOD(openStoreListing:(NSString *)appId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if (!appId) {
        reject(@"appId is required", @"appId is required", nil);
        return;
    }

    NSString *storeUrlString = [NSString stringWithFormat:@"itms-apps://apps.apple.com/app/id%@?action=write-review", appId];
    NSURL *storeUrl = [NSURL URLWithString:storeUrlString];
    [[UIApplication sharedApplication] openURL:storeUrl options:@{} completionHandler:^(BOOL success) {
        if (success) {
            resolve(@(YES));
        } else {
            reject(@"failed to open store listing", @"failed to open store listing", nil);
        }
    }];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRateAppSpecJSI>(params);
}
#endif

@end
