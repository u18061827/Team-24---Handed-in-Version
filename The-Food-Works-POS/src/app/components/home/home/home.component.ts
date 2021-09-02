import { User } from './../../../interfaces/user';
import { RedeemVoucherComponent } from './../../loyalty/redeem-voucher/redeem-voucher.component';
import { ViewLoyaltyPointsComponent } from './../../loyalty/view-loyalty-points/view-loyalty-points.component';
import { AddLoyaltyMemberComponent } from './../../loyalty/add-loyalty-member/add-loyalty-member.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, public userService: UserService, private snack: MatSnackBar) {
    this.svc = userService;
    // tslint:disable-next-line:no-non-null-assertion
    this.userName = userService.userInfo.displayName!;
    // this.userName = userService.user.EmailAddress;
  }
  userName = '';
  displayName = '';
  svc: any;


  ngOnInit(): void {
  }

  getUserName() {
    if (this.svc.userInfo.displayName == null || undefined) {
      this.router.navigateByUrl('login');
      return 'dummy';
    }
    else if (this.svc.userInfo.displayName != null) {
      return this.svc.userInfo.displayName!;
    }
  }


  // Add Loyalty Member Dialog
  openDialog() {
    this.dialog.open(RedeemVoucherComponent);
  }

  redirect() {
    console.log('busy');
    this.router.navigateByUrl('reset-password');
  }
  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Leaving already?',
        message: 'Are you sure you want to log out?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        console.log('hi');
        this.userService.Logout().subscribe(r => {
          console.log(r);
          this.router.navigateByUrl('/login');
        }, (error: HttpErrorResponse) => {
          this.snack.open('Tasks pending completion - you may not log out.', 'OK', {
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            duration: 3000
          });
        });
      }
    });
  }
}
