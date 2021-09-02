import { SupplierOrder } from './../interfaces/supplierOrder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {

  constructor(private http: HttpClient) { }
  server = 'https://localhost:44325/';

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  //search supplier orders
  getSupplierOrders(): Observable<SupplierOrder[]>
  {
    return this.http.get<SupplierOrder[]>(`${this.server}SupplierOrder/GetSupplierOrders`, this.httpOptions);
  }

    //get one Supplier Order
    getOneSupplierOrder(Shared:number): Observable<SupplierOrder>
    {
      var JSONObjectToSend = {"SupplierOrderId": Shared};
      console.log("Testing Supplier Order service: " + Shared);
      return this.http.post<SupplierOrder>(`${this.server}SupplierOrder/GetOneSupplierOrder`,JSONObjectToSend, this.httpOptions);
    }

  getIngredients(): Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.server}Product/GetIngredients`, this.httpOptions);
  }

  //update supplier order
  updateSupplierOrder(supplierOrd: SupplierOrder): Observable<any>
  {
    console.log("SENDING TO API" + supplierOrd)
    return this.http.post<SupplierOrder>(`${this.server}SupplierOrder/UpdateSupplierOrder`, supplierOrd, this.httpOptions);
  }

  //place supplier order
  placeSupplierOrder (supplierOrd: SupplierOrder): Observable<any>
  {
    console.log("SENDING TO API" + supplierOrd)
    return this.http.post<any>(this.server + 'SupplierOrder/PlaceSupplierOrder', supplierOrd, this.httpOptions)
  }

  //email supplier
  placeSupplierOrderEmail(ord: SupplierOrder): Observable<any>
  {
    console.log(ord);
    return this.http.post<any>(this.server + 'SupplierOrder/PlaceSupplierOrderEmail',ord, this.httpOptions)
  }

}
