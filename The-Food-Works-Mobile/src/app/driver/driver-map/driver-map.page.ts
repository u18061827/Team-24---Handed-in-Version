import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapDirectionsService, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DriverService } from 'src/app/services/driver.service';

export interface MapDirectionsResponse {
  status: google.maps.DirectionsStatus;
  result?: google.maps.DirectionsResult;
}

const waypts: google.maps.DirectionsWaypoint[] = [
  // {location: new google.maps.LatLng(-25.975300, 28.118870)}
];

@Component({
  selector: 'app-driver-map',
  templateUrl: './driver-map.page.html',
  styleUrls: ['./driver-map.page.scss'],
})
export class DriverMapPage implements OnInit {

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  // My variables
  orderID: any;
  address: any;

  // google maps zoom level
  zoom = 12;

  // initial center position for the map
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    disableDefaultUI: true,
  };

  directionOptions: google.maps.DirectionsRendererOptions = {
    suppressMarkers: true
  };

  readonly directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  markerPositions: any = [{
    coords: { lat: -25.864798431703196, lng: 28.16656588444456 }
  }];

  theFoodWorksCenturion = { lat: -25.864798431703196, lng: 28.16656588444456 };

  constructor(mapDirectionsService: MapDirectionsService, private toast: ToastController,
              private service: DriverService, private router: Router) {
    const request: google.maps.DirectionsRequest = {
      destination: this.theFoodWorksCenturion,
      origin: this.theFoodWorksCenturion,
      waypoints: waypts,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };

    this.directionsResults$ = mapDirectionsService.route(request).pipe(map(response => response.result));
  }

  // addMarker(event: google.maps.MapMouseEvent) {
  //   this.markerPositions.push(event.latLng.toJSON());
  // }

  openInfoWindow(marker: MapMarker, saleID: any, address: any) {
    if (saleID != null){
      this.orderID = saleID;
      this.address = address;
      this.infoWindow.open(marker);
    }
  }

  ngOnInit() {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.center = {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    //   };
    // });

    this.service.waypoints.forEach(element => {
      waypts.push({
        location: new google.maps.LatLng(element.lat, element.lng)
      });

      this.markerPositions.push({
        saleID: element.saleID,
        address: element.address,
        coords: { lat: element.lat, lng: element.lng }
      });
    });
  }

  doComplete() {
    this.service.setSaleID(this.orderID);
    this.router.navigateByUrl('complete-delivery');
  }
}
