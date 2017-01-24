import { Component } from '@angular/core';
import {LocationTracker} from '../silent/tracker';
import {Events,ToastController} from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent,GoogleMapsLatLng,GoogleMapsMarkerOptions, GoogleMapsMarker } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/silent/silent.html',
  providers: [LocationTracker]
})
export class SilentPage {

  map:GoogleMap;
  marker:GoogleMapsMarker;
  center:GoogleMapsLatLng;
  speed = 0;

  static get parameters() {
    return [[LocationTracker]];
  }

  constructor(private tracker:LocationTracker,private toastCtrl: ToastController,public events: Events) {
    /**/
    //this.tracker.startTracking();
  }

  start() {
    console.log("TRACK:Started tracking");
    this.tracker.startTracking().subscribe((position) => {
      let toast = this.toastCtrl.create({
        message: 'User was added successfully:' + JSON.stringify(position),
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
      var title = "Moving at a speed of ";
      if (position.coords.speed) {
        this.speed = position.coords.speed;
        if(position.coords.speed > 20){
          title += position.coords.speed;
          alert("Your Current Speed:" + position.coords.speed);
        }
      } else {
        title += "0";
        this.speed = 0;
      }
      if (this.marker) {
        this.marker.setPosition(position.coords);
        this.marker.setTitle(title);
      } else {
        let markerOptions:GoogleMapsMarkerOptions = {
          position: position.coords,
          title: title
        };
        this.map.addMarker(markerOptions).then(
          (marker:GoogleMapsMarker) => {
            this.marker = marker;
            this.marker.showInfoWindow();
          })
      }

    });
  }

  stop() {
    this.tracker.stopTracking();
  }

  ngAfterViewInit() {

    this.start();
    this.center = new GoogleMapsLatLng(-6.3690, 34.8888);

    this.map = new GoogleMap('map1', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': this.center,
        'tilt': 1,
        'zoom': 7,
        'bearing': 50
      }
    });

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      this.events.subscribe('menu:opened', () => {
        // your action here
        this.map.setClickable(false);
      });

      this.events.subscribe('menu:closed', () => {
        // your action here
        this.map.setClickable(true);
      });
      try{
        this.start();
      }catch (e){
        console.log(e);
      }
      console.log('Map is ready!');
    });
  }
}
