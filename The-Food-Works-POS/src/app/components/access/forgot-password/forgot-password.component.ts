import { ForgotPassword } from './../../../interfaces/user';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessModalComponent } from '../../modals/success-modal/success-modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  Email: FormControl;
  sendEmail: ForgotPassword;
  constructor(private fb: FormBuilder, private service: UserService,
    private snack: MatSnackBar, private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<ForgotPasswordComponent>) { }
  ngOnInit(): void {
    // Initialize Controls
    this.Email = new FormControl('', [Validators.required, Validators.email]);

    this.forgotPasswordForm = this.fb.group({
      Email: this.Email
    });
  }

  Forgot() {
    this.service.ForgotPassword(this.forgotPasswordForm.value).subscribe(res => {
      // route to OTP
    }, (error: HttpErrorResponse) => {
      this.snack.open("Please check your email for your OTP.", "OK");
    });
    this.service.OTPEmail = this.forgotPasswordForm.value;
    this.router.navigateByUrl('forgotOTP');
  }

}

