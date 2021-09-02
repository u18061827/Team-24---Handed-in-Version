import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductStatuses, ProductTypes } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  server = 'https://localhost:44325/';

  //SaleId : number;
  Shared : number;

  setShared(data: number) {
    this.Shared = data
  }

  getShared()
  {
    return this.Shared;
  }


  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  //search products
  getProducts(): Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.server}Product/GetProducts`, this.httpOptions);
  }

  getIngredients(): Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.server}Product/GetIngredients`, this.httpOptions);
  }

  getPackages(): Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.server}Product/GetPackages`, this.httpOptions);
  }

  getDesserts(): Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.server}Product/GetDesserts`, this.httpOptions);
  }

  getSides(): Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.server}Product/GetSides`, this.httpOptions);
  }
    //get product types dropdown
  getproductTypes():  Observable<ProductTypes[]> {
    return this.http.get<ProductTypes[]>(`${this.server}Product/GetTypes`, this.httpOptions);
  }

  //get product types dropdown
  getproductStatuses():  Observable<ProductStatuses[]> {
    return this.http.get<ProductStatuses[]>(`${this.server}Product/GetStatuses`, this.httpOptions);
  }

  addProduct (contents: Product): Observable<any>
  {
    console.log(contents);
    return this.http.post<any>(this.server + 'Product/AddProduct',contents, this.httpOptions)
  }

  //get one product
  getOneProduct(Name:string): Observable<any>
  {
    var JSONObjectToSend = {"ProductName": Name};
    console.log("Testing service: " + Name);
    return this.http.post<any>(`${this.server}Product/GetOneProduct`,JSONObjectToSend, this.httpOptions);
  }

  //update product
  updateProduct(product: Product)
  {
    return this.http.put(`${this.server}Product/UpdateProduct`, product, this.httpOptions);
  }
}

