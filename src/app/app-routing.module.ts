import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
import { SignupComponent } from './components/auth/signup/signup.component';
import { CartComponent } from './components/cart/cart.component';
import { ItemCreateComponent } from './components/items/item-create/item-create.component';
import { OrderComponent } from './pages/order/order.component';
import { ShopComponent } from './pages/shop/shop.component';

import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  { path: '', component: ShopComponent, canActivate: [AuthGuard] },
  { path: 'edit/:itemId', component: ItemCreateComponent, canActivate: [AuthGuard] },
  { path: 'create', component: ItemCreateComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'auth/login', component: WelcomeComponent },
  { path: 'auth/signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
