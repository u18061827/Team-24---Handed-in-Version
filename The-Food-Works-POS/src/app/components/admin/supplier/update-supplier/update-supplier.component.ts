import { SupplierService } from './../../../../services/supplier.service';
import { OrderDay, OrderMethods, Supplier, SupplierCombined, SupplierTypes } from './../../../../interfaces/supplier';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { finalize, last, switchMap } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.scss']
})
export class UpdateSupplierComponent implements OnInit {
  selectedOption: number;
  selectedOptionMethod: number;

  valSupplierOrderDayIdue: number;
  SupplierOrderDayDescription: string;

  suppliers: Supplier;
  typesData: SupplierTypes[];
  observeTypes: Observable<SupplierTypes[]> = this.SupplierService.getSupplierTypes();
  methodsData: OrderMethods[];
  observeMethods: Observable<OrderMethods[]> = this.SupplierService.getOrderMethods();

  alldays: OrderDay[] = [
    { SupplierOrderDayId: 1, SupplierOrderDayDescription: 'Monday' },
    { SupplierOrderDayId: 2, SupplierOrderDayDescription: 'Tuesday' },
    { SupplierOrderDayId: 3, SupplierOrderDayDescription: 'Wednesday' },
    { SupplierOrderDayId: 4, SupplierOrderDayDescription: 'Thursday' },
    { SupplierOrderDayId: 5, SupplierOrderDayDescription: 'Friday' },
    { SupplierOrderDayId: 6, SupplierOrderDayDescription: 'Saturday' },
    { SupplierOrderDayId: 7, SupplierOrderDayDescription: 'Sunday' }
  ];

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: Supplier, private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private SupplierService: SupplierService) { }
  isEditable = true;

  SupplierDetailsForm: FormGroup = new FormGroup({
    SupplierName: new FormControl("", [Validators.required]),
    SupplierVatNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    SupplierContactNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    SupplierEmailAddress: new FormControl("", [Validators.required, Validators.email]),
    OrderMethodName: new FormControl("", Validators.required),
    SupplierType: new FormControl("", Validators.required),
  });

  ngOnInit(): void {
    this.SupplierDetailsForm.patchValue({
      SupplierName: this.data.SupplierName,
      SupplierVatNumber: this.data.SupplierVatNumber,
      SupplierContactNumber: this.data.SupplierContactNumber,
      SupplierEmailAddress: this.data.SupplierEmailAddress,
      OrderMethodName: this.data.OrderMethodName,
      SupplierType: this.data.SupplierTypeId,
    });
    this.observeTypes.subscribe(data => {
      this.typesData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });

    this.observeMethods.subscribe(data => {
      this.methodsData = data;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  // Subscribe to branch creation method in service and return response

  type: number;
  method: number;
  dayVal: string;
  dayList: OrderDay[] = [];

  getTypeid(selected: number) {
    this.type = selected;
  }

  getMethodid(selected: number) {
    this.method = selected;
  }


  openDialog() {
    this.suppliers = {
      SupplierId: this.SupplierService.supplierId,
      SupplierName: this.data.SupplierName,
      SupplierVatNumber: this.data.SupplierVatNumber,
      SupplierContactNumber: this.data.SupplierContactNumber,
      SupplierEmailAddress: this.data.SupplierEmailAddress,
      SupplierTypeId: this.type,
      SupplierStatusId: this.data.SupplierStatusId,
      OrderMethodId: this.method,
      orderDays: this.dayList,
    }
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm Supplier Update',
        message: 'Are you sure you would like to update this supplier?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      console.log("This is supplier ", this.suppliers);
      this.SupplierService.updateSupplier(this.suppliers).subscribe(r => {
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Supplier Successfully Updated',
            message: 'This supplier has been successfully updated!'
          }
        });

        success.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // this.dialogRef.close();
          // window.location.reload();

        });
      },
        (error: HttpErrorResponse) => {
          console.log("ERROR RESPONSE WORKS")
          if (error.status === 400) {
            console.log("ERROR")
            this._snackBar.open("This supplier already exists in the database!", "OK");
          }
        }
      )

    });
  }

  change(event: any) {
    if (event.isUserInput) {
      console.log(event.source.value, event.source.selected);

      if (event.source.selected == false) {
        console.log("This is false");
      }
      else {
        console.log("This is true");
        this.dayVal = event.source.value;
        this.dayList.push(event.source.value);

      }
    }
  }
  // Input Restriction Handlers
  // 1.) Number Only Input (with reference to numbers-only directive)
  onChange(event: any) {
    this.cd.detectChanges();
  }
}
