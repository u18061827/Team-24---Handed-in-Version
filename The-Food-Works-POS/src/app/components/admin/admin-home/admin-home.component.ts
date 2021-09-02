import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { YourNameModalComponent } from '../../modals/your-name-modal/your-name-modal.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openDialog() {
    // this.dialog.open(YourNameModalComponent);
  }

  ngOnInit(): void {
  }
}
