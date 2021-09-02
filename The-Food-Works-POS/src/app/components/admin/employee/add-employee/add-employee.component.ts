import { userEmployee } from './../../../../interfaces/userEmployee';
import { branchDropDown } from './../../../../interfaces/branchDropDown';
import { MatInputModule } from '@angular/material/input';
import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EmployeeServiceService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/interfaces/employee';
import { User } from 'src/app/interfaces/user';
import { SuccessModalComponent } from 'src/app/components/modals/success-modal/success-modal.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
/*import {MaxSizeValidation} from '@angular-material-components'*/


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  constructor(private EmployeeService: EmployeeServiceService, private _snackBar: MatSnackBar, public dialog: MatDialog, private route: Router) { }
  form: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z ]*$')]),

    surname: new FormControl("", [Validators.required, Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z ]*$')]),

    IDNumber: new FormControl("", [Validators.required,
    Validators.pattern("^[0-9]*$"), Validators.minLength(13), Validators.maxLength(13)]),

    telephone: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10),
    Validators.maxLength(10)]),

    email: new FormControl("", [Validators.email, Validators.maxLength(50)]),

    branch: new FormControl("", Validators.required),

    password: new FormControl("", Validators.required),

    confirmPassword: new FormControl("", Validators.required),

    userRole: new FormControl("", Validators.required),
  });

  //Data Members for Inputs
  color: ThemePalette = "primary";
  disabled: boolean = false;
  multiple: boolean = false;
  accept: string;
  fileControl: FormControl;

  public options = [
    { value: true, label: "True" },
    { value: false, label: "False" },
  ];

  public listColors = ['primary', 'accent', 'warning'];

  public listAccepts = [
    null, ".pdf"
  ];

  public files: any;
  maxSize = 240;


  ngOnInit(): void {
    //File Input
    /*this.fileControl.valueChanges.subscribe((files:any)=>{
      if(!Array.isArray(files))
      {
        this.files = [files];
      }
      else
      {
        this.files = files;
      }
    })*/

    this.getBranches();
    this.getUserRoles();
  }

  onDisabledChanged(value: boolean) {
    if (!value) {
      this.fileControl.enable();
    }
    else {
      this.fileControl.disable();
    }
  }

  toAddEmployee: userEmployee;

  writeNewEmployee(formDetails: any) {
    if (formDetails.password == formDetails.confirmPassword) {
      this.toAddEmployee = {
        employeeName: formDetails.name,
        employeeSurname: formDetails.surname,
        EmployeeIdNumber: formDetails.IDNumber,
        employeeTelephone: formDetails.telephone,
        employeeEmail: formDetails.email,
        BranchId: formDetails.branch,
        UserUsername: formDetails.email,
        UserPassword: formDetails.password,
        UserRoleId: formDetails.userRole,
      }


      this.EmployeeService.writeNewEmployee(this.toAddEmployee).subscribe(res => {

        console.log(res);
        const success = this.dialog.open(SuccessModalComponent, {
          disableClose: true,
          data: {
            message: 'Congratulations! You are now registered as a Food Works Employee.'
          }
        })

        success.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.route.navigateByUrl('/admin');
        });

      }, (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 404) {
          this._snackBar.open('Registration of Employee Failed. 404 Error!', 'OK');

        }
        else if (error.status === 500) {
          this._snackBar.open('Employee already exists', 'OK');
        }
      }
      );

    }
    else {
      this._snackBar.open('Passwords do not match!', 'OK');
    }
  }
  branches: any;
  getBranches() {
    this.branches = this.EmployeeService.getBranches().subscribe(res => {

      this.branches = res;
    })
  }
  userRoles: any;
  getUserRoles() {
    this.EmployeeService.getUserRoles().subscribe(res => {
      this.userRoles = res;
    })
  }


}
