/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/ban-types */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SignaturePad } from 'angular2-signaturepad';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-complete-delivery',
  templateUrl: './complete-delivery.page.html',
  styleUrls: ['./complete-delivery.page.scss'],
})
export class CompleteDeliveryPage implements OnInit, AfterViewInit {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signatureImg: string;
  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 700,
    'canvasHeight': 300
  };

  hasSign = false;
  completeInfo: any;

  constructor(private service: DriverService, private router: Router, private toast: ToastController) { }

  ngOnInit() {
    this.service.getCompleteInfo().subscribe(res => {
      this.completeInfo = res;
    });
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 2);
    this.signaturePad.clear();
  }

  drawComplete() {
    this.hasSign = true;
  }

  drawStart() {
    console.log('begin drawing');
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.service.completeDelivery(this.signatureImg).subscribe(res => {
      this.router.navigateByUrl('driver-map');
    }, error => {
      this.presentFailToast();
    });
    this.clearSignature();
  }

  clearSignature() {
    this.hasSign = false;
    this.signaturePad.clear();
  }

  doReturn() {
    this.service.returnDelivery().subscribe(res => {
      this.router.navigateByUrl('driver-map');
    }, error => {
      this.presentFailToast();
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
}
