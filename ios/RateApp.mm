#import "RateApp.h"
#import "RateApp-Swift.h"

// Swift implements RateApp (requestReview, etc.). This category adds the
// TurboModule C++ glue that cannot be expressed in Swift.
@implementation RateApp (TurboModule)

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
