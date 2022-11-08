import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { CartComponent } from './components/cart/cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './components/auth/auth.interceptor';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AboutComponent } from './components/about/about.component';
import { GeneralInfoComponent } from './components/general-info/general-info.component';

import { ShopComponent } from './pages/shop/shop.component';
import { ItemListComponent } from './components/items/item-list/item-list.component';
import { ItemCreateComponent } from './components/items/item-create/item-create.component';
import { OrderComponent } from './pages/order/order.component';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';
import { OrderSuccessDialogComponent } from './components/order-success-dialog/order-success-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    CartComponent,
    WelcomeComponent,
    AboutComponent,
    GeneralInfoComponent,
    ShopComponent,
    ItemListComponent,
    ItemCreateComponent,
    OrderComponent,
    OrderCompleteComponent,
    OrderSuccessDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatStepperModule,
    MatSelectModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
