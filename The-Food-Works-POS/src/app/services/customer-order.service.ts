import { CustomerOrder, SalePaymentType } from './../interfaces/customerOrder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaleStatuses } from '../interfaces/saleStatus';
//import { SalePaymentType } from '../interfaces/salePaymentType';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  constructor(private http: HttpClient) { }
  server = 'https://localhost:44325/';


  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  //search customer orders
  getCustomerOrders(): Observable<CustomerOrder[]>
  {
    return this.http.get<CustomerOrder[]>(`${this.server}CustomerOrderAdmin/GetCustomerOrders`, this.httpOptions);
  }

  //get sale status dropdown
  getsaleStatuses():  Observable<SaleStatuses[]> {
    return this.http.get<SaleStatuses[]>(`${this.server}CustomerOrderAdmin/GetSaleStatuses`, this.httpOptions);
  }

  //get one Order
  getOneOrder(Shared:number): Observable<CustomerOrder>
  {
    var JSONObjectToSend = {"SaleId": Shared};
    console.log("Testing service: " + Shared);
    return this.http.post<CustomerOrder>(`${this.server}CustomerOrderAdmin/GetOneOrder`,JSONObjectToSend, this.httpOptions);
  }

  //update customer order (status)
  updateCustomerOrder(customerOrd: CustomerOrder)
  {
    return this.http.put(`${this.server}CustomerOrderAdmin/updateCustomerOrder`, customerOrd, this.httpOptions);
  }

}
