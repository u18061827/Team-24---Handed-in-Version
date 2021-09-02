import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IOrderLine } from 'src/app/interfaces/order';
import { IPaymentData, IPaymentDialog } from 'src/app/interfaces/payment';
import { OrderService } from 'src/app/services/order.service';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.scss']
})
export class CompleteOrderComponent implements OnInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild('qrCode') qrCode: ElementRef;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private service: OrderService, public router: Router) { }

  displayedColumns: string[] = ['quantity', 'productName', 'productPrice', 'lineTotal'];
  dataSource = new MatTableDataSource<IOrderLine>();

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  orderLines: IOrderLine[] = [];
  splitCode = [];
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  orderDetails: any;
  customerDetails: any;
  isPaid: boolean;
  paymentDetails: IPaymentDialog;
  isLoading = false;

  ngOnInit() {
    this.firstFormGroup = this.fb.group({ });
    this.secondFormGroup = this.fb.group({ });

    this.service.getVAT();
    this.onBlur();
  }

  captureQRCode(qrCode: any) {
    this.isPaid = true;
    this.subtotal = 0;
    this.vatAmount = 0;
    this.grandTotal = 0;
    this.splitCode = qrCode.split(':');
    if (this.splitCode[0] === 'or'){
      this.service.getOrder(this.splitCode[1]).subscribe(res => {
        this.orderDetails = res;
        this.orderLines = res.orderLines;
        this.dataSource.data = this.orderLines;

        this.orderLines.forEach(element => {
          this.grandTotal += (element.productPrice * element.quantity);
        });
        this.vatAmount = (this.grandTotal * (this.service.vatPercentage / 100));
        this.subtotal = this.grandTotal - this.vatAmount;

        if (res.paymentMethod === 'Not Paid') {
          this.isPaid = false;
        }

        // tslint:disable-next-line: no-shadowed-variable
        this.service.getCustomerDetails(this.splitCode[2]).subscribe(res => {
          this.customerDetails = res;
        });

      });
      this.myStepper.next();
    }
  }

  onBlur() {
    setTimeout(() => this.qrCode.nativeElement.focus(), 0);
  }

  openDialog(paymentType: string) {

    if (paymentType === 'card') {
      this.paymentDetails = {
        paymentType: 'Card',
        paymentInstruction: 'Please enter the following total amount in the YOCO machine:',
        amount: this.grandTotal
      };
    } else if (paymentType === 'cash') {
      this.paymentDetails = {
        paymentType: 'Cash',
        paymentInstruction: 'Please request the following total amount from the customer:',
        amount: this.grandTotal
      };
    } else if (paymentType === 'combination') {
      this.paymentDetails = {
        paymentType: 'Combination',
        paymentInstruction: 'Please request the relevant split amounts from the customer, the total amount due is:',
        amount: this.grandTotal
      };
    }

    const data: IPaymentData = {
        saleID: this.orderDetails.orderID,
        paymentType: this.paymentDetails.paymentType,
        amount: this.grandTotal
      };

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '40vw',
      data: this.paymentDetails
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isLoading = true;
      this.service.makePayment(data).subscribe(res => {
        this.isLoading = false;
        this.router.navigateByUrl('point-of-sales-home');
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
    });
  }

  doComplete() {
    this.isLoading = true;
    this.service.completeOrder(this.orderDetails.orderID).subscribe(res => {
      this.isLoading = false;
      this.router.navigateByUrl('point-of-sales-home');
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }
}
