/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private service: AccessService, private router: Router, private toast: ToastController) { }

  ngOnInit() {
    // formbuilder formgroup and form validation
    this.forgotPasswordForm = this.fb.group({
      Email: ['', [
        Validators.required,
      ]],
    });
  }

  doForgotPassword() {
    this.service.forgotPassword(this.forgotPasswordForm.value).subscribe(res => {
      this.router.navigateByUrl('one-time-pin');
    }, error => {
      this.presentFailToast();
    });
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Please enter a valid email address.',
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
