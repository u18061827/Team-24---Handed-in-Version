import { orderLine } from './../../../../interfaces/supplierOrder';
import { SupplierOrderService } from './../../../../services/supplier-order.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupplierOrder } from 'src/app/interfaces/supplierOrder';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { Content, Product } from 'src/app/interfaces/product';
import { AddProductQuantityComponent } from 'src/app/components/modals/add-product-quantity/add-product-quantity.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-receive-supplier-order',
  templateUrl: './receive-supplier-order.component.html',
  styleUrls: ['./receive-supplier-order.component.scss']
})
export class ReceiveSupplierOrderComponent implements OnInit {

  ProductQuantityList: orderLine[] = [];
  oneProduct : orderLine = {
    ProductId : 0,
    SupplierOrderLineQuantity: 0,
  };

  quan:number;
  pid :number;

  selectedIngredients: any;

  ingredientList : Product[];


  constructor(private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<ReceiveSupplierOrderComponent>,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: SupplierOrder, private formBuilder: FormBuilder, private SupplierOrderService : SupplierOrderService) { }

  form: FormGroup = new FormGroup({
    SupplierOrderId: new FormControl(null),
    InvoiceImage: new FormControl(null),
  });

  //open confirmation dialog
  openDialog() {
    if(this.ProductQuantityList.length > 0)
    {
      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: true,
        data: {
          heading: 'Receive Order',
          message: 'Are you sure you want to receive this order?'
        }
      });
      confirm.afterClosed().subscribe(res => {
        if(res)
        {
          console.log('The quantity on hand for this product has been updated successfully!');
          this.updateSupplierOrder(this.form.value);
        }
        else
        {
          console.log('BAD');
        }

      });
    }
    else
      this._snackBar.open('At least one item must be selected in order to receive this order!', 'OK');


  }

  ngOnInit(): void {
    this.form.patchValue({
      SupplierOrderId: this.data.SupplierOrderId,
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

  //select list
  temp: orderLine;
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


   // Save Image to firebase DB Storage
   selectedImage: File;

   getImageFile(event: any) {
     this.selectedImage = event.target.files[0];
     let fileName = this.selectedImage.name;
     const element: HTMLElement = document.getElementById('file') as HTMLElement;
     element.innerHTML = fileName;
   }

  toUpdateOrder: SupplierOrder;

  updateSupplierOrder(formValue : any)
  {
      this.toUpdateOrder ={
        SupplierOrderId : formValue.SupplierOrderId,
        //Image
        orderLines : this.ProductQuantityList,
        }

      console.log(this.toUpdateOrder);

      this.SupplierOrderService.updateSupplierOrder(this.toUpdateOrder).subscribe(res =>{
        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Order Successfully Received',
            message: 'This order was successfully received!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.dialogRef.close();
            window.location.reload();

          });
      }
      )
  }

  onCancel()
  {
    this.dialogRef.close();
  }
}
