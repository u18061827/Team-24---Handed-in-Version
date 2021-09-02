import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/services/access.service';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.page.html',
  styleUrls: ['./driver-home.page.scss'],
})
export class DriverHomePage implements OnInit {

  isAssigned = false;

  constructor(private driverService: DriverService, private authService: AccessService, private router: Router) { }

  ngOnInit() {
    this.driverService.getRoute().subscribe((res: any) => {
      console.log(res);
      if(res.length > 0){
        this.isAssigned = true;
        this.driverService.setWaypoints(res);
      }
    });
  }

  doLogout() {
    this.driverService.setLogout();
    this.authService.doLogout();
    this.router.navigateByUrl('shop-location');
  }
}
