#import "RateApp.h"
#if __has_include(<RateApp/RateApp-Swift.h>)
#import <RateApp/RateApp-Swift.h>
#else
#import "RateApp-Swift.h"
#endif
#import <React/RCTBridgeModule.h>

@implementation RateApp {
  RateAppImpl *_impl;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _impl = [RateAppImpl new];
  }
  return self;
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

- (void)requestReview:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [_impl requestReview:resolve reject:reject];
}

- (void)requestReviewAppGallery:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [_impl requestReviewAppGallery:resolve reject:reject];
}

- (void)requestReviewGalaxyStore:(NSString *)packageName
                        resolve:(RCTPromiseResolveBlock)resolve
                         reject:(RCTPromiseRejectBlock)reject
{
  [_impl requestReviewGalaxyStore:packageName resolve:resolve reject:reject];
}

@end
