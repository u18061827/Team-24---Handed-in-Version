import { orderLine } from './../../../../interfaces/supplierOrder';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddProductQuantityComponent } from 'src/app/components/modals/add-product-quantity/add-product-quantity.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { Content, Product } from 'src/app/interfaces/product';
import { SupplierOrder } from 'src/app/interfaces/supplierOrder';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-place-supplier-order',
  templateUrl: './place-supplier-order.component.html',
  styleUrls: ['./place-supplier-order.component.scss']
})
export class PlaceSupplierOrderComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<PlaceSupplierOrderComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: SupplierOrder, private formBuilder: FormBuilder, private SupplierOrderService : SupplierOrderService) { }


  ProductQuantityList: orderLine[] = [];
  oneProduct : orderLine = {
    ProductId : 0,
    SupplierOrderLineQuantity: 0,
  };

  quan:number;
  pid :number;

  selectedIngredients: any;

  ingredientList : Product[];



  form: FormGroup = new FormGroup({
    SupplierVatNumber: new FormControl(null),
    SupplierName : new FormControl(""),
    SupplierOrderId: new FormControl(null),
  });

  //open confirmation dialog
  openDialog() {
    if(this.ProductQuantityList.length > 0)
    {
      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: true,
        data: {
          heading: 'Place Order',
          message: 'Are you sure you want to place this order?'
        }
      });
      confirm.afterClosed().subscribe(res => {
        if(res)
        {
          console.log('Placed Successfully');
          this.placeSupplierOrder(this.form.value);
        }
        else
        {
          console.log('BAD');
        }

      });
    }
    else
      this._snackBar.open('At least one ingredient item must be selected for this order!', 'OK');
  }

  ngOnInit(): void {
    this.form.patchValue({
      SupplierName: this.data.SupplierName,
      SupplierVatNumber : this.data.SupplierVatNumber
    });

    this.SupplierOrderService.getIngredients().subscribe(res=>
      {
        this.ingredientList = res;
        console.log(this.ingredientList);
      })
  }

  //open quantity modal
  openModal() {
    const confirm = this.dialog.open(AddProductQuantityComponent, {
      disableClose: true
    });
    confirm.afterClosed().subscribe(res => {
      if(res)
      {
       this.quan = res.data.Quantity;
       this.oneProduct = {
         ProductId : this.pid,
         SupplierOrderLineQuantity : this.quan,
       };
        console.log("Quan: ", this.quan)
        console.log("PID: ", this.pid)

        this.ProductQuantityList.push(this.oneProduct);
        console.log("Complete List 1", this.ProductQuantityList)
      }
    });

  }

  temp: orderLine;
  //select list
  change(event:any)
  {
    if(event.isUserInput) {
      console.log(event.source.value, event.source.selected);

      if(event.source.selected == false)
      {
        console.log("This is false - no modal")

        this.ProductQuantityList.forEach((value,index)=>{
          console.log("Value of Product Quantity List", value);
          this.temp = value;
          if(this.temp.ProductId==event.source.value)
            this.ProductQuantityList.splice(index,1);
         });
      }
      else
      {
        this.openModal();
        console.log("This is true - show modal");
        this.pid = event.source.value;
      }
    }
  }


  toPlaceOrder: SupplierOrder;

  placeSupplierOrder(formValue : any)
  {
      this.toPlaceOrder ={
        SupplierOrderId : 0,
        SupplierVatNumber : formValue.SupplierVatNumber,
        orderLines : this.ProductQuantityList,
        }

      console.log(this.toPlaceOrder);

      this.SupplierOrderService.placeSupplierOrder(this.toPlaceOrder).subscribe(res =>{
        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Order Successfully Placed',
            message: 'This order was successfully placed!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.dialogRef.close();
            //window.location.reload();

            this.SupplierOrderService.placeSupplierOrderEmail(this.toPlaceOrder).subscribe(res => {
              console.log (res);
            })

          });
      },
      (error: HttpErrorResponse) => {
        console.log("ERROR RESPONSE WORKS")
        if (error.status === 400) {
          console.log("ERROR")
          this._snackBar.open('At least one ingredient item must be selected for this order!', 'OK');
        }
      }
      )
  }

  onCancel()
  {
    this.dialogRef.close();
  }
}
