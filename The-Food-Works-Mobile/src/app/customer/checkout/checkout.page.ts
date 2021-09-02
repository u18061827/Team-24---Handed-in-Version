import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ICartItem } from 'src/app/interfaces/cart';
import { ICheckoutData } from 'src/app/interfaces/checkout';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, AfterViewInit {

  checkoutForm: FormGroup;
  deliveryDisable: boolean;
  payStoreDisable: boolean;
  isPay = true;
  confirmDelivery: string;
  checkoutTotal: any;
  cartItems: ICartItem[];
  vatAmount: any;
  cardToken: string;

  constructor(private fb: FormBuilder, private alert: AlertController, public navCtrl: NavController,
    private service: CustomerService, private router: Router, private loadingController: LoadingController,
    private toast: ToastController) { }

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      completionMethod: ['', [
        Validators.required,
      ]],
      paymentMethod: ['', [
        Validators.required,
      ]]
    });

    this.service.getAllCartItems().subscribe((data: any) => {
      this.cartItems = data;
      this.checkoutTotal = 0;
      this.vatAmount = 0;
      this.cartItems.forEach(element => {
        const productTotal = (element.productPrice * element.quantity);
        this.checkoutTotal += productTotal;
        this.vatAmount += (productTotal * (this.service.vatPercentage / 100));
      });

      this.checkoutTotal += this.vatAmount;

      this.vatAmount = Math.round((this.vatAmount + Number.EPSILON) * 100) / 100;
      this.checkoutTotal = Math.round((this.checkoutTotal + Number.EPSILON) * 100) / 100;
    });
  }

  ngAfterViewInit() {
    this.getYoco().then(yoco => {
      const script = document.createElement('script');
      script.src = '../../../assets/scripts/yoco.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }).catch(err => {
      console.log(err);
    });
  }

  onCompSelect(event: any) {
    if (event.detail.value === '1') {
      this.payStoreDisable = true;
      // eslint-disable-next-line max-len
      this.confirmDelivery = '<br><hr><ion-icon name="alert-circle-outline"></ion-icon> Please ensure your account address is correct before proceeding.';
    } else {
      this.payStoreDisable = false;
      this.confirmDelivery = '';
    }
  }

  onPaySelect(event: any) {
    if (event.detail.value === '1') {
      this.deliveryDisable = true;
      this.isPay = false;
    } else {
      this.deliveryDisable = false;
      this.isPay = true;
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Total',
      message: 'Please confirm your order total of R ' + this.checkoutTotal + this.confirmDelivery,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: () => {
            this.doCheckout();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
  }

  doCheckout(){
    this.presentLoading().then(() => {
      const data = {
        token: this.cardToken,
        amount: this.checkoutTotal * 100,
        customerID: this.service.customerID,
        completionMethod: this.checkoutForm.get('completionMethod').value,
        paymentMethod: this.checkoutForm.get('paymentMethod').value
      };
      this.service.doCheckout(data).subscribe(res => {
        this.loadingController.dismiss().then(() => {
          this.router.navigateByUrl('thank-you');
        });
      }, error => {
        this.loadingController.dismiss().then(() => {
          this.presentFailToast();
        });
      });
    });
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Something went wrong.',
      position: 'top',
      color: 'danger',
      duration: 2000,
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  private getYoco(): Promise<any> {
    const win = window as any;
    const yocoModule = win.YocoSDK;
    if (yocoModule) {
      return Promise.resolve(yocoModule);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedYocoModule = win.YocoSDK;
        if(loadedYocoModule) {
          resolve(loadedYocoModule);
        } else {
          reject('Yoco SDK not available');
        }
      };
    });
  }
}
