/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICustomer, IResetPassword, User } from '../interfaces/access';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  email: string;

  httpOptions = {
    headers: new HttpHeaders({
      contentType: 'application/json'
    })
  };

  private _isAuthenticated = false;

  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post<User>(environment.baseURI + 'User/Login', user, this.httpOptions);
  }

  doAuthenticate() {
    return this._isAuthenticated = true;
  }

  doLogout() {
    return this._isAuthenticated = false;
  }

  getAuthentication() {
    return this._isAuthenticated;
  }

  registerCustomer(formData: any) {
    const body: ICustomer = {
      CustomerName: formData.CustomerName,
      CustomerSurname: formData.CustomerSurname,
      CustomerDob: formData.CustomerDob,
      CustomerTelephone: formData.CustomerTelephone,
      CustomerEmail: formData.CustomerEmail,
      IsLoyaltyProgram: formData.IsLoyaltyProgram,
      StreetNumber: formData.StreetNumber,
      StreetName: formData.StreetName,
      City: formData.City,
      PostalCode: formData.PostalCode,
      Province: formData.Province,
      Lat: formData.Lat,
      Lng: formData.Lng,
      Password: formData.Password,
    };
    return this.http.post(environment.baseURI + 'Customer/RegisterCustomer', body);
  }

  forgotPassword(body: any) {
    this.email = body;
    return this.http.post(environment.baseURI + 'User/ForgotPassword', body);
  }

  checkOTP(otp: any) {
    const body = {
      email: this.email,
      OTP: otp
    };
    return this.http.post(environment.baseURI + 'User/CheckOTP', body);
  }

  resetPassword(formData: any) {
    const body: IResetPassword = {
      CurrentPassword: formData.currentPassword,
      email: formData.email,
      NewPassword: formData.newPassword,
      ConfirmPassword: formData.confirmPassword
    };
    return this.http.post(environment.baseURI + 'User/ResetPassword', body);
  }
}
