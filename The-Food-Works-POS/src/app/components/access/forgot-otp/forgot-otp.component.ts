import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-otp',
  templateUrl: './forgot-otp.component.html',
  styleUrls: ['./forgot-otp.component.scss']
})
export class ForgotOTPComponent implements OnInit {

  OTPForm!: FormGroup;
  OTP: FormControl;

  constructor(private fb: FormBuilder, private snack: MatSnackBar, public userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.OTP = new FormControl('', [Validators.required]);
    this.OTPForm = this.fb.group({
      OTP: this.OTP
    });
  }

  checkOTP() {
    this.userService.CheckOTP(this.OTPForm.value).subscribe(res => {
      // route to OTP
    }, (error: HttpErrorResponse) => {
      this.router.navigateByUrl('reset-password');
      this.snack.open("Please provide your new password. ", "OK");
    });
  }
}
