// Geofence.swift

import Foundation
import CoreLocation

// Geofence

@objc(Geofence)
class Geofence: RCTEventEmitter {
  let locationManager = CLLocationManager()

  override init() {
    super.init()
    locationManager.delegate = self
    locationManager.requestAlwaysAuthorization()
    locationManager.startMonitoringVisits()
  }

  override func supportedEvents() -> [String]! {
    // TODO consider changing this to...
    // triggered, entered, exited, visited, significantChanges
    // Remember to export these as constants to js
    return [
      "GeofenceTriggered",
      "DidVisit"
    ]
  }

  @objc func getAll(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let regions = Array(locationManager.monitoredRegions)
    var data: [Any] = []
    for region in regions {
      guard let cRegion = region as? CLCircularRegion else { continue }
      data.append([
        "id": cRegion.identifier,
        "latitude": cRegion.center.latitude,
        "longitude": cRegion.center.longitude,
        "radius": cRegion.radius,
        ])
    }
    resolve(data)
  }

  @objc func removeAll(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    for region in locationManager.monitoredRegions {
      locationManager.stopMonitoring(for: region)
      NSLog("Stop monitoring %@", region.identifier)
    }
    resolve([])
  }

  @objc func add(_ id: String, latitude: Double, longitude: Double, radius: NSNumber, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {

    let location = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    let region = self.getCircularRegion(id: id, location: location, radius: radius)
    locationManager.startMonitoring(for: region)

    NSLog("Start monitoring %@, lat: %f, lng: %f, radius: %f", id, location.latitude, location.longitude, region.radius)
    NSLog("Monitored regions %d", locationManager.monitoredRegions.count)

    resolve(["id": id, "latitude": latitude, "longitude": longitude])
  }

  @objc func remove(_ id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    for region in locationManager.monitoredRegions {
      guard let circularRegion = region as? CLCircularRegion, circularRegion.identifier == id
        else { continue }
      locationManager.stopMonitoring(for: circularRegion)
      let loc = circularRegion.center
      NSLog("Remove monitoring %@, lat: %f, lng: %f, radius: %f", id, loc.latitude, loc.longitude, circularRegion.radius)
    }
    NSLog("Monitored regions %d", locationManager.monitoredRegions.count)
    resolve(nil)
  }

  func getCircularRegion(id: String, location: CLLocationCoordinate2D, radius: NSNumber) -> CLCircularRegion {
    let region = CLCircularRegion(center: location, radius: Double(radius), identifier: id)
    region.notifyOnEntry = true
    region.notifyOnExit = true
    return region
  }

  func handleEvent(forRegion region: CLRegion!, eventType: String!) {
    print(String(format: "Geofence triggered! %@", region.identifier))
    self.sendEvent(withName: "GeofenceTriggered", body: ["id": region.identifier, "eventType": eventType])
  }
}

extension Geofence: CLLocationManagerDelegate {
  func locationManager(_ manager: CLLocationManager, monitoringDidFailFor region: CLRegion?, withError error: Error) {
    print("Monitoring failed for region with identifier: \(region!.identifier)")
  }

  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    print("Location Manager failed with the following error: \(error)")
  }

  func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
    if region is CLCircularRegion {
      handleEvent(forRegion: region, eventType: "enter")
    }
  }

  func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
    if region is CLCircularRegion {
      handleEvent(forRegion: region, eventType: "exit")
    }
  }

  func locationManager(_ manager: CLLocationManager, didVisit visit: CLVisit) {
    let data:[String:Any] = [
      "latitude": visit.coordinate.latitude,
      "longitude": visit.coordinate.longitude,
      "arrivalDate": visit.arrivalDate,
      "departureDate": visit.departureDate == Date.distantFuture ? "" : visit.departureDate,
      "horizontalAccuracy": visit.horizontalAccuracy,
    ]
    self.sendEvent(withName: "DidVisit", body: data)
  }
}
