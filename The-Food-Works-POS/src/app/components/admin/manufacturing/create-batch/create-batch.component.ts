import { Router } from '@angular/router';
import { AddCookingListComponent } from './../../../modals/add-cooking-list/add-cooking-list.component';
import { CookingList, ProductsNeeded, BatchLine } from './../../../../interfaces/manufacturing';
import { SelectCookingListComponent } from './../../../modals/select-cooking-list/select-cooking-list.component';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManufacturingService } from 'src/app/services/manufacturing.service';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss']
})
export class CreateBatchComponent implements OnInit {
 
  productsNeeded: any;
  batchLines: any = [];
  quantitysStillNeeded: any;


  
  quantity:any = [];

  cookingListId:any;

  cookinglists: any;
  cookingList : CookingList ;
  cookingListToSend: CookingList;
  cookingListCreated: any;
  displayedColumns: string[] = ['productID', 'productBarcode','productName', 'qtyOrdered', 'qtyRequested','qtyOnHand','qtyStillNeeded','qtyToProduce','addtoList'];
  dataSource = new MatTableDataSource<ProductsNeeded>();
  constructor(public dialog: MatDialog, private manufacturingService: ManufacturingService,private _snackBar: MatSnackBar, private router: Router,) { }

  ngOnInit(): void 
  {

    this.manufacturingService.getAllCookingLists().subscribe(res => {
      console.log(res)
      this.manufacturingService.cookingLists = res;
      const selectCookingList = this.dialog.open(SelectCookingListComponent, {
        disableClose: false,
        data: {
          message: res
        }
        })
        selectCookingList.afterClosed().subscribe(res => {
          this.getProductsNeeded();
          if(res != "add")
          {
            //console.log(res);
            this.cookingList = res;
            
          }
          else
          {
            const addCooking = this.dialog.open(AddCookingListComponent, {
              disableClose: false,
              
              })
  
              addCooking.afterClosed().subscribe(res => {
                //console.log(res);
                this.cookingListToSend = {
                 CookingListDate: res,
                  
                }
  
                this.manufacturingService.addCookingList(this.cookingListToSend).subscribe(res => {
                    //console.log(res);
                    
                    this.cookingListCreated = res;
                    
                     
  
                },  (error: HttpErrorResponse) =>{
                  console.log(error.status);
                   if (error.status === 500){
                     this._snackBar.open('There is already a cooking list for this date', 'OK',{ duration: 5000 });
                     this.router.navigateByUrl('admin')
                   }
                   else{
                     this._snackBar.open('Sorry, there was an error on the server side', 'OK');
                   }})
              })
          }
        },  (error: HttpErrorResponse) =>{
          this._snackBar.open('Sorry, there was an error on the server side', 'OK');
    
        });
    },  (error: HttpErrorResponse) =>{
      this._snackBar.open('Sorry, there was an error on the server side', 'OK');   
    })
  }
 
  getProductsNeeded()
  {
    this.manufacturingService.getProductsNeeded().subscribe(res => {
      console.log(res);
      this.productsNeeded = res;

      for(let product of this.productsNeeded)
      {
        this.quantitysStillNeeded =product.quantityOnHand- (product.quantityOrdered + product.quantityRequested);
        //console.log(this.quantitysStillNeeded)
        if (this.quantitysStillNeeded > 0)
        {
          this.quantitysStillNeeded  = this.quantitysStillNeeded * -1
        }
        else{
          this.quantitysStillNeeded  = this.quantitysStillNeeded * -1
        }
        product.quantitysStillNeeded  = this.quantitysStillNeeded;
        product.quatitityToProduce = 0;
        product.quantityOutstanding = product.quantitysStillNeeded - product.quatitityToProduce;
      }
      this.dataSource.data = this.productsNeeded;
      //console.log(this.productsNeeded)
    },  (error: HttpErrorResponse) =>{
     
        this._snackBar.open('Sorry, there was an error on the server side', 'OK');
      

    })

  }  
  
  getCookingLists()
  {
  

  }

  addtoBatch(row: any,quantityInput: any)
  {
    console.log(row, quantityInput)

   var batch: BatchLine = {
    ProductId : row.productId,
    Quantity: quantityInput,
   };

   this.batchLines.push(batch)
   //console.log(this.batchLines)
  
     

   

  }

  writeBatch(id: any)
  {
    var batchTowrite: BatchLine= 
    {
      CookingListID : id,
      BatchLines: this.batchLines,

    };

    //console.log(batchTowrite);
    this.manufacturingService.writeBatch(batchTowrite).subscribe(res =>{
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: true,
        data: {
          message: 'The batch was sucessfully added to the cooking list'
        }})

        success.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          window.location.reload();

         
       
    })
  },  (error: HttpErrorResponse) =>{
    this._snackBar.open('Sorry, there was an error on the server side', 'OK');

  })
  }

 

}
