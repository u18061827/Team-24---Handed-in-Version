import { ResetPassword, ForgotPassword } from './../interfaces/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../interfaces/customer';
import { User, OTP, UserInfo } from '../interfaces/user';
import { Branch } from '../interfaces/report';

export interface Notification {
  notification: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  OTPEmail: string;
  userInfo: UserInfo;
  link: string;
  OTPobj: OTP = {
    OTP: 1234,
    user: 'dummy@gmail.com'
  };
  ResetObj: ResetPassword;
  server = 'https://localhost:44325/';

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    withCredentials: true,
    observe: 'response' as 'body',

  };

  constructor(private http: HttpClient) { }

  Register(user: Customer) {
    return this.http.post<Customer>(`${this.server}Customer/RegisterCustomer`, user, this.httpOptions);
  }

  Login(user: User): Observable<UserInfo> {
    return this.http.post(`${this.server}User/Login`, user, { observe: 'response' })
      .pipe(
        map(res => {
          this.userInfo = (res.body as UserInfo);
          return this.userInfo;
        })
      );

    // return  this.http.post <HttpResponse<<User>>(`${this.server}User/Login`, user, this.httpOptions);

  }

  Logout() {
    return this.http.get(`${this.server}User/LogOut`, this.httpOptions);
  }

  //generate notification
  generateNotification(): Observable<Notification> {
    return this.http.get<Notification>(`${this.server}SupplierOrder/GenerateNotification`);
  }

  ForgotPassword(obj: ForgotPassword) {
    console.log(obj);
    return this.http.post<ForgotPassword>(`${this.server}User/ForgotPassword`, obj, this.httpOptions);
  }

  ResetPassword(obj: ResetPassword) {
    return this.http.post<ResetPassword>(`${this.server}User/ResetPassword`, obj, this.httpOptions);
  }

  MustMatch(obj: ResetPassword) {
    let noErrors = false;
    if (obj.newPassword === obj.confirmPassword) {
      noErrors = true;
      return noErrors;
    }
    else {
      noErrors = false;
      return noErrors;
    }
  }

  CheckOTP(input: number) {
    debugger;
    this.OTPobj.OTP = input;
    this.OTPobj.user = this.OTPEmail;

    return this.http.post<any>(`${this.server}User/CheckOTP`, this.OTPobj, this.httpOptions);
  }


}
