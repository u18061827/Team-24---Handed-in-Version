import { AddProductQuantityComponent } from './../../../modals/add-product-quantity/add-product-quantity.component';
import { Component, OnInit } from '@angular/core';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ThemePalette } from '@angular/material/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '@angular-material-components/file-input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Content, Product, ProductTypes } from 'src/app/interfaces/product';
import { ProductService } from './../../../../services/product.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  typesData: ProductTypes[];
  observeTypes: Observable<ProductTypes[]> = this.ProductService.getproductTypes();
  selectedOption : number;
  TypeIDSend : number = 0;
  Products: any;
  contentList : Product[];
  selectedContents: any;
  isIngredient : boolean = false;

  productToWrite:Product;

  ProductQuantityList: Content[] = [];
  oneProduct : Content = {
    ProductId : 0,
    Quantity: 0,
  };
  //ingredients:any;

  constructor(private ProductService : ProductService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  form: FormGroup = new FormGroup({
    ProductName: new FormControl("", [Validators.required, Validators.maxLength(30)]),
    ProductDescription: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    ProductBarcode: new FormControl("", Validators.minLength(6)),
    ProductImage : new FormControl(""),
    });


  ngOnInit(): void {
    this.observeTypes.subscribe(data => {
      this.typesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
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


  onCancel()
  {
    this.form.reset();
  }


  addThis(f:any)
  {

    this.productToWrite ={
    ProductTypeId : this.TypeIDSend,
    ProductName : f.ProductName,
    ProductDescription : f.ProductDescription,
    ProductBarcode : f.ProductBarcode,
    //ProductImage
    contents : this.ProductQuantityList,
    }
    console.log(this.productToWrite)

    if(this.TypeIDSend == 0)
    {
      this._snackBar.open('Please select a product type!', 'OK');
    }
    else if(this.TypeIDSend != 2 && this.ProductQuantityList.length == 0)
    {
      this._snackBar.open('At least one content item must be selected for this product!', 'OK');
    }
    else
    {
      this.ProductService.addProduct(this.productToWrite).subscribe(res => {

        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Product Successfully Added',
            message: 'This product has been successfully added!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.dialogRef.close();
            //window.location.reload();

          });
      },
      (error: HttpErrorResponse) => {
        console.log("ERROR RESPONSE WORKS")
        if (error.status === 400) {
          console.log("ERROR")
          this._snackBar.open('This product already exists in the database!', 'OK');
        }
      }
    )
    }
}


openDialog() {
  const confirm = this.dialog.open(ConfirmModalComponent, {
    disableClose: true,
    data: {
      heading: 'Confirm Product Addition',
      message: 'Are you sure you would like to confirm this addition?'
    }
  });
  confirm.afterClosed().subscribe(res => {
    if(res)
    {
      console.log('Added Successfully');
      this.addThis(this.form.value);
    }
    else
    {
      console.log('BAD');
    }

  });
}

}
