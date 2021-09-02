import { Component, ViewChild, AfterViewInit, OnInit, NgModule } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { AdminService } from 'src/app/services/admin/admin.service';
import { BranchProduct, Product } from 'src/app/interfaces/admin';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Audit } from 'src/app/interfaces/audit';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  constructor(public adminService: AdminService, public dialog: MatDialog, private router: Router) { }
  temp: number[] = [];
  created = false;
  viewProduct: any;
  Products: any;
  branchData: any;
  displayedColumns: string[] = ['ID', 'TIMESTAMP', 'TYPE', 'ACTION', 'CONTROLLER', 'REQUEST BODY'];
  dataSource = new MatTableDataSource<Audit>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.getAllAudits();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllAudits() {
    this.adminService.getAudits().subscribe(res => {
      this.branchData = res;
      this.dataSource.data = this.branchData;
      console.log(res);
    });
    this.created = true;
  }

}

