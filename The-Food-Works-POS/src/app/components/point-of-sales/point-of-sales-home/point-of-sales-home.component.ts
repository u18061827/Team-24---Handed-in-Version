import { RequestEmailComponent } from './../../modals/request-email/request-email.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SaleService } from 'src/app/services/sale.service';
import { ProductSale, Sale, SaleLine } from 'src/app/interfaces/sale';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IPaymentData, IPaymentDialog } from 'src/app/interfaces/payment';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';



@Component({
  selector: 'app-point-of-sales-home',
  templateUrl: './point-of-sales-home.component.html',
  styleUrls: ['./point-of-sales-home.component.scss']
})



export class PointOfSalesHomeComponent implements OnInit {


  roundTo = function (num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  ngOnInit(): void {

    this.getMainMeals();
    this.getSides();
    this.getDesserts();

  }
  displayedColumns: string[] = ['quantity', 'description', 'lineTotal', 'delete'];
  dataSource = new MatTableDataSource<SaleLine>();

  mainMeals: any;
  sides: any;
  desserts: any
  saleLines: SaleLine[] = [];
  productToSearch: ProductSale;
  currentQuantity: number;
  isDuplicate = false;
  grandTotal = 0;
  vatTotal= 0;
  subTotal= 0;
  saleToWrite: Sale;
  barcode: string;
  priceToadd= 0;
  paymentDetails: IPaymentDialog;
  paymentType: string;


  constructor(private saleService: SaleService, private snack: MatSnackBar, private router: Router, public userService: UserService, private CookieService: CookieService, public dialog: MatDialog) {
    this.svc = userService;
    // tslint:disable-next-line:no-non-null-assertion
    this.userName = userService.userInfo.displayName!;
    // this.userName = userService.user.EmailAddress;
  }
  // ----------MENU SUPPORT -------------------------------------
  userName = '';
  svc: any;
  getUserName(): string {
    // tslint:disable-next-line:no-non-null-assertion
    return this.svc.userInfo.displayName!;
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
  // --------------------END MENU SUPPORT-----------------------------------
  getMainMeals() {
    this.saleService.getMainMeals().subscribe(res => {
      console.log(res);

      this.mainMeals = res;
    });
  }

  getSides() {
    this.saleService.getSides().subscribe(res => {
      this.sides = res;
    });
  }

  getDesserts() {
    this.saleService.getDesserts().subscribe(res => {
      this.desserts = res;
    });
  }

  addSelectedProductToList(productBarcode: string) {
    this.productToSearch = {
      ProductBarcode: productBarcode
    }
    this.saleService.getSelectedProduct(this.productToSearch).subscribe(res => {
      if (res == null) { }
      else {
        var saleLineToAdd = res;
        console.log(saleLineToAdd);
        for (var i = 0; i < this.saleLines.length; i++) {
          this.isDuplicate = false;

          // his.grandTotal = this.grandTotal + this.saleLines[i].productPriceAmount;
          // console.log (saleLineToAdd.productName)
          if (saleLineToAdd.productName == this.saleLines[i].productName) {
            this.isDuplicate = true;

            console.log("found duplicate")
            this.currentQuantity = this.saleLines[i].quantity;
            this.priceToadd = this.saleLines[i].productPriceAmount;
            console.log(this.priceToadd);
            this.saleLines[i].quantity = this.currentQuantity + 1;
            this.saleLines[i].productPriceAmount = this.saleLines[i].productPriceAmount + saleLineToAdd.productPriceAmount
            saleLineToAdd = this.saleLines[i];
          }
        }
        if (this.saleLines.length == 0) {
          this.priceToadd = saleLineToAdd.productPriceAmount;
          console.log(this.priceToadd);
          this.saleLines.push(saleLineToAdd)
        }
        else if (this.saleLines.length > 0 && this.isDuplicate == false) {
          this.priceToadd = saleLineToAdd.productPriceAmount;
          this.saleLines.push(saleLineToAdd)
        }
        // get VAT

        this.saleService.getVATpercentage().subscribe(res => {
          console.log(res);
          this.grandTotal = this.grandTotal + this.priceToadd;

          this.vatTotal = this.roundTo(this.grandTotal * (res / (100 + res)), 2);

          this.subTotal = this.roundTo(this.grandTotal - this.vatTotal, 2);
        });
        console.log(this.saleLines);
        this.dataSource.data = this.saleLines;
      }
    });
  }




  deleteSaleLine(barcode: string) {

    for (var i = 0; i < this.saleLines.length; i++) {
      if (this.saleLines[i].productBarcode == barcode) {
        this.grandTotal = this.grandTotal - this.saleLines[i].productPriceAmount;
        this.saleLines.splice(i, 1);

        this.saleService.getVATpercentage().subscribe(res => {
          // console.log(this.saleLines[i]);
          this.vatTotal = this.roundTo(this.grandTotal * (res / (100 + res)), 2);

          this.subTotal = this.roundTo(this.grandTotal - this.vatTotal, 2);
        });
      }

      this.dataSource.data = this.saleLines;
    }
  }

  callPayment(paymentType: string) {
    // this.saleService.callPayment(paymentType).subscribe(res => {
    //   console.log(res);
    if (paymentType === 'card') {
      this.paymentType = 'Card';
      this.paymentDetails = {
        paymentType: 'Card',
        paymentInstruction: 'Please enter the following total amount in the YOCO machine:',
        amount: this.grandTotal
      };
    } else if (paymentType === 'cash') {
      this.paymentType = 'Cash';
      this.paymentDetails = {
        paymentType: 'Cash',
        paymentInstruction: 'Please request the following total amount from the customer:',
        amount: this.grandTotal
      };
    } else if (paymentType === 'combination') {
      this.paymentType = 'Combination';
      this.paymentDetails = {
        paymentType: 'Combination',
        paymentInstruction: 'Please request the relevant split amounts from the customer, the total amount due is:',
        amount: this.grandTotal
      };
    }

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '40vw',
      data: this.paymentDetails
    });


    dialogRef.afterClosed().subscribe(() => {
        this.writeSale();
    });

    //})
  }

  writeSale()
  {

    var employeeID= parseInt(this.CookieService.get("employeeId"));

    this.saleToWrite ={

    EmployeeId : employeeID,
    BranchId : 1,
    CompletionMethodId :3,
    CustomerId :30,
    SaleTotal : this.grandTotal,
    SaleTypeId :1,
    SaleStatusId :3,
    SaleLines : this.saleLines,
    PaymentType: this.paymentType,

    }
    console.log(this.saleToWrite)



    this.saleService.writeSale(this.saleToWrite).subscribe(res => {


      const confirm = this.dialog.open(ConfirmModalComponent, {
        disableClose: true,
        data: {
          message: 'Would you like a receipt?'
        }
      })
      confirm.afterClosed().subscribe(res => {
        if (res) {
          this.requestEmail();
        }
        else {
          console.log('BAD');
        }
      });


    });

  }
  requestEmail() {
    const confirm = this.dialog.open(RequestEmailComponent, {
      disableClose: true,
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        this.sendEmail(res);
      }
      else {
        console.log('BAD');
      }
    });
  }

  sendEmail(emailAddress: string) {
    this.saleToWrite.EmailAddress = emailAddress;

    this.saleService.emailReceipt(this.saleToWrite).subscribe(res => {
      console.log(res);
    });
  }

}



