import { Product, SelectedProduct } from './../../../../interfaces/admin';
import { Component, ViewChild, AfterViewInit, OnInit, NgModule } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { AdminService } from 'src/app/services/admin/admin.service';
import { BranchProduct } from 'src/app/interfaces/admin';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WriteOffDetailsComponent } from '../write-off-details/write-off-details.component';
import { Router } from '@angular/router';

import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-write-off',
  templateUrl: './write-off.component.html',
  styleUrls: ['./write-off.component.scss']
})
export class WriteOffComponent implements OnInit {
  constructor(public adminService: AdminService, public dialog: MatDialog, private router: Router) { }

  selectedProducts: SelectedProduct[] = [];
  temp: number[] = [];
  created = false;
  viewProduct: any;
  Products: any;
  branchData: any;
  displayedColumns: string[] = ['ID', 'name', 'description', 'QOH', 'Select'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  selected = new FormControl(false);
  ngOnInit() {
    this.getAllProducts();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getAllProducts() {
    this.adminService.getProducts().subscribe(res => {
      this.branchData = res;
      this.dataSource.data = this.branchData;
      console.log(res);
    });
    this.created = true;
  }
  change(event: any) {
    const checked = document.getElementById('box');
    if (event) {
      console.log(event.source.value, event.source.selected); // checked?.onchange === true

      if (event.source.selected === false) {
        console.log('This is false - no modal');
      }
      else {
        // this.openModal();
        console.log('This is true - show modal');
        // this.pid = event.source.value;
      }
    }
  }

  AddToList(SelectedId: number, BranchId: number, checkbox: MatCheckbox) {
    const isAdding = !checkbox.checked;
    // this.adminService.branchId = BranchId;
    console.log(BranchId);
    if (isAdding) {
      this.selectedProducts.push({ BranchId, SelectedId });
    }
    else {
      for (let i = 0; i < this.selectedProducts.length; i++) {
        const tmpObj = this.selectedProducts[i];
        if (tmpObj.SelectedId === SelectedId && tmpObj.BranchId === BranchId) {
          this.selectedProducts.splice(i, 1);
          console.log(this.selectedProducts);
          break;
        }
      }
    }
  }

  sendList() {
    return this.adminService.findProduct(this.selectedProducts).subscribe(res => {
      this.adminService.products = [];
      this.adminService.products.push(res);
      console.log(this.adminService.products);
      this.router.navigateByUrl('admin/write-off-details');
    });
  }
}
