import { userStatusDropDown } from './../interfaces/userStatusDropDown';
import { userEmployee } from './../interfaces/userEmployee';
import { User } from './../interfaces/user';
import { branchDropDown } from './../interfaces/branchDropDown';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../interfaces/employee';
import { userRoleDropDown } from '../interfaces/userRoleDropDown';




@Injectable({
  providedIn: 'root'
})


export class EmployeeServiceService {


  constructor(private http: HttpClient) { }

  
  server =  'https://localhost:44325/';
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  getAllEmployees(): Observable <Employee[]>
  {
    
    return this.http.get<Employee[]>(this.server + 'Employee/GetAllEmployees', this.httpOptions);

  }
  writeNewEmployee(toAddEmployee : userEmployee): Observable <userEmployee>
  {
    return this.http.post<userEmployee>(this.server + 'Employee/WriteNewEmployee',toAddEmployee, this.httpOptions);
  }



  updateEmployee(toUpdateEmployee : Employee): Observable <Employee>
  {
    return this.http.post<Employee>(this.server + 'Employee/UpdateEmployee',toUpdateEmployee, this.httpOptions);
  }
  
  updateUser(toUpdateUser: userEmployee): Observable<userEmployee>
  {
    return this.http.post<userEmployee>(this.server + 'Employee/UpdateUser', toUpdateUser, this.httpOptions);
  }

  getEmployeeDetais (EmployeeIdNumber : string): Observable <Employee>
  {
    console.log(EmployeeIdNumber);
    var JSONObjectToSend = {"EmployeeIdNumber": EmployeeIdNumber}
    return this.http.post<Employee>(this.server+ 'Employee/getEmployeeDetails', JSONObjectToSend, this.httpOptions);

  }

  getBranches(): Observable <branchDropDown[]>
  {
    return this.http.get<branchDropDown[]>(this.server + 'Employee/getBranches', this.httpOptions);
  }

  getUserRoles(): Observable <userRoleDropDown[]>
  {
    return this.http.get<userRoleDropDown[]>(this.server + 'Employee/getUserRoles', this.httpOptions);
  }

  getUserStatus(): Observable <userStatusDropDown[]>
  {
    return this.http.get<userStatusDropDown[]>(this.server + 'Employee/getUserStatus', this.httpOptions);
  }









}
