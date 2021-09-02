/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  // Data Members and Methods for Google Maps Places API
  // address: any; placeId: any; latitude: any; longitude: any; // Not Displayed
  // streetName: any; streetAddress: any; suburb: any; city: any; province: any; country: any; zip: any; // Displayed

  // addressOptions = {
  //   componentRestrictions: { country: 'za' },
  //   types: ['address']
  // } as Options;

  constructor(private toast: ToastController, private alert: AlertController, private fb: FormBuilder, private service: AccessService,
              private router: Router) { }

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
    this.registerForm = this.fb.group({
      CustomerName: ['',
      [
        Validators.required,
      ]
        // Validators.maxLength(50),
        // Validators.pattern('^[a-zA-Z ]*$')
      ],
      CustomerSurname: ['',
      [
        Validators.required,
      ]
        // Validators.maxLength(50),
        // Validators.pattern('^[a-zA-Z ]*$')
      ],
      CustomerDob: ['',
      [
        Validators.required,
      ]
      ],
      CustomerTelephone: ['',
      [
        Validators.required,
      ]
        // Validators.minLength(10),
        // Validators.maxLength(10),
        // Validators.pattern('^[0-9]*$')
      ],
      CustomerEmail: ['', [
        Validators.required,
      ]
        // Validators.maxLength(13),
        // Validators.email
      ],
      IsLoyaltyProgram: [false],
      // Address: ['',
      // [
      //   Validators.required,
      // ]
      // ],
      StreetNumber: ['', Validators.required],
      StreetName: ['', Validators.required],
      City: ['', Validators.required],
      PostalCode: ['', Validators.required],
      Province: ['', Validators.required],
      Lat: [''],
      Lng: ['', Validators.required],
      Password: ['',
      [
        Validators.required,
      ]
      ]
    });
  }

  presentConfirm() {
    this.updateAlert();
  }

  async updateAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Update Confirmation',
      message: 'Are you sure you want to update create an account?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.service.registerCustomer(this.registerForm.value).subscribe(res => {
              this.presentSuccessToast().then(() => {
                this.router.navigateByUrl('login');
              });
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
      duration: 2000,
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
      duration: 2000,
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
