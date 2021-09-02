/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../interfaces/product';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart, ICartFilter, ICartItem } from '../interfaces/cart';
import { ICheckoutData } from '../interfaces/checkout';
import { IOrder, IOrderFilter } from '../interfaces/orders';
import { IReviewData } from '../interfaces/review';
import { ICustomer } from '../interfaces/access';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // Page commmunication variaables
  branchID: number;
  productID: number;
  customerID: number;
  orderID: number;
  quantity: number;
  vatPercentage: number;

  constructor(private http: HttpClient) { }

  // Page communication
  setBranchID(data: any) {
    this.branchID = data;
  }

  setProductID(data: any) {
    this.productID = data;
  }

  setCustomerID(data: any) {
    this.customerID = data;
  }

  setOrderID(data: any) {
    this.orderID = data;
  }

  setQuantity(data: any) {
    this.quantity = data;
  }

  setLogout() {
    this.productID = null;
    this.customerID = null;
    this.orderID = null;
    this.quantity = null;
  }

  // API endpoint calls
  getBranchData() {
    return this.http.get(environment.baseURI + 'CustomerOrder/GetBranchLocation');
  }

  getAllProducts() {
    return this.http.post(environment.baseURI + 'CustomerOrder/GetProducts', this.branchID);
  }

  getProduct(): Observable<IProduct> {
    return this.http.get<IProduct>(environment.baseURI + 'CustomerOrder/GetProduct/' + this.productID + '/' + this.branchID).pipe();
  }

  addToCart() {
    const body: Cart = {
      branchID: this.branchID,
      customerID: this.customerID,
      productID: this.productID,
      quantity: this.quantity,
    };
    console.log(body);
    return this.http.post(environment.baseURI + 'CustomerOrder/AddToCart', body);
  }

  getAllCartItems() {
    const body: ICartFilter = {
      cartID: this.customerID,
      branchID: this.branchID
    };
    return this.http.post(environment.baseURI + 'CustomerOrder/GetCart', body);
  }

  clearCart() {
    const body: ICartFilter = {
      cartID: this.customerID,
      branchID: this.branchID
    };
    return this.http.post(environment.baseURI + 'CustomerOrder/ClearCart', body);
  }

  removeItem(removeID: any) {
    const body: ICartFilter = {
      cartID: this.customerID,
      branchID: this.branchID,
      productID: removeID
    };
    return this.http.post(environment.baseURI + 'CustomerOrder/RemoveItem', body);
  }

  getVAT(): any {
    this.http.get(environment.baseURI + 'CustomerOrder/GetVAT').subscribe((res: any) => {
      this.vatPercentage = res;
    });
  }

  doCheckout(data: any) {
    const body: ICheckoutData = {
      token: data.token,
      amount: data.amount,
      customerID: data.customerID,
      completionMethod: data.completionMethod,
      paymentMethod: data.paymentMethod,
      branchID: this.branchID
    };
    return this.http.post(environment.baseURI + 'CustomerOrder/Checkout', body);
  }

  getAllOrders() {
    const body: IOrderFilter = {
      customerID: this.customerID,
      orderDate: new Date().getFullYear()
    };
    return this.http.post(environment.baseURI + 'CustomerOrder/GetOrders', body);
  }

  getOrder(): Observable<IOrder> {
    return this.http.get<IOrder>(environment.baseURI + 'CustomerOrder/GetOrder/' + this.orderID).pipe();
  }

  doReview(formData: any) {
    const body: IReviewData = {
      ratingStars: formData.rating,
      ratingOverview: formData.feedback,
      customerID: this.customerID,
      productID: this.productID
    };
    return this.http.post(environment.baseURI + 'CustomerOrder/DoReview', body);
  }

  getCustomerToUpdate() {
    return this.http.get(environment.baseURI + 'Customer/GetCustomerToUpdate/' + this.customerID);
  }

  doUpdateCustomer(formData: any) {
    const body: ICustomer = {
      CustomerID: this.customerID,
      CustomerName: formData.CustomerName,
      CustomerSurname: formData.CustomerSurname,
      CustomerDob: formData.CustomerDob,
      CustomerTelephone: formData.CustomerTelephone,
      IsLoyaltyProgram: formData.IsLoyaltyProgram,
      StreetNumber: formData.StreetNumber,
      StreetName: formData.StreetName,
      City: formData.City,
      PostalCode: formData.PostalCode,
      Province: formData.Province,
      Lat: formData.Lat,
      Lng: formData.Lng,
    };
    return this.http.post(environment.baseURI + 'Customer/UpdateCustomer', body);
  }
}
