import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrders } from 'src/app/interfaces/orders';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.page.html',
  styleUrls: ['./view-orders.page.scss'],
})
export class ViewOrdersPage implements OnInit {

  customPickerOptions: any;
  orders: IOrders[];
  isOrders: boolean;

  constructor(private service: CustomerService, private router: Router) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Select',
        handler: () => console.log('Clicked Save!')
      }]
    };
  }

  ngOnInit() {
    this.service.getAllOrders().subscribe((data: IOrders[]) => {
      this.orders = data;
      if(this.orders.length > 0){
        this.isOrders = true;
      } else {
        this.isOrders = false;
      }
    });
  }

  onClick(orderID: any){
    this.service.setOrderID(orderID);
    this.router.navigateByUrl('view-order');
  }
}
