import { Component } from '@angular/core';
import { HttpClient } from '../../services/httpclient';
import {Events} from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent,GoogleMapsLatLng,GoogleMapsMarkerOptions,GoogleMapsMarker } from 'ionic-native';

//declare let L: any;

@Component({
  templateUrl: 'build/pages/facilities/facilities.html',
  providers: [HttpClient]
})
export class FacilitiesPage {

  map: GoogleMap;
  constructor(private http:HttpClient,public events: Events) {
    /**/
  }
  ngAfterViewInit(){
    let location = new GoogleMapsLatLng(-6.3690,34.8888);

    this.map = new GoogleMap('map', {
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
      this.http.get("organisationUnits.json?fields=*&filter=organisationUnitGroups.name:eq:Hospitals")
        .subscribe(data => {
          alert("Here1");
          let organisationUnits = data.json().organisationUnits;
          organisationUnits.forEach(organisationUnit =>{
            if(organisationUnit.coordinates){
              let coords = eval(organisationUnit.coordinates);
              let markerOptions: GoogleMapsMarkerOptions = {
                position: new GoogleMapsLatLng(coords[0],coords[1]),
                title: organisationUnit.name
              };
              this.map.addMarker(markerOptions).then(
                (marker: GoogleMapsMarker) => {
                  marker.showInfoWindow();
                })
            }
            alert("Here2");
          },error => {
            alert("ERROR:" + error);
          })
        });
    });
  }
}
