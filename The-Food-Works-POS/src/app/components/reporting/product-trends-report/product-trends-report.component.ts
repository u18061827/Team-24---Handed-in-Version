import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-trends-report',
  templateUrl: './product-trends-report.component.html',
  styleUrls: ['./product-trends-report.component.scss']
})
export class ProductTrendsReportComponent implements OnInit {

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
  avg = 0;
  tot = 0;
  count = 0;
  reportParams: StockReportParameters;
  filterForm!: FormGroup;
  public categoryList: Branch[] = [];
  created = false;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Quantity Sold'
        }
      }],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Product',
          },
        },
      ],
    },
  };
  barChartLabels: Label[] = this.service.labels;
  barChartType: Chart.ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: Chart.ChartDataSets[] = [
    { data: this.service.data, label: 'Quantity Sold' }
  ];

  @ViewChild('htmlData') htmlData: ElementRef | any;

  ngOnInit() {
    this.filterForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      BranchId: [null, Validators.required]
    });
    this.observeCategories.subscribe(data => {
      this.categoryData = data;
      console.log(this.categoryData);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }
  generateReport(input: any) {
    this.reportParams = this.filterForm.value;
    this.service.getProductQuantities(this.filterForm.value).subscribe(res => {
      console.log('HI');
      this.tableData = res;
      console.log(res);
      for (const item of res) {
        this.service.labels.push(item.product_name);
        this.service.data.push(item.quantity);
        this.tot += item.quantity;
        this.count += 1;
      }
      this.avg = this.tot / this.count;

      console.log(this.service.labels);
    });
    this.created = true;
  }

  public openPDF() {
    // tslint:disable-next-line:no-non-null-assertion
    const Data = document.getElementById('content')!;
    // Canvas Options
    html2canvas(Data).then(div => {
      const fileWidth = 210;
      const fileHeight = div.height * fileWidth / div.width;
      const contentDataURL = div.toDataURL('image/png');

      const PDF = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const topPosition = 8;
      const leftPosition = 0;
      PDF.addImage(contentDataURL, 'PNG', leftPosition, topPosition, fileWidth, fileHeight);
      PDF.save('ProductTrendsReport.pdf');
    });
  }
}
