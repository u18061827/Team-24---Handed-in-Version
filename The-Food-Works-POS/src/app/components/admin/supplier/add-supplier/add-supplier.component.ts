import { SupplierService } from './../../../../services/supplier.service';
import { OrderDay, OrderMethods, SupplierCombined, SupplierTypes } from './../../../../interfaces/supplier';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { finalize, last, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {

    // Data Members and Methods for Google Maps Places API
  supplier: any; address: any; placeId: any; latitude: any; longitude: any; // Not Displayed
  streetName: any; streetAddress: any; province: any; suburb: any; country: any; city: any; zip: any; // Displayed

  selectedOption : number;
  selectedOptionMethod : number;

  valSupplierOrderDayIdue: number;
  SupplierOrderDayDescription: string;

  typesData: SupplierTypes[];
  observeTypes: Observable<SupplierTypes[]> = this.SupplierService.getSupplierTypes();
  methodsData: OrderMethods[];
  observeMethods: Observable<OrderMethods[]> = this.SupplierService.getOrderMethods();

  alldays: OrderDay[] = [
    {SupplierOrderDayId: 1, SupplierOrderDayDescription: 'Monday'},
    {SupplierOrderDayId: 2, SupplierOrderDayDescription: 'Tuesday'},
    {SupplierOrderDayId: 3, SupplierOrderDayDescription: 'Wednesday'},
    {SupplierOrderDayId: 4, SupplierOrderDayDescription: 'Thursday'},
    {SupplierOrderDayId: 5, SupplierOrderDayDescription: 'Friday'},
    {SupplierOrderDayId: 6, SupplierOrderDayDescription: 'Saturday'},
    {SupplierOrderDayId: 7, SupplierOrderDayDescription: 'Sunday'}
  ];

  addressOptions = {
    componentRestrictions: { country: "za" }
  } as Options;

  public handleAddressChange(address: any) {

    // Place id (Not Displayed)
    this.placeId = address.place_id;
    console.log(this.placeId);

    // Latitude coordinate (Not Displayed)
    this.latitude = address.geometry.location.lat();
    console.log(this.latitude);

    // Longitude coordinate (Not Displayed)
    this.longitude = address.geometry.location.lng();
    console.log(this.longitude);

    // Reset street address on method refresh
    this.streetAddress = "";

    // Street Address (full unformatted) (Displayed)
    this.SupplierAddressForm.get('SupplierAddressFull')?.setValue(address.formatted_address);


    // Street number (Displayed i.t.o)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "street_number") {
          this.streetAddress = JSON.parse(JSON.stringify(address.address_components[i].long_name)) + " ";
        }
      }
    }

    // Street name (Displayed i.t.o)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "route") {
          this.streetAddress += JSON.parse(JSON.stringify(address.address_components[i].long_name));
        }
      }
    }

    // Set Street Name field to combined street name variable (this.streetAddress)
    this.SupplierAddressForm.get('SupplierAddressStreetName')?.setValue(this.streetAddress);

    this.suburb="";
     // Suburb (Displayed)
     for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "sublocality") {
          this.SupplierAddressForm.get('SupplierAddressSuburb')?.setValue(address.address_components[i].long_name);
        }
      }
    }


    // Reset city on method refresh
    this.city = "";

    // City (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] === "locality") {
          this.SupplierAddressForm.get('SupplierAddressCity')?.setValue(address.address_components[i].long_name);
        }
      }
    }

        // Reset province on method refresh
        this.province = "";

        // Province (Displayed)
        for (var i = 0; i < address.address_components.length; i++) {
          for (var x = 0; x < address.address_components[i].types.length; x++) {
            if (address.address_components[i].types[x] == "administrative_area_level_1") {
              this.SupplierAddressForm.get('SupplierAddressProvince')?.setValue(address.address_components[i].long_name);
            }
          }
        }

        // Reset country on method refresh
        this.country = "";

        // Country (Displayed)
        for (var i = 0; i < address.address_components.length; i++) {
          for (var x = 0; x < address.address_components[i].types.length; x++) {
            if (address.address_components[i].types[x] == "country") {
              this.SupplierAddressForm.get('SupplierAddressCountry')?.setValue(address.address_components[i].long_name);
            }
          }
        }

    // Reset zip on method refresh
    this.zip = "";

    // ZIP (Displayed)
    for (var i = 0; i < address.address_components.length; i++) {
      for (var x = 0; x < address.address_components[i].types.length; x++) {
        if (address.address_components[i].types[x] == "postal_code") {
          this.SupplierAddressForm.get('SupplierAddressZip')?.setValue(address.address_components[i].long_name);
        }
      }
    }

    // Latitude Control (Not displayed)
    this.SupplierAddressForm.get('SupplierAddressLat')?.setValue(this.latitude);

    // Longitude Control (Not displayed)
    this.SupplierAddressForm.get('SupplierAddressLng')?.setValue(this.longitude);

  }

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private formBuilder:FormBuilder, private cd: ChangeDetectorRef,private SupplierService: SupplierService) { }
  isEditable = true;

    SupplierDetailsForm: FormGroup = new FormGroup({
      SupplierName: new FormControl("", [Validators.required]),
      SupplierVatNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
      SupplierContactNumber: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
      SupplierEmailAddress : new FormControl("", [Validators.required, Validators.email]),
      //OrderMethodName:  new FormControl("", Validators.required),
      //SupplierType:  new FormControl("", Validators.required),
  });

    SupplierAddressForm: FormGroup = new FormGroup({
      SupplierAddressFull: new FormControl("", [Validators.required]),
      SupplierAddressBuildingNumber: new FormControl(""),
      SupplierAddressStreetName: new FormControl(""),
      SupplierAddressCity : new FormControl(""),
      SupplierAddressSuburb : new FormControl(""),
      SupplierAddressProvince : new FormControl(""),
      SupplierAddressCountry : new FormControl(""),
      SupplierAddressLat:  new FormControl(""),
      SupplierAddressLng:  new FormControl(""),
      SupplierAddressZip:  new FormControl(""),
  });

  ngOnInit(): void {
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

  type :number;
  method: number;

  getTypeid(selected:number)
  {
    this.type = selected;
  }

  getMethodid(selected:number)
  {
    this.method = selected;
  }


  openDialog() {
    const suppliers: SupplierCombined = {
      supplier: this.SupplierDetailsForm.value,
      address: this.SupplierAddressForm.getRawValue()
    }
    suppliers.supplier.SupplierTypeId = this.type;
    suppliers.supplier.OrderMethodId = this.method;
    suppliers.supplier.orderDays = this.dayList;
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Supplier Addition',
        message: 'Are you sure you would like to confirm this addition?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      console.log("This is supplier ", suppliers)
      this.SupplierService.addSupplier(suppliers).subscribe(res => {

        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            heading: 'Supplier Successfully Added',
            message: 'This supplier has been successfully added!'
          }})

          success.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.dialogRef.close();
            // window.location.reload();

          });
      },
      (error: HttpErrorResponse) => {
        console.log(error)
        if (error.status === 400) {
          console.log("ERROR")
          this._snackBar.open("This supplier already exists in the database!", "OK");
        }
      }
    )

    });
  }

  dayVal:string;
  dayList: OrderDay[] = [];
  oneDay : OrderDay = {
    SupplierOrderDayDescription: "",
  };
  temp: OrderDay;
  change(event:any)
  {
    if(event.isUserInput) {
      console.log(event.source.value, event.source.selected);

      if(event.source.selected == false)
      {
        console.log("This is false");
        this.dayList.forEach((value,index)=>{
          this.temp = value;
          if(this.temp.SupplierOrderDayDescription==event.source.value)
            this.dayList.splice(index,1);
         });
      }
      else
      {
        console.log("This is true");
        this.oneDay ={
          SupplierOrderDayDescription: event.source.value
        }
          this.dayList.push(this.oneDay);

      }
    }
  }
    // Input Restriction Handlers
    // 1.) Number Only Input (with reference to numbers-only directive)
  onChange(event: any) {
    this.cd.detectChanges();
  }


}
