import { BranchProduct } from 'src/app/interfaces/admin';
import { BranchRequest } from './../../../../interfaces/branch';
import { BranchService } from './../../../../services/branch.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProductModalComponent } from 'src/app/components/modals/add-product-modal/add-product-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-receive-branch-stock',
  templateUrl: './receive-branch-stock.component.html',
  styleUrls: ['./receive-branch-stock.component.scss']
})
export class ReceiveBranchStockComponent implements OnInit {

  // Form and Stepper Initializations
  receiveForm: FormGroup;
  requestForm: FormGroup;
  isEditable = true;

  // Holding Variables
  requests: BranchRequest[];
  requestLine: any;

  // General Declerations
  branchId = localStorage['branch'];
  statusComplete = "Complete";
  statusRequested = "Requested";
  selected = -1;
  sentId: any;
  currentDate = new Date();

  // Set Received Request Table
  requestLineInfoTable: BranchProduct[] = [];
  requestLineInfoTableDataSource = new MatTableDataSource(this.requestLineInfoTable);
  displayedColumns: string[] = ['select', 'ProductID', 'ProductType', 'ProductName', 'QuantityRequested'];
  selection = new SelectionModel<BranchProduct>(true, [])

  constructor(private fb: FormBuilder, public dialog: MatDialog, private service: BranchService ) { }

  ngOnInit(): void {
    // Form Initialization
    this.receiveForm = this.fb.group({
      'checks': new FormArray([])
    })
    this.requestForm = this.fb.group({})

    this.service.getRequests(this.branchId).subscribe(
      (reponse: any) => {
        console.log(reponse)
        this.requests = reponse;
        for (let i = 0; i < this.requests.length; i++)
        {
          this.createNewQuantity();
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  confirmRequest() {
    this.service.updateRequestQuantity(this.requestLine, this.branchId, this.sentId).subscribe(
      (resp: any) => {
        console.log("Request Successfully Received")
      },
      (resp: any) => {
        console.log("Unable to receive request")
      }
    )
  }

  getRequestList() {
    this.service.getRequestList(this.sentId).subscribe(
      (resp: any) => {
        this.requestLine = resp;
        this.requestLineInfoTable = this.requestLine;
        this.requestLineInfoTableDataSource.data = this.requestLineInfoTable;
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  getQuantityControls() {
    return (<FormArray>this.receiveForm.get('checks')).controls;
  }

  createNewQuantity() {
    const quantity = new FormControl('');
    (<FormArray>this.receiveForm.get('checks')).push(quantity)
  }

  sendId(id: any) {
    this.sentId = id;
  }

  openDialog() {
    this.dialog.open(AddProductModalComponent);
  }

  allSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.requestLineInfoTableDataSource.data.length;
    return numSelected === numRows;
  }

  // Table Checkbox
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.requestLineInfoTableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.requestLineInfoTableDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BranchProduct): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1}`;
  }


}
