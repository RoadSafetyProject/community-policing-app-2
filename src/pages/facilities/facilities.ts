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
import { HttpClientProvider } from "../../providers/http-client/http-client";

/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-facilities",
  templateUrl: "facilities.html"
})
export class FacilitiesPage implements OnInit {
  map: GoogleMap;
  constructor(
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation,
    private http: HttpClientProvider
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
            zoom: 10,
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
              marker.showInfoWindow();
              marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                console.log("marker has been clicked");
              });
            });
          this.loadHospitals();
          this.loadFireStations();
          this.loadPoliceStations();
        });
      })
      .catch(error => {});
  }

  loadHospitals() {
    this.http
      .get(
        "organisationUnits.json?fields=*&filter=organisationUnitGroups.name:eq:Hospitals"
      )
      .subscribe(
        data => {
          let organisationUnits = data.json().organisationUnits;
          organisationUnits.forEach(organisationUnit => {
            if (organisationUnit.coordinates) {
              let coords = eval(organisationUnit.coordinates);
              let coordinate = {
                lat: coords[0],
                lng: coords[1]
              };
              this.map
                .addMarker({
                  title: organisationUnit.name,
                  icon: "blue", //yellow,blue,green
                  animation: "DROP",
                  position: coordinate
                })
                .then(marker => {
                  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                    console.log(
                      "marker has been clicked : " + organisationUnit.name
                    );
                  });
                });
            }
          });
        },
        error => {}
      );
  }

  loadFireStations() {
    this.http
      .get(
        "organisationUnits.json?fields=*&filter=organisationUnitGroups.name:eq:PoliceStations"
      )
      .subscribe(
        data => {
          let organisationUnits = data.json().organisationUnits;
          organisationUnits.forEach(organisationUnit => {
            if (organisationUnit.coordinates) {
              let coords = eval(organisationUnit.coordinates);
              let coordinate = {
                lat: coords[0],
                lng: coords[1]
              };
              this.map
                .addMarker({
                  title: organisationUnit.name,
                  icon: "yellow", //yellow,blue,green
                  animation: "DROP",
                  position: coordinate
                })
                .then(marker => {
                  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                    console.log(
                      "marker has been clicked : " + organisationUnit.name
                    );
                  });
                });
            }
          });
        },
        error => {}
      );
  }

  loadPoliceStations() {
    this.http
      .get(
        "organisationUnits.json?fields=*&filter=organisationUnitGroups.name:eq:PoliceStations"
      )
      .subscribe(
        data => {
          let organisationUnits = data.json().organisationUnits;
          organisationUnits.forEach(organisationUnit => {
            if (organisationUnit.coordinates) {
              let coords = eval(organisationUnit.coordinates);
              let coordinate = {
                lat: coords[0],
                lng: coords[1]
              };
              this.map
                .addMarker({
                  title: organisationUnit.name,
                  icon: "green", //yellow,blue,green
                  animation: "DROP",
                  position: coordinate
                })
                .then(marker => {
                  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                    console.log(
                      "marker has been clicked : " + organisationUnit.name
                    );
                  });
                });
            }
          });
        },
        error => {}
      );
  }
}
