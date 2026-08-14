#import "DynamicAppIcon.h"
#import <React/RCTLog.h>

@implementation DynamicAppIcon

RCT_EXPORT_MODULE(DynamicAppIcon)

/**
 * setAlternateIconName: on the iOS Simulator sporadically returns
 * "Resource temporarily unavailable" (EAGAIN / error code 11).
 * This is a known Apple bug — the fix is to retry with a short delay.
 */
+ (void)setIconName:(NSString * _Nullable)iconName
            attempt:(int)attempt
           resolver:(RCTPromiseResolveBlock)resolve
           rejecter:(RCTPromiseRejectBlock)reject
{
    static const int kMaxAttempts = 5;
    static const double kRetryDelaySeconds = 0.35;

    [UIApplication.sharedApplication setAlternateIconName:iconName completionHandler:^(NSError *error) {
        if (!error) {
            resolve(@(YES));
            return;
        }

        // EAGAIN = 11 — "Resource temporarily unavailable", simulator-only transient error
        BOOL isTransient = (error.domain == NSPOSIXErrorDomain && error.code == 11)
                         || [error.localizedDescription containsString:@"Resource temporarily unavailable"];

        if (isTransient && attempt < kMaxAttempts) {
            dispatch_after(
                dispatch_time(DISPATCH_TIME_NOW, (int64_t)(kRetryDelaySeconds * NSEC_PER_SEC)),
                dispatch_get_main_queue(),
                ^{
                    RCTLogInfo(@"[DynamicAppIcon] Retrying setAlternateIconName (attempt %d/%d)", attempt + 1, kMaxAttempts);
                    [DynamicAppIcon setIconName:iconName
                                       attempt:attempt + 1
                                      resolver:resolve
                                      rejecter:reject];
                }
            );
        } else {
            reject(@"ICON_CHANGE_FAILED", error.localizedDescription, error);
        }
    }];
}

RCT_EXPORT_METHOD(changeIcon:(NSString *)iconName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (![UIApplication.sharedApplication supportsAlternateIcons]) {
            reject(@"UNSUPPORTED", @"Alternate icons are not supported on this device.", nil);
            return;
        }

        NSString *currentIcon = UIApplication.sharedApplication.alternateIconName;
        NSString *trimmedName = [iconName stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
        BOOL isDefaultTarget = (trimmedName == nil ||
                                [trimmedName length] == 0 ||
                                [trimmedName.lowercaseString isEqualToString:@"default"]);

        // Already on the requested icon — resolve immediately
        if ((currentIcon == nil && isDefaultTarget) ||
            (currentIcon != nil && [currentIcon isEqualToString:trimmedName])) {
            resolve(@(YES));
            return;
        }

        NSString *targetIcon = isDefaultTarget ? nil : trimmedName;
        [DynamicAppIcon setIconName:targetIcon attempt:1 resolver:resolve rejecter:reject];
    });
}

RCT_EXPORT_METHOD(restoreDefaultIcon:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [DynamicAppIcon setIconName:nil attempt:1 resolver:resolve rejecter:reject];
    });
}

RCT_EXPORT_METHOD(getCurrentIcon:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *icon = UIApplication.sharedApplication.alternateIconName;
        resolve(icon ?: @"Default");
    });
}

RCT_EXPORT_METHOD(showSplash:(NSString *)configStr
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(nil);
}

RCT_EXPORT_METHOD(hideSplash:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(nil);
}

@end
