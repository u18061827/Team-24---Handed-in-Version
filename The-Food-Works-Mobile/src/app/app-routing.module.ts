import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './access/login/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'shop-location', pathMatch: 'full'
  },
  {
    path: 'shop-location',
    loadChildren: () => import('./customer/shop-location/shop-location.module').then( m => m.ShopLocationPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'shop-location',
    loadChildren: () => import('./customer/shop-location/shop-location.module').then( m => m.ShopLocationPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./customer/cart/cart.module').then( m => m.CartPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./access/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./access/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./access/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./customer/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'view-orders',
    loadChildren: () => import('./customer/view-orders/view-orders.module').then( m => m.ViewOrdersPageModule)
  },
  {
    path: 'view-order',
    loadChildren: () => import('./customer/view-order/view-order.module').then( m => m.ViewOrderPageModule)
  },
  {
    path: 'view-product',
    loadChildren: () => import('./customer/view-product/view-product.module').then( m => m.ViewProductPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'add-to-cart',
    loadChildren: () => import('./customer/modals/add-to-cart/add-to-cart.module').then( m => m.AddToCartPageModule),
  },
  {
    path: 'qr-code',
    loadChildren: () => import('./customer/modals/qr-code/qr-code.module').then( m => m.QrCodePageModule)
  },
  {
    path: 'rewards',
    loadChildren: () => import('./customer/modals/rewards/rewards.module').then( m => m.RewardsPageModule)
  },
  {
    path: 'rewards',
    loadChildren: () => import('./customer/rewards/rewards.module').then( m => m.RewardsPageModule)
  },
  {
    path: 'logged-out',
    loadChildren: () => import('./access/logged-out/logged-out.module').then( m => m.LoggedOutPageModule)
  },
  {
    path: 'thank-you',
    loadChildren: () => import('./customer/thank-you/thank-you.module').then( m => m.ThankYouPageModule)
  },
  {
    path: 'product-review',
    loadChildren: () => import('./customer/modals/product-review/product-review.module').then( m => m.ProductReviewPageModule)
  },
  {
    path: 'driver-home',
    loadChildren: () => import('./driver/driver-home/driver-home.module').then( m => m.DriverHomePageModule)
  },
  {
    path: 'driver-map',
    loadChildren: () => import('./driver/driver-map/driver-map.module').then( m => m.DriverMapPageModule)
  },
  {
    path: 'complete-delivery',
    loadChildren: () => import('./driver/complete-delivery/complete-delivery.module').then( m => m.CompleteDeliveryPageModule)
  },
  {
    path: 'one-time-pin',
    loadChildren: () => import('./access/one-time-pin/one-time-pin.module').then( m => m.OneTimePinPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./access/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'update-customer',
    loadChildren: () => import('./customer/update-customer/update-customer.module').then( m => m.UpdateCustomerPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
