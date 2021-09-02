import { UpdateBatchComponent } from './../components/admin/manufacturing/update-batch/update-batch.component';
import { ProductsNeeded, BatchLine } from './../interfaces/manufacturing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookingList } from '../interfaces/manufacturing';

@Injectable({
  providedIn: 'root'
})
export class ManufacturingService {

  constructor(private http: HttpClient) { }

  
  server =  'https://localhost:44325/';
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };


  cookingLists: any = [];
  batchDetailsForUpdate: any;

  getAllCookingLists(): Observable <CookingList[]>
  {
    return this.http.get<CookingList[]>(this.server + 'Manufacturing/GetAllCookingLists', this.httpOptions);
  }

  addCookingList(cookingList: CookingList): Observable <any>
  {
    //console.log(cookingList);
    return this.http.post<any>(this.server + 'Manufacturing/AddCookingList',cookingList, this.httpOptions);
  }


  getProductsNeeded(): Observable<ProductsNeeded[]>
  {
    return this.http.get<ProductsNeeded[]>(this.server + 'Manufacturing/GetProductsNeeded', this.httpOptions);
  }

  writeBatch(batch:BatchLine)
  {
    console.log(batch);
    return this.http.post<any>(this.server + 'Manufacturing/WriteBatch',batch, this.httpOptions);

  }

  getBatches(): Observable<BatchLine[]>
  {
    return this.http.get<BatchLine[]>(this.server + 'Manufacturing/GetBatches', this.httpOptions);
  }

  getBatchDetails(batchId:number): Observable<BatchLine[]>
  {
    console.log (batchId);

    return this.http.post<BatchLine[]>(this.server + 'Manufacturing/GetBatchDetails',batchId, this.httpOptions);
    

  }

  updateBatchDetails(updatedBatch:BatchLine): Observable<BatchLine[]>
  {
    return this.http.post<BatchLine[]>(this.server + 'Manufacturing/UpdateBatchDetails',updatedBatch, this.httpOptions);

  }

  getEmployees (): Observable<any[]>
  {
    return this.http.get<any[]>(this.server + 'Manufacturing/GetEmployees', this.httpOptions);
  }

  getCookingListDetails(): Observable<any[]>
  {
    return this.http.get<any[]>(this.server + 'Manufacturing/GetCookingListDetails', this.httpOptions);
  }

  reconcileBatch(batch:BatchLine)
  {
    console.log(batch);
    return this.http.post<any>(this.server + 'Manufacturing/ReconcileBatch',batch, this.httpOptions);

  }
}
