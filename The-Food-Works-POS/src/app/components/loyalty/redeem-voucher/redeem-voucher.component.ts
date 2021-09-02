import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-redeem-voucher',
  templateUrl: './redeem-voucher.component.html',
  styleUrls: ['./redeem-voucher.component.scss']
})
export class RedeemVoucherComponent implements OnInit {

  searchForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: [''],
      dateInput: [''],
    });
  }

}
