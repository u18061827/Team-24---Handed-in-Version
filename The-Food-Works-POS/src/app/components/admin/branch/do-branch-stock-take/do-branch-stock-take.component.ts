import { BranchProduct } from './../../../../interfaces/branch';
import { HttpErrorResponse } from '@angular/common/http';
import { BranchService } from './../../../../services/branch.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, Form } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProductModalComponent } from 'src/app/components/modals/add-product-modal/add-product-modal.component';
import { observable, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-do-branch-stock-take',
  templateUrl: './do-branch-stock-take.component.html',
  styleUrls: ['./do-branch-stock-take.component.scss']
})

export class DoBranchStockTakeComponent implements OnInit {

  // Initialize stock form and array
  stockForm: FormGroup;

  // Initialize product object holders
  product: BranchProduct[];
  passedProduct: BranchProduct;
  enteredQuantity: any;

  // Get Completion Variables
  currentDate = new Date();
  branchId = localStorage['branch'];
  toggle = true;
  status = 'Enable';

  // Stepper Properties
  isEditable = true;

  // Initialize Subscribtion Object
  private subs = new Subscription();

  // Set Flag Variable
  enabled: boolean;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private branchService: BranchService) {}

  ngOnInit(): void {
    this.stockForm = new FormGroup({
      'quantities': new FormArray([])
    })
    this.getBranchStock();
  }

  getQuantityControls() {
    return (<FormArray>this.stockForm.get('quantities')).controls;
  }

  createNewQuantity() {
    const quantity = new FormControl('', [Validators.required]);
    (<FormArray>this.stockForm.get('quantities')).push(quantity)
  }

  // Subscribe to "GetBranchStock" endpoint
  // This is used to populate the list of stock items CURRENTLY held by the branch
  getBranchStock() {
    const id = this.branchService.getBranchId();
    id.subscribe(
      (resp: any) => {
        this.subs.add(this.branchService.getBranchStock(resp).subscribe(
          (resp: any) => {
            this.product = resp;
            console.log(this.product)
            // Add entered quantity attribute
            for (var i = 0; i < this.product.length; i++) {
              this.product[i].EnteredQuantity = null;
              this.product[i].CanDelete = false;
              this.product[i].Confirmed = false;
              this.createNewQuantity();
            }

            console.log(this.product.length);
          },
          (error: HttpErrorResponse) => {
            console.log(error);
          })
        )
      })
  }

  // Error Handler (Used for conditional validation errors)
  public errorHandling = (control: string, error: string) => {
    return this.stockForm.controls[control].hasError(error);
  }

  onChange(event: Event, id: number) {
    this.product[this.product.findIndex(x => x.ProductId === id)].EnteredQuantity = (event.target as HTMLInputElement).value;
  }

  removeProduct(rowId: number, ProductId: number): void {
    console.log(rowId);
    console.log(ProductId);
    (<FormArray>this.stockForm.get('quantities')).removeAt(rowId);
    let index = this.product.findIndex(x => x.ProductId === ProductId);
    this.product.splice(index, 1);
  }

  confirmDiscrepancy(id: number, status: boolean) {
    // Toggle Acknowledge Button Color
    status = !status;

    // Change Confirmation Status
    if(this.product[this.product.findIndex(x => x.ProductId === id)].Confirmed === false)
    {
      this.product[this.product.findIndex(x => x.ProductId === id)].Confirmed = true;
    }
    else
    {
      this.product[this.product.findIndex(x => x.ProductId === id)].Confirmed = false;
    }

    // Scroll to Following Card
    const itemToScrollTo = document.getElementById('item-' + id);
    if (itemToScrollTo) {
      itemToScrollTo.scrollIntoView({ behavior: 'smooth' });
    }

    // Change Flag State
    let result = this.product.every(x => x.Confirmed === true);
    if(result) {
      this.enabled = true;
    }
    else {
      this.enabled = false;
    }
  }

  openDialog() {
    let dialogRef = this.dialog.open(AddProductModalComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.passedProduct = result[0];
      if (this.passedProduct == null)
      {
        // Do Nothing
      }
      else
      {
        this.createNewQuantity();
        this.product.push(this.passedProduct);
      }
    })
  }

  updateQuantities() {
    this.branchService.updateBranchProductQuantity(this.product, this.branchId).subscribe(
      (resp: any) => {
        console.log("Quantities Updated Successfully!")
      },
      (error: any) => {
        console.log(error.error)
      }
    )
  }

}
