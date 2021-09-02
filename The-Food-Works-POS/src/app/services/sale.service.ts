import { SaleLine } from './../interfaces/sale';
import { ProductSale } from 'src/app/interfaces/sale';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  server =  'https://localhost:44325/';
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  getAllEmployees(): Observable <Sale[]>
  {
    
    return this.http.get<Sale[]>(this.server + 'Sale/GetAllSales', this.httpOptions);

  }

  getMainMeals() : Observable <any[]>
  {
    return this.http.get<any[]>(this.server + 'Sale/GetMainMeals', this.httpOptions)
  }

  getSides() : Observable <any[]>
  {
    return this.http.get<any[]>(this.server + 'Sale/GetSides', this.httpOptions)
  }

  getDesserts() : Observable <any[]>
  {
    return this.http.get<any[]>(this.server + 'Sale/GetDesserts', this.httpOptions)
  }

  getSelectedProduct(productToSearch: ProductSale): Observable<SaleLine>
  {
    return this.http.post<SaleLine>(this.server + 'Sale/GetSelectedProduct',productToSearch, this.httpOptions)
  }

  getVATpercentage():Observable<any>{
    return this.http.get<any>(this.server + 'Sale/GetVATpercentage', this.httpOptions)
  }

  callPayment(paymentType:string): Observable<any>
  {
    return this.http.get<any>(this.server + 'Sale/CallPayment', this.httpOptions)
  }

  writeSale (saleLines: Sale): Observable<any>
  {
    console.log(saleLines);
    return this.http.post<any>(this.server + 'Sale/WriteSale',saleLines, this.httpOptions)

  }

  emailReceipt(completedSale: Sale): Observable<any>
  {
    console.log(completedSale);
    return this.http.post<any>(this.server + 'Sale/EmailReceipt',completedSale, this.httpOptions)

  }

}
