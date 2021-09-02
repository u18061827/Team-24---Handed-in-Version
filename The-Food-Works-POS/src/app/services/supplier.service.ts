import { SupplierCombined, SupplierTypes, OrderMethods, SupplierStatus, SuppAdd } from './../interfaces/supplier';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { Supplier } from '../interfaces/supplier';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }

  id:number;

  server = 'https://localhost:44325/';


  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  supplierId: number;
  //search suppliers
  getSuppliers(): Observable<Supplier[]> {
    console.log("Service works");

    return this.http.get<Supplier[]>(`${this.server}Supplier/GetSuppliers`, this.httpOptions);
  }

  getIngredients(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server}Product/GetIngredients`, this.httpOptions);
  }

  //get product types dropdown
  getSupplierTypes(): Observable<SupplierTypes[]> {
    return this.http.get<SupplierTypes[]>(`${this.server}Supplier/GetTypes`, this.httpOptions);
  }

  //get product types dropdown
  getOrderMethods(): Observable<OrderMethods[]> {
    return this.http.get<OrderMethods[]>(`${this.server}Supplier/GetOrderMethods`, this.httpOptions);
  }

  addSupplier(contents: SupplierCombined): Observable<any> {
    console.log(contents);
    return this.http.post<any>(this.server + 'Supplier/AddSupplier', contents, this.httpOptions);
  }

  findSupplier(id: number): Observable<Supplier> {
    this.supplierId = id;
    const JSONObjectToSend = { 'SupplierId': id };
    return this.http.post<any>(`${this.server}Supplier/FindSupplier`, JSONObjectToSend);
  }

  updateSupplier(contents: Supplier) {
    var res = this.http.post<any>(`${this.server}Supplier/UpdateSupplier`, contents, this.httpOptions);
    return res;
  }

  //get statuses dropdown
  getStatuses():  Observable<SupplierStatus[]> {
    return this.http.get<SupplierStatus[]>(`${this.server}Supplier/GetStatuses`, this.httpOptions);
  }


}
