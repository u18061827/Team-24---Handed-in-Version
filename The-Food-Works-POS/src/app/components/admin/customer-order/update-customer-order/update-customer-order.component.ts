import { CustomerOrder } from './../../../../interfaces/customerOrder';
import { SaleStatuses } from './../../../../interfaces/saleStatus';
import { CustomerOrderService } from './../../../../services/customer-order.service';
import { ConfirmModalComponent } from './../../../modals/confirm-modal/confirm-modal.component';
import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-customer-order',
  templateUrl: './update-customer-order.component.html',
  styleUrls: ['./update-customer-order.component.scss']
})

export class UpdateCustomerOrderComponent implements OnInit {

  customerOrder : any;
  SaleId: number;
  Shared : number;
  statusData: SaleStatuses[];
  observeStatuses: Observable<SaleStatuses[]> = this.CustomerOrderService.getsaleStatuses();

  constructor(private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<UpdateCustomerOrderComponent>,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: CustomerOrder, private formBuilder: FormBuilder, private CustomerOrderService: CustomerOrderService) {}

  form: FormGroup = new FormGroup({
    SaleId: new FormControl(null),
    DateofSale: new FormControl("", Validators.required),
    SaleStatusDescription: new FormControl("", Validators.required),
    });

    openModal() {
      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: true,
        data: {
          heading: 'Confirm Order Status',
          message: 'Are you sure you would like to confirm this update?'
        }
      });
      confirm.afterClosed().subscribe(res => {
        if(res)
        {
          console.log('Added Successfully');
          this.updateCustomerOrder(this.form.value);
        }
        else
        {
          console.log('BAD');
        }

      });

    }


  ngOnInit(): void {
    this.observeStatuses.subscribe(data => {
      this.statusData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    var formattedDate = this.data.DateofSale?.substring(0, 10);
    this.form.patchValue({
      SaleId: this.data.SaleId,
      DateofSale: formattedDate,
      SaleStatusDescription: this.data.saleStatusId,
    });
  }

  toUpdateOrder: CustomerOrder;

  updateCustomerOrder(formValue : any)
  {
      this.toUpdateOrder = {
        SaleId: formValue.SaleId,
        DateofSale: formValue.DateofSale,
        saleStatusId: formValue.SaleStatusDescription
      }

      console.log(this.toUpdateOrder);

      this.CustomerOrderService.updateCustomerOrder(this.toUpdateOrder).subscribe(res =>{
        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Order Successfully Updated',
            message: 'This order’s status was successfully updated!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.dialogRef.close();
            window.location.reload();

          });
      },
      (error: HttpErrorResponse) => {
        console.log("ERROR RESPONSE WORKS")
        if (error.status === 400) {
          console.log("ALERT ERROR WORKS")
          this._snackBar.open('The new status cannot be the same as the former status!', 'OK');
        }
      }
      )
  }

  onCancel()
  {
    this.dialogRef.close();
  }

}

