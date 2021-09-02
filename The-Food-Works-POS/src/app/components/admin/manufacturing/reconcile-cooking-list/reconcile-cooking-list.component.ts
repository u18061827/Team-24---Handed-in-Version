import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CookingList, BatchLine } from './../../../../interfaces/manufacturing';
import { ManufacturingService } from 'src/app/services/manufacturing.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-reconcile-cooking-list',
  templateUrl: './reconcile-cooking-list.component.html',
  styleUrls: ['./reconcile-cooking-list.component.scss']
})
export class ReconcileCookingListComponent implements AfterViewInit {

  employees: any;
  cookingList: any;
  clDetails: CookingList;
  batchId: any;

  productsToUpdate: any =[];

  quantity:any = [];
  selectedValue:any = [];

  displayedColumns: string[] = ['productName', 'quantityProduced', 'reconcileQuantity'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private manufacturingService: ManufacturingService,private _snackBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.manufacturingService.getEmployees().subscribe(res => {
      console.log (res);
      this.employees = res;
    },  (error: HttpErrorResponse) =>{
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

    })

    this.manufacturingService.getCookingListDetails().subscribe(res => {
      console.log (res);
      this.cookingList = res;
    
      this.dataSource.data = this.cookingList;
    
    },  (error: HttpErrorResponse) =>{
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

    })
  }
  reconcileQuantity(row: any, quantity: any)
  {
    var product :BatchLine =
    {
      ProductId: row.ProductId,
      Quantity: quantity,

    };

    this.batchId = row.BatchId;


    this.productsToUpdate.push(product);

    

  }
  reconcileBatch( employee:any)
  {
    if(employee != null)
    {
    var detailsToUpdate: BatchLine =
    {
      BatchLines: this.productsToUpdate,
      EmployeeID: employee,
      BatchId : this.batchId,

    };

    this.manufacturingService.reconcileBatch(detailsToUpdate).subscribe(res => {
      console.log(res)
    },  (error: HttpErrorResponse) =>{
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

    })
    }
    else{
      this._snackBar.open('Please selcet and employee', 'OK');
    }
}

  
}
