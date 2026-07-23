#import "DynamicAppIcon.h"
#import <React/RCTLog.h>

@implementation DynamicAppIcon

RCT_EXPORT_MODULE(DynamicAppIcon)

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

        if ((currentIcon == nil && isDefaultTarget) ||
            (currentIcon != nil && [currentIcon isEqualToString:trimmedName])) {
            resolve(@(YES));
            return;
        }

        NSString *targetIcon = isDefaultTarget ? nil : trimmedName;
        [UIApplication.sharedApplication setAlternateIconName:targetIcon completionHandler:^(NSError *error) {
            if (error) {
                reject(@"ICON_CHANGE_FAILED", error.localizedDescription, error);
            } else {
                resolve(@(YES));
            }
        }];
    });
}

RCT_EXPORT_METHOD(restoreDefaultIcon:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication.sharedApplication setAlternateIconName:nil completionHandler:^(NSError *error) {
            if (error) {
                reject(@"ICON_RESTORE_FAILED", error.localizedDescription, error);
            } else {
                resolve(@(YES));
            }
        }];
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
