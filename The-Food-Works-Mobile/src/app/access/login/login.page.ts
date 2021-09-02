import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AccessService } from 'src/app/services/access.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AccessService, private router: Router,
    private loadingController: LoadingController, private toast: ToastController, private customerService: CustomerService,
    private driverService: DriverService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailAddress: ['', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      password: ['', [
        Validators.required,
      ]],
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
  }

  doLogin() {
    this.presentLoading().then(() => {
      this.authService.login(this.loginForm.value).subscribe((res: any) => {
        if (res.employeeId == null) {
          this.loadingController.dismiss().then(() => {
            this.customerService.setCustomerID(res.customerId);
            this.toast.dismiss();
            this.authService.doAuthenticate();
            this.loginForm.reset();
            this.customerService.getVAT();
            this.router.navigateByUrl('shop-location');
          });
        } else {
          this.loadingController.dismiss().then(() => {
            this.driverService.setEmployeeID(res.employeeId);
            this.toast.dismiss();
            this.authService.doAuthenticate();
            this.loginForm.reset();
            this.router.navigateByUrl('driver-home');
          });
        }
      }, error => {
        this.loadingController.dismiss();
        this.presentFailToast();
      });
    });
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Email or password incorrect.',
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
