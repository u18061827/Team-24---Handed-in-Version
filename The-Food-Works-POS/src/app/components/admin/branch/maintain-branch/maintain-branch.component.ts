import { HttpErrorResponse } from '@angular/common/http';
import { BranchService } from './../../../../services/branch.service';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Import Interfaces
import { Branch } from 'src/app/interfaces/branch';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-maintain-branch',
  templateUrl: './maintain-branch.component.html',
  styleUrls: ['./maintain-branch.component.scss']
})
export class MaintainBranchComponent implements OnInit {

  // Initialize Maintain Branch Table
  private subs = new Subscription();
  displayedColumns: string[] = ['branchId', 'branchName', 'branchStatus', 'dateCreated', 'viewUpdate'];
  public dataSource: MatTableDataSource<Branch>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dataArray: any;

  constructor(private branchService: BranchService) { }

  ngOnInit() {

    // Subscribe to "getBranchData" service method and populate Maintain Branch Table
    this.subs.add(this.branchService.getBranchData().subscribe(
      (resp: any) => {
        this.dataArray = resp;
        this.dataSource = new MatTableDataSource<Branch>(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    ))

  }

  // Search filter for Maintain Branch table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

