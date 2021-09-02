import { UpdateCustomerOrderComponent } from './../update-customer-order/update-customer-order.component';
import { CustomerOrder } from './../../../../interfaces/customerOrder';
import { CustomerOrderService } from './../../../../services/customer-order.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ViewCustomerOrderComponent } from '../view-customer-order/view-customer-order.component';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { SalePaymentType } from 'src/app/interfaces/salePaymentType';

@Component({
  selector: 'app-maintain-customer-order',
  templateUrl: './maintain-customer-order.component.html',
  styleUrls: ['./maintain-customer-order.component.scss']
})
export class MaintainCustomerOrderComponent implements AfterViewInit {

  CustomerOrders : any;
  //Shared = 1;
  viewOrderUpdate: any;
  viewOrder : any;

  form : FormGroup;

  displayedColumns: string[] = ['SaleId', 'DateofSale', 'CustomerName','CustomerTelephone', 'SaleStatusDescription' , 'CompletionMethodDescription', 'BranchName','PaymentTypeDescription', 'update', 'view'];
  dataSource = new MatTableDataSource<CustomerOrder>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private formBuilder: FormBuilder, private CustomerOrderService : CustomerOrderService, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getCustomerOrders();
    this.form = this.formBuilder.group({
      SaleId: [null],
      DateofSale: [null],
      })
  }


  //table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //all customer orders
  getCustomerOrders()
  {
    this.CustomerOrderService.getCustomerOrders().subscribe(res=>
      {
        console.log(res);
        this.CustomerOrders = res;
        this.dataSource.data = this.CustomerOrders; //add 'data' in order to filter
        //override table filter
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return (
            data.SaleId.toString().includes(filter)
          );
        };
      })
  }

  //For View
  viewCustomerOrder(SaleId: number)
  {
    console.log("View Part " + SaleId);

    return this.CustomerOrderService.getOneOrder(SaleId).subscribe(res => {
       this.viewOrder = res;
       console.log (this.viewOrder);

       var formattedDate = this.viewOrder.dateofSale?.substring(0, 10);

      this.form.patchValue({
         SaleId: this.viewOrder.saleId,
         DateofSale: formattedDate,
       });

    });

  }

  //For Update
  getOneOrder(SaleId: number)
  {
    return this.CustomerOrderService.getOneOrder(SaleId).subscribe(res => {
      this.viewOrderUpdate = res;
     console.log (this.viewOrderUpdate)
      const dialogRef = this.dialog.open(UpdateCustomerOrderComponent, {
       disableClose: true,
       width: '450px',
       height: '430px',
       data: {SaleId: this.viewOrderUpdate.saleId,
       DateofSale : this.viewOrderUpdate.dateofSale,
       saleStatusId:  this.viewOrderUpdate.saleStatusId,
     }
     });

     dialogRef.afterClosed().subscribe(result => {
       console.log('The dialog was closed');

     });


   });
  }

  onCancel()
  {
    window.location.reload();
  }
}
