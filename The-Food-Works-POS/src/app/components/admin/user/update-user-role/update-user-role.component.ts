import { AdminService } from './../../../../services/admin/admin.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRole } from 'src/app/interfaces/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-update-user-role',
  templateUrl: './update-user-role.component.html',
  styleUrls: ['./update-user-role.component.scss']
})
export class UpdateUserRoleComponent implements OnInit {

  updateUserRoleForm!: FormGroup;
  toUpdateRole: UserRole;
  userRoles: any;

  constructor(private adminService: AdminService, @Inject(MAT_DIALOG_DATA) public data: UserRole,
              public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateUserRoleComponent>) { }

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.getUserRoles();
    this.form.patchValue({
      name: this.data.name,
      description: this.data.description,
    });
  }
  getUserRoles()
  {
    this.adminService.getAllUserRoles().subscribe(res => {
      this.userRoles = res;
    });
  }

  updateUserRole(formValue: any) {
    this.toUpdateRole =
    {
      ID: this.data.ID,
      name: formValue.name,
      description: formValue.description
    };
    console.log(this.toUpdateRole);
    this.adminService.updateUserRole(this.toUpdateRole).subscribe(res => {
      const success = this.dialog.open(SuccessModalComponent, {
        disableClose: false,
        data: {
          message: 'The User Role details have been successfully updated'
        }
      });
      success.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.dialogRef.close();
        window.location.reload();

      });
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: false,
      data: {
        heading: 'Confirm User Role Update',
        message: 'Are you sure you would update this user role?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res)
      {
        console.log('hi');
        this.updateUserRole(this.form.value);
      }
      else
      {
        console.log('BAD');
      }
    });


  }
}
