import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/access/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/access/forgot-password/forgot-password.component';
import { CashUpComponent } from './components/point-of-sales/cash-up/cash-up.component';
import { SearchSaleComponent } from './components/point-of-sales/search-sale/search-sale.component';
import { ReceiveSupplierOrderComponent } from './components/admin/supplier-order/receive-supplier-order/receive-supplier-order.component';
import { MaintainSupplierOrderComponent } from './components/admin/supplier-order/maintain-supplier-order/maintain-supplier-order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Imported Home Components
import { HomeComponent } from './components/home/home/home.component';

// Imported Admin Components
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';

// Imported POS Components
import { PointOfSalesHomeComponent } from './components/point-of-sales/point-of-sales-home/point-of-sales-home.component';
import { CompleteOrderComponent } from './components/point-of-sales/complete-order/complete-order.component';

// Imported Reporting Components
import { ReportingHomeComponent } from './components/reporting/reporting-home/reporting-home.component';
import { ProductTrendsReportComponent } from './components/reporting/product-trends-report/product-trends-report.component';
import { GenerateSalesReportComponent } from './components/reporting/generate-sales-report/generate-sales-report.component';
import { StockReportComponent } from './components/reporting/stock-report/stock-report.component';


// Imported Training Module Components (Training Subsystem)
import { TrainingModulesHomeComponent } from './components/training-modules/training-modules-home/training-modules-home.component';
import { TrainingModulesContentComponent } from './components/training-modules/training-modules-content/training-modules-content.component';
import { TrainingModulesContentViewComponent } from './components/training-modules/training-modules-content-view/training-modules-content-view.component';

// Imported Access Components
import { LoginComponent } from './components/access/login/login.component';

// Imported Delivery Components
import { ViewDeliveryComponent } from './components/admin/delivery/view-delivery/view-delivery.component';
import { GeneratePendingDeliveriesComponent } from './components/admin/delivery/generate-pending-deliveries/generate-pending-deliveries.component';

// Imported User Components
import { MaintainUserComponent } from './components/admin/user/maintain-user/maintain-user.component';
import { AddUserComponent } from './components/admin/user/add-user/add-user.component';
import { UpdateUserRoleComponent } from './components/admin/user/update-user-role/update-user-role.component';

// Imported Customer Order Components
import { MaintainCustomerOrderComponent } from './components/admin/customer-order/maintain-customer-order/maintain-customer-order.component';
import { UpdateCustomerOrderComponent } from './components/admin/customer-order/update-customer-order/update-customer-order.component';

// Imported Training Components (Admin Subsystem for Training)
import { MaintainTrainingModuleComponent } from './components/admin/training/maintain-training-module/maintain-training-module.component';
import { MaintainTrainingModuleTypeComponent } from './components/admin/training/maintain-training-module-type/maintain-training-module-type.component';
import { CreateTrainingModuleTypeComponent } from './components/admin/training/create-training-module-type/create-training-module-type.component';
import { CreateTrainingModuleComponent } from './components/admin/training/create-training-module/create-training-module.component';
import { UpdateTrainingModuleComponent } from './components/admin/training/update-training-module/update-training-module.component';

// Imported Supplier Components
import { MaintainSupplierComponent } from './components/admin/supplier/maintain-supplier/maintain-supplier.component';
import { AddSupplierComponent } from './components/admin/supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './components/admin/supplier/update-supplier/update-supplier.component';

// Imported Employee Components
import { MaintainEmployeeComponent } from './components/admin/employee/maintain-employee/maintain-employee.component';
import { AddEmployeeComponent } from './components/admin/employee/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './components/admin/employee/view-employee/view-employee.component';
import { UpdateEmployeeComponent } from './components/admin/employee/update-employee/update-employee.component';

// Imported Product Components
import { MaintainProductComponent } from './components/admin/product/maintain-product/maintain-product.component';
import { AddProductComponent } from './components/admin/product/add-product/add-product.component';
import { UpdateProductComponent } from './components/admin/product/update-product/update-product.component';

// Imported Customer Components
import { MaintainCustomerComponent } from './components/admin/customer/maintain-customer/maintain-customer.component';
import { RegisterCustomerComponent } from './components/admin/customer/register-customer/register-customer.component';
import { UpdateCustomerComponent } from './components/admin/customer/update-customer/update-customer.component';

// Imported Manufacturing Components
import { MaintainBatchComponent } from './components/admin/manufacturing/maintain-batch/maintain-batch.component';
import { CreateBatchComponent } from './components/admin/manufacturing/create-batch/create-batch.component';
import { ReconcileCookingListComponent } from './components/admin/manufacturing/reconcile-cooking-list/reconcile-cooking-list.component';

import { UpdateBatchComponent } from './components/admin/manufacturing/update-batch/update-batch.component';

// Imported Branch Components
import { MaintainBranchComponent } from './components/admin/branch/maintain-branch/maintain-branch.component';
import { CreateBranchComponent } from './components/admin/branch/create-branch/create-branch.component';
import { ReceiveBranchStockComponent } from './components/admin/branch/receive-branch-stock/receive-branch-stock.component';
import { DoBranchStockTakeComponent } from './components/admin/branch/do-branch-stock-take/do-branch-stock-take.component';
import { RequestBranchStockComponent } from './components/admin/branch/request-branch-stock/request-branch-stock.component';
import { ViewBranchComponent } from './components/admin/branch/view-branch/view-branch.component';
import { TrainingModulesHomePageComponent } from './components/training-modules/training-modules-home-page/training-modules-home-page.component';

// Imported Backup Components
import { RestoreComponent } from './components/admin/backup/restore/restore.component';
import { BackupComponent } from './components/admin/backup/backup/backup.component';
import { UpdateTrainingModuleTypeComponent } from './components/admin/training/update-training-module-type/update-training-module-type.component';
import { MaintainBranchStockComponent } from './components/admin/branch/maintain-branch-stock/maintain-branch-stock.component';
import { WriteOffComponent } from './components/admin/user/write-off/write-off.component';
import { ViewCustomerOrderComponent } from './components/admin/customer-order/view-customer-order/view-customer-order.component';
import { ForgotOTPComponent } from './components/access/forgot-otp/forgot-otp.component';
import { WriteOffDetailsComponent } from './components/admin/user/write-off-details/write-off-details.component';
import { BranchReportComponent } from './components/reporting/branch-report/branch-report.component';
import { AuditComponent } from './components/admin/audit/audit.component';


const routes: Routes = [

  // Routed Login Components
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgotOTP', component: ForgotOTPComponent },
  { path: 'reset-password', component: ResetPasswordComponent},

  // Routed Home Components
  { path: 'home', component: HomeComponent},

   // Routed Admin Components
   { path: 'admin', component: AdminHomeComponent},

   // Routed POS Components
   { path: 'point-of-sales-home', component: PointOfSalesHomeComponent},
   { path: 'search-sale', component: SearchSaleComponent},
   { path: 'cash-up', component: CashUpComponent},
   { path: 'complete-order', component: CompleteOrderComponent},

   // Routed Reporting Components
   // includes role restriction (AuthGuard)
   { path: 'report-home', component: ReportingHomeComponent},
   { path: 'report-sales', component: GenerateSalesReportComponent, canActivate: [AuthGuard]},
  { path: 'report-stock', component: StockReportComponent, canActivate: [AuthGuard] },
  { path: 'report-product-trends', component: ProductTrendsReportComponent },
   { path: 'report-branch', component: BranchReportComponent },

   // Routed Training Modules Components
   { path: 'training-module-home', component: TrainingModulesHomeComponent},

   // Routed Customer Order Components
   { path: 'admin/maintain-customer-order', component: MaintainCustomerOrderComponent},
   { path: 'admin/maintain-customer-order/update-customer-order', component: UpdateCustomerOrderComponent},
   { path: 'admin/maintain-customer-order/view-customer-order', component: ViewCustomerOrderComponent},


   // Routed Delivery Components
   { path: 'admin/view-delivery', component: ViewDeliveryComponent},
   { path: 'admin/generate-pending-deliveries', component: GeneratePendingDeliveriesComponent},

   // Routed User Components
   { path: 'admin/maintain-user-role', component: MaintainUserComponent},
   { path: 'admin/add-user-role', component: AddUserComponent},
    { path: 'admin/maintain-user-role/update-user-role', component: UpdateUserRoleComponent },
    { path: 'admin/write-off', component: WriteOffComponent },
    { path: 'admin/write-off-details', component: WriteOffDetailsComponent },
   // Routed Training Components
   { path: 'admin/maintain-training-module', component: MaintainTrainingModuleComponent},
   { path: 'admin/create-training-module', component: CreateTrainingModuleComponent},
   { path: 'admin/maintain-training-module-type', component: MaintainTrainingModuleTypeComponent},
   { path: 'admin/create-training-module-type', component: CreateTrainingModuleTypeComponent},
   { path: 'admin/maintain-training-module/update-training-module', component: UpdateTrainingModuleComponent},
   { path: 'admin/maintain-training-module-type/update-training-module-type', component: UpdateTrainingModuleTypeComponent },

   // Routed Supplier Components
   { path: 'admin/maintain-supplier', component: MaintainSupplierComponent},
   { path: 'admin/add-supplier', component: AddSupplierComponent},
   { path: 'admin/maintain-supplier/update-supplier/: id', component: UpdateSupplierComponent},

   // Routed Supplier Order Components
   { path: 'admin/maintain-supplier-order', component: MaintainSupplierOrderComponent},
   { path: 'admin/receive-supplier-order', component: ReceiveSupplierOrderComponent},

   // Routed Customer Components
   { path: 'admin/maintain-customer', component: MaintainCustomerComponent},
   { path: 'admin/register-customer', component: RegisterCustomerComponent},
   { path: 'admin/maintain-customer/update-customer', component: UpdateCustomerComponent},

   // Routed Employee Components
   { path: 'admin/maintain-employee', component: MaintainEmployeeComponent},
   { path: 'admin/add-employee', component: AddEmployeeComponent},
   { path: 'admin/maintain-employee/update-employee', component: UpdateEmployeeComponent},
   { path: 'admin/maintain-employee/view-employee', component: ViewEmployeeComponent},

   // Routed Product Components
   { path: 'admin/maintain-product', component: MaintainProductComponent},
   { path: 'admin/add-product', component: AddProductComponent},
   { path: 'admin/maintain-product/update-product', component: UpdateProductComponent},

   // Routed Manufacturing Components
   { path: 'admin/maintain-batch', component: MaintainBatchComponent},
   { path: 'admin/reconcile-cooking-list', component: ReconcileCookingListComponent},
   { path: 'admin/create-batch', component: CreateBatchComponent},
   { path: 'admin/maintain-batch/update-batch', component: UpdateBatchComponent},

   // Routed Branch Components
   { path: 'admin/maintain-branch', component: MaintainBranchComponent},
   { path: 'admin/maintain-branch-stock', component: MaintainBranchStockComponent},
   { path: 'admin/create-branch', component: CreateBranchComponent},
   { path: 'admin/request-branch-stock', component: RequestBranchStockComponent},
   { path: 'admin/do-branch-stock-take', component: DoBranchStockTakeComponent},
   { path: 'admin/receive-branch-stock', component: ReceiveBranchStockComponent},
   { path: 'admin/maintain-branch/view-branch/:id', component: ViewBranchComponent},

   // Routed Backup Components
   { path: 'admin/backup', component: BackupComponent},
  { path: 'admin/restore', component: RestoreComponent },
   {path: 'admin/audit', component: AuditComponent},

   // Routed Training Module (Side Navigation Component)
   {
     path: 'training-modules-home-page', component: TrainingModulesHomeComponent, children: [
       { path: '', redirectTo: 'training-modules-home-page', pathMatch: 'full'},
       { path: 'training-modules-home-page', component: TrainingModulesHomePageComponent },
       { path: 'training-modules-content/:id', component: TrainingModulesContentComponent },
       { path: 'training-modules-content-view/:id', component: TrainingModulesContentViewComponent },
     ]
   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
