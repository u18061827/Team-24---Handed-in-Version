import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateBatchComponent } from './../update-batch/update-batch.component';
import { ManufacturingService } from './../../../../services/manufacturing.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

export interface PeriodicElement {
  batchID: string;
  cookingListDate: string;
  batchStatus: string;
}



@Component({
  selector: 'app-maintain-batch',
  templateUrl: './maintain-batch.component.html',
  styleUrls: ['./maintain-batch.component.scss']
})
export class MaintainBatchComponent implements AfterViewInit {

  batches: any;

  updateBatchDetails: any;

  displayedColumns: string[] = ['batchID', 'cookingListDate', 'batchStatus', 'edit'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private manufacturingService: ManufacturingService,public dialog: MatDialog,private router:Router, private _snackBar: MatSnackBar,) { }

  ngAfterViewInit(): void {
    this.getAllBatches();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllBatches()
  {
    this.manufacturingService.getBatches().subscribe(res =>{
      console.log(res);
      this.batches = res;
      this.dataSource.data = this.batches;
    })

  }

  openUpdateModal(batchId:any)
  {

    //console.log(batchId);

    this.manufacturingService.getBatchDetails(batchId).subscribe(res => {
      console.log(res);
      this.updateBatchDetails = res;
      /*const dialogRef = this.dialog.open(UpdateBatchComponent, {
        disableClose: true,
        width: 'auto',
        data: {
          BatchLines: this.updateBatchDetails,
      }
      });*/

      this.manufacturingService.batchDetailsForUpdate = this.updateBatchDetails;

      this.router.navigateByUrl('admin/maintain-batch/update-batch');

    },  (error: HttpErrorResponse) =>{
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');

    })


  }
}
