import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Branch, DailySales, SalesReportParameters, StockReportParameters } from 'src/app/interfaces/report';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/services/report/report.service';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generate-sales-report',
  templateUrl: './generate-sales-report.component.html',
  styleUrls: ['./generate-sales-report.component.scss']
})
export class GenerateSalesReportComponent implements OnInit {
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
  branches = this.service.getBranches();
  tableData: any;
  graphData: any;
  branchName = '';
  reportParams: SalesReportParameters;
  filterForm!: FormGroup;
  filterGroup = this.fb.group({
    endDate: ['', Validators.required],
    BranchId: [null, Validators.required]
  });
  public categoryList: Branch[] = [];
  created = false;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Accumulated Sales (R)'
        }
      }],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
        },
      ],
    },
  };
  barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  barChartType: Chart.ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: Chart.ChartDataSets[] = [
    // { data: this.service.y1, label: '2015' },
    // { data: this.service.y2, label: '2016' },
    // { data: this.service.y3, label: '2017' },
    { data: this.service.y4, label: '2018' },
    { data: this.service.y5, label: '2019' },
    { data: this.service.y6, label: '2020' },
    { data: this.service.y7, label: '2021' },
  ];



  ngOnInit() {
    this.filterForm = this.fb.group({
      endDate: ['', Validators.required],
      BranchId: [null, Validators.required]
    });
    this.observeCategories.subscribe(data => {
      this.categoryData = data;
      console.log(this.categoryData);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    this.reportParams = this.filterForm.value;
  }

  generateReport(input: any) {
    for (let i = 0; i < this.categoryData.length; i++)
      if (this.reportParams.BranchId === this.categoryData[i].BranchId) {
        this.branchName = this.categoryData[i].BranchName;
        console.log(this.branchName);
      }
      else {
        this.branchName = 'branch';
      }
    // POPULATE TABLE
    this.service.GetReportData(this.filterForm.value).subscribe(res => {
      this.tableData = res;
    });
    // GET CHART DATA
    this.service.getAccumulatedSales(this.filterForm.value).subscribe(data => {
      this.graphData = data;
      // console.log(data, 'HELLO');
      for (const item of data) {
        if (item.Year === 2015) {
          this.service.y1.push(item.SaleTotal);
        }
        if (item.Year === 2016) {
          this.service.y2.push(item.SaleTotal);
        }
        if (item.Year === 2017) {
          this.service.y3.push(item.SaleTotal);
        }
        if (item.Year === 2018) {
          this.service.y4.push(item.SaleTotal);
        }
        if (item.Year === 2019) {
          this.service.y5.push(item.SaleTotal);
        }
        if (item.Year === 2020) {
          this.service.y6.push(item.SaleTotal);
        }
        if (item.Year === 2021) {
          this.service.y7.push(item.SaleTotal);
        }
      }
    });
    this.created = true;
  }
  // tslint:disable-next-line:member-ordering
  @ViewChild('htmlData') htmlData: ElementRef | any;

  public openPDF() {
    // tslint:disable-next-line:no-non-null-assertion
    const Data = document.getElementById('content')!;
    // Canvas Options
    html2canvas(Data).then(div => {
      const fileWidth = 180;
      const fileHeight = div.height * fileWidth / div.width;
      const contentDataURL = div.toDataURL('image/png');

      const PDF = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const topPosition = 8;
      const leftPosition = 0;
      PDF.addImage(contentDataURL, 'PNG', leftPosition, topPosition, fileWidth, fileHeight);
      PDF.save('SalesReport.pdf');
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
        console.log('hi');
      }
      else {
        console.log('BAD');
      }
    });
  }
}
