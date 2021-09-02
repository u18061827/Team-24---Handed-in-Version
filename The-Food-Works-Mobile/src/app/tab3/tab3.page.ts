import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from '../services/access.service';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private customerService: CustomerService , private authService: AccessService, private router: Router) {}

  doLogout() {
    this.customerService.setLogout();
    this.authService.doLogout();
    this.router.navigateByUrl('shop-location');
  }
}
