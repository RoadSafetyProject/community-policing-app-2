import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from "@ionic-native/google-maps";
import { Component, OnInit } from "@angular/core/";
import { IonicPage } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";

/**
 * Generated class for the SilentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-silent",
  templateUrl: "silent.html"
})
export class SilentPage implements OnInit {
  map: GoogleMap;
  constructor(
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation
      .getCurrentPosition({ timeout: 3000 })
      .then((data: any) => {
        const coordinate = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };
        const mapOptions: GoogleMapOptions = {
          camera: {
            target: coordinate,
            zoom: 7,
            tilt: 1,
            bearing: 50
          },
          controls: {
            compass: true,
            myLocationButton: true,
            indoorPicker: true,
            zoom: true
          },
          styles: [{ backgroundColor: "white" }],
          gestures: {
            scroll: true,
            tilt: true,
            rotate: true,
            zoom: true
          }
        };
        this.map = this.googleMaps.create("map", mapOptions);
        this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
          this.map
            .addMarker({
              title: "You are here",
              icon: "red",
              animation: "DROP",
              position: coordinate
            })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                console.log("marker has been clicked");
              });
            });
        });
      })
      .catch(error => {});
  }
}
