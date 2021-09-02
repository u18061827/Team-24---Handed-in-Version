import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import 'pdfmake/build/vfs_fonts';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Branch, StockReportParameters } from 'src/app/interfaces/report';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/services/report/report.service';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {
  // NAVBAR REQUIREMENTS
  constructor(private fb: FormBuilder, private http: HttpClient, private service: ReportService, public dialog: MatDialog,
    private router: Router, public userService: UserService, private snack: MatSnackBar) {
    this.svc = userService;
    this.userName = userService.userInfo.displayName!;
  }
  userName = '';
  displayName = '';
  svc: any;

  getUserName() {
    if (this.svc.userInfo.displayName == null || undefined) {
      this.router.navigateByUrl('login');
      return 'dummy';
    }
    else if (this.svc.userInfo.displayName != null) {
      return this.svc.userInfo.displayName!;
    }
  }
  // --------------
  observeCategories: Observable<Branch[]> = this.service.getBranches();
  categoryData: Branch[];
  tableData: any;
  branchName = '';
  total = 0;
  ingredientTableData: any;
  reportParams: StockReportParameters = {
    BranchId: 0,
    startDate: 2019 / 0o1 / 0o1,
    endDate: 2022 / 0o1 / 0o1

  };
  public categoryList: Branch[] = [];
  created = false;
  ngOnInit() {
    this.observeCategories.subscribe(data => {
      this.categoryData = data;
      console.log(this.categoryData);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }
  generateReport() {
    this.service.getProductTableReportData(this.reportParams).subscribe(res => {
      if (this.reportParams.BranchId === 1) {
        this.branchName = 'Centurion';
      }
      else {
        this.branchName = 'Moreletta Park';
      }
      for (const item of res) {
        this.total += item.ValueOnHand;
      }
      console.log(res);
      this.tableData = res;
    });
    this.service.getIngredientTableReportData(this.reportParams).subscribe(data => {
      console.log(data);
      this.ingredientTableData = data;
    });
    this.created = true;
  }

  public openPDF(action = 'open') {
    // tslint:disable-next-line:no-non-null-assertion
    const Data = document.getElementById('content')!;

    // pdfMake.createPdf(docDefinition).open();
    // Canvas Options
    html2canvas(Data).then(div => {
      const fileWidth = 210;
      const fileHeight = div.height * fileWidth / div.width;
      const contentDataURL = div.toDataURL('src/assets/images/Food works.jpg');
      const PDF = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const topPosition = 8;
      const leftPosition = 0;
      // PDF.addImage(contentDataURL, 0, 0, 208, fileHeight);
      PDF.addImage(contentDataURL, 'JPEG', leftPosition, topPosition, fileWidth, fileHeight);
      PDF.save('StockReport.pdf');
    });
  }

  openModal() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Leaving already?',
        message: 'Are you sure you want to log out?'
      }
    });
    confirm.afterClosed().subscribe(res => {
      if (res) {
        // tslint:disable-next-line:label-position
        // tslint:disable-next-line:no-unused-expression
        // this.router.navigate(['items'], { relativeTo: this.route });
        this.router.navigateByUrl('/login');
        console.log('hi');
      }
      else {
        console.log('BAD');
      }
    });
  }
}
