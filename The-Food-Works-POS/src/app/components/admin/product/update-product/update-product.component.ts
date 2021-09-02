import { Content, Product, ProductStatuses } from './../../../../interfaces/product';
import { ProductService } from './../../../../services/product.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductTypes } from 'src/app/interfaces/product';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddProductQuantityComponent } from 'src/app/components/modals/add-product-quantity/add-product-quantity.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private ProductService: ProductService, public dialogRef: MatDialogRef<UpdateProductComponent>,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: Product, private formBuilder: FormBuilder) { }
  typesData: ProductTypes[];
  observeTypes: Observable<ProductTypes[]> = this.ProductService.getproductTypes();
  statusesData: ProductStatuses[];
  observeStatuses: Observable<ProductStatuses[]> = this.ProductService.getproductStatuses();

  selectedOption = this.data.ProductTypeId;
  TypeIDSend : number;
  Products: any;
  contentList : Product[];
  selectedContents: any;
  //= this.data.ProductNames;
  isIngredient : boolean = false;

  productToWrite:Product;

  ProductQuantityList: Content[] = [];
  oneProduct : Content = {
    ProductId : 0,
    Quantity: 0,
  };


  form: FormGroup = new FormGroup({
    ProductName: new FormControl("", [Validators.required, Validators.maxLength(30)]),
    ProductDescription: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    ProductBarcode: new FormControl("", Validators.minLength(6)),
    ProductImage : new FormControl(""),
    ProductStatuses : new FormControl("", Validators.required),
    ProductId : new FormControl(""),
    //,    selectedCon : new FormControl(this.myselectedCon),
  });



  ngOnInit(): void {
    this.observeTypes.subscribe(data => { //PRODUCT TYPES
      this.typesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    this.observeStatuses.subscribe(data => { //PRODUCT STATUSES
      this.statusesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    //PATCH VALUES
    this.form.patchValue({
      ProductName: this.data.ProductName,
      ProductDescription: this.data.ProductDescription,
      ProductBarcode: this.data.ProductBarcode,
      ProductStatuses: this.data.ProductStatusId,
      ProductId: this.data.ProductId,
    })

    this.TypeIDSend = this.data.ProductTypeId;

    if(this.data.ProductTypeId == 1 || this.data.ProductTypeId == 4 || this.data.ProductTypeId == 5)
    {
      this.ProductService.getIngredients().subscribe(res=>
        {
          this.contentList = res;
          this.isIngredient = false;
          console.log(this.contentList);
        })
    }
    else if(this.data.ProductTypeId == 3)
    {
      this.ProductService.getProducts().subscribe(res=>
        {
          this.contentList = res;
          this.isIngredient = false;
          console.log(this.contentList);
        })
    }
    else if(this.data.ProductTypeId == 2)
    {
      this.isIngredient = true;
      //this.form.reset();
    }
  }


  quan:number;
  pid :number;

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
         Quantity : this.quan,
       };
        console.log("Quan: ", this.quan)
        console.log("PID: ", this.pid)

        this.ProductQuantityList.push(this.oneProduct);
        console.log("Complete List 1", this.ProductQuantityList)
      }
    });
  }

  temp: Content;
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



  getProducts(selected:number)
  {
    this.TypeIDSend = selected;
    if(selected == 1 || selected == 4 || selected == 5)
    {
      this.ProductService.getIngredients().subscribe(res=>
        {
          this.contentList = res;
          this.isIngredient = false;
          console.log(this.contentList);
        })
    }
    else if(selected == 3)
    {
      this.ProductService.getProducts().subscribe(res=>
        {
          this.contentList = res;
          this.isIngredient = false;
          console.log(this.contentList);
        })
    }
    else if(selected == 2)
    {
      this.isIngredient = true;
      //this.form.reset();
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

  //update function
  updateThis(f:any)
  {

    this.productToWrite ={
      ProductId: f.ProductId,
      ProductTypeId : this.TypeIDSend,
      ProductStatusId : f.ProductStatuses,
      ProductName : f.ProductName,
      ProductDescription : f.ProductDescription,
      ProductBarcode : f.ProductBarcode,
      //ProductImage
      contents : this.ProductQuantityList,
    }
    console.log(this.productToWrite)

    if(this.TypeIDSend != 2 && this.ProductQuantityList.length == 0)
    {
      this._snackBar.open('At least one content must be selected for this product!', 'OK');
    }
    else
    {
      this.ProductService.updateProduct(this.productToWrite).subscribe(res => {

        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Product Successfully Updated',
            message: 'This product has been successfully updated!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

             this.dialogRef.close();
             window.location.reload();

          });
      }
    )
    }
}

openDialog() {
  const confirm = this.dialog.open(ConfirmModalComponent, {
    disableClose: true,
    data: {
      heading: 'Confirm Product Update',
      message: 'Are you sure you would like to confirm this update?'
    }
  });
  confirm.afterClosed().subscribe(res => {
    if(res)
    {
      console.log('Updated Successfully');
      this.updateThis(this.form.value);
    }
    else
    {
      console.log('BAD');
    }

  });
}

  onCancel()
  {
    this.dialogRef.close();
  }

}
