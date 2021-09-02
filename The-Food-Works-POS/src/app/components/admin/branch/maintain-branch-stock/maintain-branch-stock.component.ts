import { BranchService } from './../../../../services/branch.service';
import { Subscription } from 'rxjs';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Import Interfaces
import { BranchProduct } from 'src/app/interfaces/admin';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-maintain-branch-stock',
  templateUrl: './maintain-branch-stock.component.html',
  styleUrls: ['./maintain-branch-stock.component.scss']
})
export class MaintainBranchStockComponent implements OnInit {

  // Data Member to Hold Currently Logged in Branch ID
  currentBranchId: any;

  // Initialize Maintain Branch Stock Table
  private subs = new Subscription();
  displayedColumns: string[] = ['id', 'type', 'name', 'quantity', 'baseline', 'urgency', 'status'];
  public dataSource: MatTableDataSource<BranchProduct>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dataArray: any;

  constructor(private branchService: BranchService) { }

  ngOnInit(): void {
    this.populateTable()
  }

  async populateTable() {
    const id = this.branchService.getBranchId();
    id.subscribe(resp => {
      // Subscribe to "getBranchData" service method and populate Maintain Branch Table
      this.subs.add(this.branchService.getBranchStock(resp).subscribe(
        (resp: any) => {
          this.dataArray = resp;
          this.dataSource = new MatTableDataSource<BranchProduct>(this.dataArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      ))
    })
  }

  // Search Filter for Maintain Branch Stock Table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}


