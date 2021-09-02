import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AccessService } from 'src/app/services/access.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-shop-location',
  templateUrl: './shop-location.page.html',
  styleUrls: ['./shop-location.page.scss'],
})
export class ShopLocationPage implements OnInit {

  shopLocationForm: FormGroup;
  locations: any;
  isAuthorized: boolean;

  constructor(private fb: FormBuilder, private service: CustomerService, private authService: AccessService, private router: Router ) {
    this.router.events.subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
        this.isAuthorized = this.authService.getAuthentication();
      }
    });
  }

  ngOnInit() {
    // formbuilder formgroup and form validation
    this.shopLocationForm = this.fb.group({
      shopLocation: ['', [
        Validators.required,
      ]],
    });

    this.service.getBranchData().subscribe(data => {
      this.locations = data;
    });

    this.isAuthorized = this.authService.getAuthentication();
  }

  onChange(value) {
    this.service.setBranchID(value);
  }

}
