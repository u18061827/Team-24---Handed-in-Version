import { Module } from './../../interfaces/training';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleType } from 'src/app/interfaces/training';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  moduleType: ModuleType ;
  server = 'https://localhost:44325/';
   httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    // withCredentials: true,
    // observe: 'response' as 'body',

  };

  constructor(private http: HttpClient) { }

  getAllTypes(): Observable<ModuleType[]>
  {
    return this.http.get<ModuleType[]>(`${this.server}Training/getAllTypes`, this.httpOptions);
  }
  getTypeDetails(id: number): Observable<ModuleType>
  {
    const JSONObjectToSend = { 'ID': id };
    return this.http.post<ModuleType>(`${this.server}Training/getTypeDetails`, JSONObjectToSend, this.httpOptions);
  }
  updateType(type: any)
  {
    return this.http.post<any>(`${this.server}Training/updateType`, type, this.httpOptions);
  }
  addType(type: ModuleType)
  {
    console.log(type);
    return this.http.post<ModuleType>(`${this.server}Training/addType`, type, this.httpOptions);
  }
  deleteType(type: ModuleType)
  {
    return this.http.post<ModuleType>(`${this.server}Training/deleteType`, type, this.httpOptions);
  }

  // Connect to "CreateTrainingModule" endpoint
  // Adds a new training module to the system
  createTrainingModule(module: any)
  {
    console.log(module)
    const body: Module = {
      TrainingModuleId: 0,
      ModuleName: module.name,
      ModuleType: module.type,
      ModuleLanguage: module.language,
      ModuleDuration: module.duration,
      ModuleDescription: module.description,
      ModuleContentVideo: module.video,
      ModuleContentText: module.text,
      ModuleContentImage: module.image,
      ContentOrder: module.content,
      TrainingModuleCompleted: false,
      TimeElapsed: 0,
      DateCompleted: new Date()
    }
    return this.http.post(`${this.server}Training/CreateTrainingModule`, body, this.httpOptions);
  }

  getTrainingModuleList(employeeId: any)
  {
    return this.http.get(`${this.server}Training/GetTrainingModuleList/` + employeeId, this.httpOptions);
  }

  getTrainingModule(moduleId: any, employeeId: any)
  {
    console.log(moduleId);
    console.log(employeeId);
    return this.http.get(`${this.server}Training/GetTrainingModule/` + moduleId + '/' + employeeId);
  }
}
