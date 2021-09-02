import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-request-email',
  templateUrl: './request-email.component.html',
  styleUrls: ['./request-email.component.scss']
})
export class RequestEmailComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RequestEmailComponent>) { }

  EmailAddress: string;
  ngOnInit(): void {
  }

  onCancel()
  {
    this.dialogRef.close(false);
  }

  onConfirm(emailAddress : string)
  {
    console.log(emailAddress);
    this.dialogRef.close(emailAddress);
  }

}
