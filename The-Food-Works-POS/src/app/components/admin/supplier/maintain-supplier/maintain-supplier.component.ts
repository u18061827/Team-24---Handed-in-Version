import { SupplierCombined } from './../../../../interfaces/supplier';
import { UpdateSupplierComponent } from './../update-supplier/update-supplier.component';
import { PlaceSupplierOrderComponent } from './../../supplier-order/place-supplier-order/place-supplier-order.component';
import { SupplierService } from './../../../../services/supplier.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Supplier } from 'src/app/interfaces/supplier';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maintain-supplier',
  templateUrl: './maintain-supplier.component.html',
  styleUrls: ['./maintain-supplier.component.scss']
})
export class MaintainSupplierComponent implements AfterViewInit {

  Suppliers: any;
  viewSupplier: any;
  //address: any;

  displayedColumns: string[] = ['SupplierName', 'SupplierVatNumber', 'SupplierContactNumber', 'SupplierEmailAddress', 'orderDay', 'OrderMethodName', 'addressBuildingNumber', 'update'];
  dataSource = new MatTableDataSource<Supplier>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public SupplierService: SupplierService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSuppliers();
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //all suppliers
  getSuppliers() {
    this.SupplierService.getSuppliers().subscribe(res => {
      this.Suppliers = res;
      console.log(res);
      this.dataSource.data = this.Suppliers;

      //override table filter
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return (
          data.SupplierName.toLowerCase().includes(filter)
        );
      };
    })
  }

  orderPlace: any;

  // updateSupplier(SupplierId: number) {
  //   console.log(SupplierId);
  //   return this.SupplierService.findSupplier(SupplierId).subscribe(res => {
  //     this.viewSupplier = res;
  //     console.log(res);
  //     const dialogRef = this.dialog.open(UpdateSupplierComponent, {
  //       disableClose: true,
  //       width: 'auto',
  //       data: {
  //         SupplierName: this.viewSupplier.supplierName,
  //         SupplierVatNumber: this.viewSupplier.supplierVatNumber,
  //         SupplierContactNumber: this.viewSupplier.supplierContactNumber,
  //         SupplierEmailAddress: this.viewSupplier.supplierEmailAddress,
  //         OrderMethodName: this.viewSupplier.orderMethodId,
  //         SupplierType: this.viewSupplier.supplierTypeId,
  //       }
  //     });

  //     dialogRef.afterClosed().subscribe(() => {
  //       console.log('The dialog was closed');
  //     });
  //   }
  // }

   //all suppliers
  //  getSuppliers()
  //  {
  //    console.log("Maintain TS works");
  //    this.SupplierService.getSuppliers().subscribe(res=>
  //      {
  //        this.Suppliers = res;
  //        //add 'data' in order to filter
  //        this.dataSource.data = this.Suppliers;

  //        //override table filter
  //        this.dataSource.filterPredicate = function(data, filter: string): boolean {
  //          return (
  //            data.SupplierName.toLowerCase().includes(filter)
  //          );
  //        };
  //      })
  //  }

  //   viewUpdate: SupplierCombined;
  //   findSupplier(SupplierVatNumber: string, SupplierName : string){
  //     return this.SupplierService.FindSupplier(SupplierVatNumber).subscribe(res => {
  //       this.viewUpdate = res;
  //       console.log (this.viewUpdate)
  //       const dialogRef = this.dialog.open(UpdateSupplierComponent, {
  //        disableClose: true,
  //        width: '1000px',
  //        height: '500px',
  //        data: {
  //         SupplierName: this.viewUpdate.supplier.SupplierName,
  //         SupplierVatNumber: this.viewUpdate.supplier.SupplierVatNumber,
  //         // SupplierContactNumber: this.viewUpdate.supplierContactNumber,
  //         // SupplierEmailAddress: this.viewUpdate.supplierEmailAddress,
  //         // OrderMethodId: this.viewUpdate.orderMethodId,
  //         // SupplierTypeId: this.viewUpdate.supplierTypeId,
  //         // SupplierStatusId: this.viewUpdate.supplierStatusId,
  //      }
  //      });
  //      console.log(this.viewUpdate.supplier.SupplierEmailAddress),


  //      dialogRef.afterClosed().subscribe(result => {
  //        console.log('The dialog was closed');

  //      });


  //    });
  // }


  //  orderPlace: any;
   placeSupplierOrder(SupplierVatNumber: string, SupplierName : string){
    const dialogRef = this.dialog.open(PlaceSupplierOrderComponent, {
      disableClose: true,
      width: '1100px',
      height: '500px',
      data: {SupplierVatNumber: SupplierVatNumber,
        SupplierName : SupplierName,
      }
    });
  }


}

