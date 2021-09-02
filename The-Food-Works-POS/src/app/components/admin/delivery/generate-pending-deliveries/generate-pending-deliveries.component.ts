import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeliveryService } from 'src/app/services/delivery.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { IDelivery, IDeliverySplit, ISplit } from 'src/app/interfaces/delivery';
import { GenerateConfirmationComponent } from '../generate-confirmation/generate-confirmation.component';
import { Router } from '@angular/router';
// import { GenerateConfirmationComponent } from '../generate-confirmation/generate-confirmation.component';

@Component({
  selector: 'app-generate-pending-deliveries',
  templateUrl: './generate-pending-deliveries.component.html',
  styleUrls: ['./generate-pending-deliveries.component.scss']
})
export class GeneratePendingDeliveriesComponent implements OnInit {

  constructor(private fb: FormBuilder, private dialog: MatDialog, private service: DeliveryService, private router: Router) { }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  deliveries: IDelivery[];
  selectedDeliveries: string[] = [];
  drivers: any;
  selectedDrivers: string[] = [];
  deliveryValidator: number;
  driverValidator: number;
  deliveryNext: boolean;
  driverNext: boolean;
  dragDrop: ISplit[] = [];
  addressObject: IDeliverySplit[] = [];

  ngOnInit() {

    this.service.getPendingDeliveries().subscribe((res: any) => {
      this.deliveries = res;
    });

    this.service.getDrivers().subscribe(res => {
      this.drivers = res;
    });

    // this.drivers = DRIVER_DATA;

    this.firstFormGroup = this.fb.group({

    });
    this.secondFormGroup = this.fb.group({

    });
    this.deliveryValidator = 0;
    this.driverValidator = 0;
    this.deliveryNext = true;
    this.driverNext = true;
  }

  onDeliverySelect(event: MatCheckboxChange, deliveryID: any, deliveryAddress: string) {
    this.dragDrop = [];
    this.addressObject = [];

    const delivery = 'Delivery ID ' + deliveryID.toString() + ' - ' + deliveryAddress;
    if (event.checked) {
      this.deliveryValidator += 1;
      this.selectedDeliveries.push(delivery);
    } else {
      this.deliveryValidator -= 1;
      this.selectedDeliveries = this.selectedDeliveries.filter((zz: any) => zz !== delivery);
    }

    if (this.deliveryValidator > 0) {
      this.deliveryNext = false;
    } else {
      this.deliveryNext = true;
    }
  }

  onDriverSelect(event: MatCheckboxChange, driverID: string, driverName: string, driverSurname: string) {
    this.dragDrop = [];
    this.addressObject = [];

    const driver = 'Employee ID ' + driverID + ' - ' + driverName + ' ' + driverSurname;
    if (event.checked) {
      this.driverValidator += 1;
      this.selectedDrivers.push(driver);
    } else {
      this.driverValidator -= 1;
      this.selectedDrivers = this.selectedDrivers.filter((zz: any) => zz !== driver);
    }

    if (this.driverValidator > 0) {
      this.driverNext = false;
    } else {
      this.driverNext = true;
    }

    if (this.selectedDrivers.length > this.selectedDeliveries.length) {
      this.driverNext = true;
    } else {
      this.driverNext = false;
    }
  }

  doSplit() {
    const result = this.splitToChunks(this.selectedDeliveries, this.selectedDrivers.length);
    let i = 0;
    this.selectedDrivers.forEach(element => {
      this.addressObject = [];
      result[i].forEach((splitAddress: any) => {
        this.addressObject.push({
          address: splitAddress
        });
      });
      this.dragDrop.push({
        driver: element,
        splitDeliveries: this.addressObject
      });
      i++;
    });

    console.log(this.dragDrop);
  }

  splitToChunks(array: any, parts: any) {
    const result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(GenerateConfirmationComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.service.generatePendingDeliveries(this.dragDrop).subscribe(res => {
        this.router.navigateByUrl('admin');
      }, (error: any) => {
        console.log(error);
      });
    });
  }
}
