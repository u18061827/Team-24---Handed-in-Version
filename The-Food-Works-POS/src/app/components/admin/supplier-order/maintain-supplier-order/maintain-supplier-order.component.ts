import { ReceiveSupplierOrderComponent } from './../receive-supplier-order/receive-supplier-order.component';
import { SupplierOrderService } from './../../../../services/supplier-order.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SupplierOrder } from 'src/app/interfaces/supplierOrder';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'maintain-supplier-order',
  templateUrl: './maintain-supplier-order.component.html',
  styleUrls: ['./maintain-supplier-order.component.scss']
})
export class MaintainSupplierOrderComponent implements AfterViewInit {
  SupplierOrders: any;
  viewOrderUpdate : any;
  form : FormGroup;

  displayedColumns: string[] = ['SupplierOrderId', 'SupplierName', 'ProductName', 'SupplierOrderLineQuantity', 'SupplierOrderDate', 'SupplierOrderStatusName', 'receive'];
  dataSource = new MatTableDataSource<SupplierOrder>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog,private SupplierOrderService : SupplierOrderService) { }

  ngOnInit(): void {
    this.getSupplierOrders();
    this.form = this.formBuilder.group({
      SupplierOrderId: [null],
      productsNames: [null],
      quantities: [null],
      })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //all supplier orders
  getSupplierOrders()
  {
    console.log("Maintain TS works");
    this.SupplierOrderService.getSupplierOrders().subscribe(res=>
      {
        this.SupplierOrders = res;
        //add 'data' in order to filter
        this.dataSource.data = this.SupplierOrders;

        //override table filter
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return (
            data.SupplierOrderId.toString().includes(filter)
          );
        };
      })
  }

    //For receiving the order
    getOneOrder(SupplierOrderId: number)
    {
      return this.SupplierOrderService.getOneSupplierOrder(SupplierOrderId).subscribe(res => {
        this.viewOrderUpdate = res;
       console.log (this.viewOrderUpdate)
        const dialogRef = this.dialog.open(ReceiveSupplierOrderComponent, {
         disableClose: true,
        //  width: '1060px',
        //  height: '650px',
         data: {SupplierOrderId: this.viewOrderUpdate.supplierOrderId,
          ProductNames:  this.viewOrderUpdate.productNames,
          Quantities:  this.viewOrderUpdate.quantities,
       }
       });

       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed');

       });


     });
    }
}
