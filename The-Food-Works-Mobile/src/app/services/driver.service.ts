import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICompleteDelivery, IWayPoints } from '../interfaces/delivery';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  // Page commmunication variables
  employeeID: number;
  waypoints: IWayPoints[];
  saleID: number;


  constructor(private http: HttpClient) { }

  // Page communication

  setEmployeeID(data: any) {
    this.employeeID = data;
  }

  setWaypoints(data: any) {
    this.waypoints = data;
  }

  setSaleID(data: any) {
    this.saleID = data;
  }

  setLogout() {
    this.employeeID = null;
    this.waypoints = null;
    this.saleID = null;
  }

  // API endpoint calls
  getRoute() {
    return this.http.post(environment.baseURI + 'Delivery/GetRoute', this.employeeID);
  }

  getCompleteInfo() {
    return this.http.post(environment.baseURI + 'Delivery/GetCompleteInfo', this.saleID);
  }

  completeDelivery(sign: any) {
    const body: ICompleteDelivery = {
      saleID: this.saleID,
      signature: sign
    };
    return this.http.post(environment.baseURI + 'Delivery/CompleteDelivery', body);
  }

  returnDelivery() {
    return this.http.post(environment.baseURI + 'Delivery/ReturnDelivery', this.saleID);
  }
}
