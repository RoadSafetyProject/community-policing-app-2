import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import {Map,LatLng,Marker}  from "leaflet";
import { GoogleMap, GoogleMapsEvent,GoogleMapsLatLng } from 'ionic-native';

//declare let L: any;

@Component({
  templateUrl: 'build/pages/facilities/facilities.html'
})
export class FacilitiesPage {

  map: GoogleMap;
  constructor(public navCtrl: NavController,public menuCtrl: MenuController) {
    /**/
  }
  ngAfterViewInit(){
    console.log("Here");
    //center.lat = 51.505;
    //center.lng = -0.09;
    /*var map = new Map('map');
    map.setView(new LatLng(51.505,-0.09), 3);

    var marker = new Marker(new LatLng(51.505,-0.09));
    marker.addTo(map)*/

    /*let map = new GoogleMap('map');

    map.on(GoogleMapsEvent.MAP_READY).subscribe(()=> { console.log("other is ready" )});*/

    let location = new GoogleMapsLatLng(-34.9290,138.6010);

    this.map = new GoogleMap('map'/*, {
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
        'latLng': location,
        'tilt': 30,
        'zoom': 5,
        'bearing': 50
      }
    }*/);

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');
    });
    /*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();*/
    console.log("Here2");
  }
}
