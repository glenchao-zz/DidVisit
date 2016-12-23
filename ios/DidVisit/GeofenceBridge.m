// Geofence
#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Geofence, NSObject)

// get
RCT_EXTERN_METHOD(getAll:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock *)reject)

// add
RCT_EXTERN_METHOD(add:(NSString *)id
                            latitude:(double *)latitude
                           longitude:(double *)longitude
                              radius:(nonnull NSNumber *) radius
                             resolve:(RCTPromiseResolveBlock *)resolve
                              reject:(RCTPromiseRejectBlock *)reject)

// remove
RCT_EXTERN_METHOD(remove:(NSString *)id resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock *)reject)
RCT_EXTERN_METHOD(removeAll:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock *)reject)

@end
