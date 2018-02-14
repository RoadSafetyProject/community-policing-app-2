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
import { IonicPage, ToastController } from "ionic-angular";
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
  speed: number = 0;
  constructor(
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation,
    private toastCtrl: ToastController
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
            zoom: 13,
            tilt: 0,
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
              this.geolocation.watchPosition({ timeout: 2000 }).subscribe(
                (position: any) => {
                  let coordinate = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  if (position.coords.speed) {
                    this.speed = position.coords.speed;
                  } else {
                    this.speed = 0;
                  }
                  var title = "Moving at a speed of ";
                  if (position.coords.speed) {
                    this.speed = position.coords.speed;
                    if (position.coords.speed > 20) {
                      title += position.coords.speed;
                      let toast = this.toastCtrl.create({
                        message: "Your Current Speed:" + position.coords.speed,
                        showCloseButton: true
                      });
                      toast.present();
                    }
                  } else {
                    title += "0";
                    this.speed = 0;
                  }
                  marker.setPosition(position.coords);
                  marker.setTitle(title);
                },
                error => {
                  console.log(JSON.stringify(error));
                  console.log("Fail to watch user position");
                }
              );
            });
        });
      })
      .catch(error => {});
  }
}
