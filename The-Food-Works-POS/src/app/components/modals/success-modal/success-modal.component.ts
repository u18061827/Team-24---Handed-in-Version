import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit {

  heading = this.data.heading;
  message = this.data.message;

  constructor(@Inject (MAT_DIALOG_DATA) public data: {heading: string, message: string}, private dialogRef: MatDialogRef<SuccessModalComponent>) { }

  ngOnInit(): void {
  }

  onCancel()
  {
    this.dialogRef.close(false);
  }

  onConfirm()
  {
    this.dialogRef.close(true);
  }
}
