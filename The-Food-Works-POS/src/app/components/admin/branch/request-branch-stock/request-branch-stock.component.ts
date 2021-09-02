import { AddProductRequestModalComponent } from './../../../modals/add-product-request-modal/add-product-request-modal.component';
import { BranchService } from './../../../../services/branch.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { BranchProduct } from 'src/app/interfaces/branch';

@Component({
  selector: 'app-request-branch-stock',
  templateUrl: './request-branch-stock.component.html',
  styleUrls: ['./request-branch-stock.component.scss']
})

export class RequestBranchStockComponent implements OnInit {

  // General Declerations
  currentDate = new Date();
  branchId = localStorage['branch'];

  // Add Form FormGroup Initialization
  requestForm: FormGroup;
  isLinear = false;

  // Initialize product object holders
  product: BranchProduct[] = [];
  tableProduct: BranchProduct;
  passedProduct: BranchProduct;
  enteredQuantity: any;

  // Stepper Data Members
  isEditable = true;

  // Set Confirmed Request Table
  productInfoTable: BranchProduct[] = [];
  productInfoTableDataSource = new MatTableDataSource(this.productInfoTable);
  displayedColumns: string[] = ['select', 'ProductID', 'ProductType', 'ProductName', 'QuantityRequested'];
  selection = new SelectionModel<BranchProduct>(true, [])

  constructor(private fb: FormBuilder, public dialog: MatDialog, public branchService: BranchService) { }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      'quantities': new FormArray([])
    });

  }

  populate() {
    this.productInfoTable = this.product;
    this.productInfoTableDataSource.data = this.productInfoTable;
  }

  getQuantityControls() {
    return (<FormArray>this.requestForm.get('quantities')).controls;
  }

  createNewQuantity() {
    const quantity = new FormControl('', [Validators.required]);
    (<FormArray>this.requestForm.get('quantities')).push(quantity)
  }

  onChange(event: Event, id: number) {
    this.product[this.product.findIndex(x => x.ProductId === id)].EnteredQuantity = (event.target as HTMLInputElement).value;
  }

  allSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.productInfoTableDataSource.data.length;
    return numSelected === numRows;
  }

  removeProduct(rowId: number, ProductId: number): void {
    console.log(rowId);
    console.log(ProductId);
    (<FormArray>this.requestForm.get('quantities')).removeAt(rowId);
    let index = this.product.findIndex(x => x.ProductId === ProductId);
    this.product.splice(index, 1);
  }

  // Access service endpoint and read suggested products into first step of stepper
  openDialog() {
    let dialogRef = this.dialog.open(AddProductRequestModalComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result[0].ProductName);
      this.passedProduct = result[0];
      if (this.passedProduct == null)
      {
        // Do Nothing
      }
      else
      {
        var status = this.product.some(function(el) {
          return (el.ProductName == result[0].ProductName);
        });
        if(status) {
          alert('Product already added to request!')
        }
        else {
          this.createNewQuantity()
          this.product.push(result[0]);
          console.log(this.product)
        }
      }
    })
  }

  sendRequest() {
    this.branchService.requestBranchStock(this.product, this.branchId).subscribe(
      (resp: any) => {
        console.log('New Request Sent Successfully')
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  emptyValidator() {
    let flag = null;
    if (this.product.length == 0) {
      flag = false;
    }
    else {
      flag = true;
    }
    return flag
  }

  // Table Checkbox
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.productInfoTableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.productInfoTableDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BranchProduct): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ProductId + 1}`;
  }

}
