import {Injectable,NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Geolocation, BackgroundGeolocation } from 'ionic-native';

@Injectable()
export class LocationTracker {

  positionObserver = null;
  watch;
  position;

  constructor(public zone: NgZone) {
    this.position = Observable.create(observer => {
      this.positionObserver = observer;
    });

  }

  startTracking() {

    /*// In App Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = Geolocation.watchPosition(options);

    this.watch.subscribe((data) => {
      this.notifyLocation(data);
    });

    // Background Tracking

    BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    }).then((location) => {
      this.notifyLocation(location);
    }, (err) => {
      console.log(err);
    });

    BackgroundGeolocation.start();

    return this.position;*/


    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    BackgroundGeolocation.configure(config).then((location) => {

      console.log('BackgroundGeolocation:  ' + JSON.stringify(location));

      // Run update inside of Angular's zone
      this.zone.run(() => {
        //this.lat = location.latitude;
        //this.lng = location.longitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    BackgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = Geolocation.watchPosition(options);

    this.watch.subscribe((data) => {
      console.log('Location Change:  ' + JSON.stringify(location));
      this.notifyLocation(data);
    });
      /*.filter((p: any) => p.code === undefined)*/
      /*.subscribe((position: any) => {

      console.log(JSON.stringify(position));

      // Run update inside of Angular's zone
      this.zone.run(() => {
        console.log("THis running zone");
        /!*this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;*!/
      });

    });*/
    return this.position;
  }

  stopTracking() {
    BackgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

  notifyLocation(location) {
    this.positionObserver.next(location);
  }

  public getWatcher(){
    return this.watch
  }

}
