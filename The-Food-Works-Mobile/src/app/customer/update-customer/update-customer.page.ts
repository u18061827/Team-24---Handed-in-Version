/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.page.html',
  styleUrls: ['./update-customer.page.scss'],
})
export class UpdateCustomerPage implements OnInit {

  updateForm: FormGroup;
  customerToUpdate: any;

  // Data Members and Methods for Google Maps Places API
  // address: any; placeId: any; latitude: any; longitude: any; // Not Displayed
  // streetName: any; streetAddress: any; suburb: any; city: any; province: any; country: any; zip: any; // Displayed

  // addressOptions = {
  //   componentRestrictions: { country: 'za' },
  //   types: ['address']
  // } as Options;

  constructor(private toast: ToastController, private alert: AlertController, private fb: FormBuilder, private service: CustomerService) { }

  // public handleAddressChange(address: any) {

  //   // Place id (Not Displayed)
  //   this.placeId = address.place_id;
  //   console.log(this.placeId);

  //   // Latitude coordinate (Not Displayed)
  //   this.latitude = address.geometry.location.lat();
  //   console.log(this.latitude);

  //   // Longitude coordinate (Not Displayed)
  //   this.longitude = address.geometry.location.lng();
  //   console.log(this.longitude);

  //   // Reset street address on method refresh
  //   this.streetAddress = '';

  //   // Street number (Displayed i.t.o)
  //   for (let i = 0; i < address.address_components.length; i++) {
  //     for (let x = 0; x < address.address_components[i].types.length; x++) {
  //       if (address.address_components[i].types[x] === 'street_number') {
  //         this.streetAddress = JSON.parse(JSON.stringify(address.address_components[i].long_name)) + ' ';
  //       }
  //     }
  //   }

  //   // Street name (Displayed i.t.o)
  //   for (let i = 0; i < address.address_components.length; i++) {
  //     for (let x = 0; x < address.address_components[i].types.length; x++) {
  //       if (address.address_components[i].types[x] === 'route') {
  //         this.streetAddress += JSON.parse(JSON.stringify(address.address_components[i].long_name));
  //       }
  //     }
  //   }

  //   // Set Street Name field to combined street name variable (this.streetAddress)
  //   this.registerForm.get('StreetName')?.setValue(this.streetAddress);

  //   // Reset city on method refresh
  //   this.city = '';

  //   // City (Displayed)
  //   for (let i = 0; i < address.address_components.length; i++) {
  //     for (let x = 0; x < address.address_components[i].types.length; x++) {
  //       if (address.address_components[i].types[x] === 'locality') {
  //         this.registerForm.get('City')?.setValue(address.address_components[i].long_name);
  //       }
  //     }
  //   }

  //   // Reset province on method refresh
  //   this.province = '';

  //   // Province (Displayed)
  //   for (let i = 0; i < address.address_components.length; i++) {
  //     for (let x = 0; x < address.address_components[i].types.length; x++) {
  //       if (address.address_components[i].types[x] === 'administrative_area_level_1') {
  //         this.registerForm.get('Province')?.setValue(address.address_components[i].long_name);
  //       }
  //     }
  //   }

  //   // Reset zip on method refresh
  //   this.zip = '';

  //   // ZIP (Displayed)
  //   for (let i = 0; i < address.address_components.length; i++) {
  //     for (let x = 0; x < address.address_components[i].types.length; x++) {
  //       if (address.address_components[i].types[x] === 'postal_code') {
  //         this.registerForm.get('PostalCode')?.setValue(address.address_components[i].long_name);
  //       }
  //     }
  //   }

  //   // Latitude Control (Not displayed)
  //   this.registerForm.get('Lat')?.setValue(this.latitude);

  //   // Longitude Control (Not displayed)
  //   this.registerForm.get('Lng')?.setValue(this.longitude);

  // }

  ngOnInit() {
    this.service.getCustomerToUpdate().subscribe(res => {
      this.customerToUpdate = res;
      console.log(this.customerToUpdate);
      this.updateForm = this.fb.group({
        CustomerName: [this.customerToUpdate.customerName,
          Validators.required,
          // Validators.maxLength(50),
          // Validators.pattern('^[a-zA-Z ]*$')
        ],
        CustomerSurname: [this.customerToUpdate.customerSurname,
          Validators.required,
          // Validators.maxLength(50),
          // Validators.pattern('^[a-zA-Z ]*$')
        ],
        CustomerTelephone: [this.customerToUpdate.customerTelephone,
          Validators.required,
          // Validators.minLength(10),
          // Validators.maxLength(10),
          // Validators.pattern('^[0-9]*$')
        ],
        IsLoyaltyProgram: [this.customerToUpdate.isLoyaltyProgram,
          Validators.required
        ],
        // Address: ['',
        //   Validators.required
        // ],
        StreetNumber: [this.customerToUpdate.streetNumber, Validators.required],
        StreetName: [this.customerToUpdate.streetName, Validators.required],
        City: [this.customerToUpdate.city, Validators.required],
        PostalCode: [this.customerToUpdate.postalCode, Validators.required],
        Province: [this.customerToUpdate.province, Validators.required],
        Lat: [this.customerToUpdate.lat, Validators.required],
        Lng: [this.customerToUpdate.lng, Validators.required],
      });
    });
  }

  presentConfirm() {
    this.updateAlert();
  }

  async updateAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Update Confirmation',
      message: 'Are you sure you want to update your details?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.service.doUpdateCustomer(this.updateForm.value).subscribe(res => {
              this.presentSuccessToast();
            }, error => {
              this.presentFailToast();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'Your account has been successfully created.',
      position: 'top',
      color: 'success',
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Unsuccessful validation',
      position: 'top',
      color: 'danger',
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

}
