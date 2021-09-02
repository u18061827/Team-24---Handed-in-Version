import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPaymentDialog } from 'src/app/interfaces/payment';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

  counter: { min: number, sec: number };
  btnEnabled: boolean;
  btnTitle: any;

  paymentDetails: IPaymentDialog;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IPaymentDialog) { }

  ngOnInit(): void {
    this.btnEnabled = true;
    this.btnTitle = 'Wait (30s)';
    this.startTimer();
    this.paymentDetails = this.data;
  }

  startTimer() {
    this.counter = { min: 0, sec: 30 };
    const intervalId = setInterval(() => {
      if (this.counter.sec - 1 === -1) {
        this.counter.min -= 1;
        this.counter.sec = 59;
      } else {
        this.counter.sec -= 1;
        this.btnTitle = 'Wait (' + this.counter.sec + 's)';
      }
      if (this.counter.min === 0 && this.counter.sec === 0) {
        clearInterval(intervalId);
        this.btnTitle = 'Complete Sale';
        this.btnEnabled = false;
      }
    }, 1000);
  }
}
