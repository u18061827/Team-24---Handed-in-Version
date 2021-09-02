import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AdminService } from 'src/app/services/admin/admin.service';
import { UpdateUserRoleComponent } from '../update-user-role/update-user-role.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserRole } from 'src/app/interfaces/admin';
@Component({
  selector: 'app-maintain-user',
  templateUrl: './maintain-user.component.html',
  styleUrls: ['./maintain-user.component.scss']
})
export class MaintainUserComponent implements AfterViewInit {

  viewUserRole: any;
  UserRoles: any;
  displayedColumns: string[] = ['ID', 'name', 'description', 'update' ];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource = new MatTableDataSource<UserRole>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

 constructor(private adminService: AdminService, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.getAllUserRoles();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllUserRoles()
  {
    this.adminService.getAllUserRoles().subscribe(res =>
      {
        this.UserRoles = res;
        this.dataSource.data = this.UserRoles;
        console.log(this.UserRoles);
      });
  }

  // For Update
  getRole(UserRoleId: number)
  {
    console.log(UserRoleId);
    return this.adminService.findUserRole(UserRoleId).subscribe(res => {
      this.viewUserRole = res;
      console.log(res);
      const dialogRef = this.dialog.open(UpdateUserRoleComponent, {
       disableClose: true,
       width: 'auto',
       data: {ID: this.viewUserRole.id,
       name : this.viewUserRole.name,
       description:  this.viewUserRole.description,
     }
     });

      dialogRef.afterClosed().subscribe(() => {
       console.log('The dialog was closed');
     });


   });
  }

  openModal()
  {
     const dialogRef = this.dialog.open(AddUserComponent, {
       disableClose: true,
       width: 'auto',
     });

  }
}
