import { UpdateEmployeeComponent } from './../update-employee/update-employee.component';

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EmployeeServiceService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/interfaces/employee';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-maintain-employee',
  templateUrl: './maintain-employee.component.html',
  styleUrls: ['./maintain-employee.component.scss']
})
export class MaintainEmployeeComponent implements AfterViewInit {

  form: FormGroup;
  viewEmployee: any;
  viewEmployeeUpdate: any;


  Employees: any;

  displayedColumns: string[] = ['fullname', 'DOB', 'telephone', 'update', 'view'];
  dataSource = new MatTableDataSource<Employee>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;




  constructor(private EmployeeService: EmployeeServiceService, private _snackBar: MatSnackBar, private formBuilder: FormBuilder, public dialog: MatDialog) { }




  ngAfterViewInit(): void {
    this.getAllEmployees();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.form = this.formBuilder.group({
      name: [""],
      surname: [""],
      IDNumber: [""],
      telephone: [""],
      email: [""],
      branch: [""],
    })
  }

  goBack() {
    // tslint:disable-next-line:no-unused-expression
    this.viewEmployee == null;
    window.location.reload();
  }
  getAllEmployees() {
    this.EmployeeService.getAllEmployees().subscribe(res => {
      this.Employees = res;
      this.dataSource.data = this.Employees;



    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  toSendData: Employee;


  getEmployeeDetails(employeeIDRecieved: any) {

    return this.EmployeeService.getEmployeeDetais(employeeIDRecieved).subscribe(res => {
      this.viewEmployee = res;
      console.log(this.viewEmployee);

      this.form.patchValue({
        name: this.viewEmployee.employeeName,
        surname: this.viewEmployee.employeeSurname,
        IDNumber: this.viewEmployee.employeeIdNumber,
        telephone: this.viewEmployee.employeeTelephone,
        email: this.viewEmployee.employeeEmail,
        branch: this.viewEmployee.branchName,
      });

    });

  }

  getEmployeeDetailsUpdate(employeeIDRecieved: any) {

    return this.EmployeeService.getEmployeeDetais(employeeIDRecieved).subscribe(res => {
      this.viewEmployeeUpdate = res;
      console.log(this.viewEmployeeUpdate.userID)
      const dialogRef = this.dialog.open(UpdateEmployeeComponent, {
        disableClose: true,
        width: 'auto',
        data: {
          employeeName: this.viewEmployeeUpdate.employeeName,
          employeeSurname: this.viewEmployeeUpdate.employeeSurname,
          EmployeeIdNumber: this.viewEmployeeUpdate.employeeIdNumber,
          employeeTelephone: this.viewEmployeeUpdate.employeeTelephone,
          employeeEmail: this.viewEmployeeUpdate.employeeEmail,
          BranchId: this.viewEmployeeUpdate.branchId,
          UserRoleId: this.viewEmployeeUpdate.userRoleId,
          UserStatusId: this.viewEmployeeUpdate.userStatus,
          UserId: this.viewEmployeeUpdate.userID,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });


    });
  }
}
