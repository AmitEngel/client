import { Component, OnInit } from '@angular/core';
import { map, Subscription, tap } from 'rxjs';
import { CartModel } from 'src/app/models/cart.model';
import { ItemModel } from 'src/app/models/item.model';
import { OrderModel } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css'],
})
export class GeneralInfoComponent implements OnInit {
  isAuthenticated = false;
  items: ItemModel[] = [];
  cart!: CartModel;
  userId!: string | null;
  order!: OrderModel;
  private authStatusSub!: Subscription;
  constructor(
    private shopService: ShopService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.userId = this.authService.getUserId();
        this.isAuthenticated = authStatus;
        if (this.isAuthenticated) {
          this.shopService.getCart$.subscribe((cart) => {
            this.cart = cart
          });
          this.shopService.getOrderByUserId(this.userId!).subscribe(res => {
            console.log(res.orders[0]);
            this.order = res.orders[res.orders.length - 1];
          })
        }
      });
    this.shopService.getItems$.subscribe((res) => {
      this.items = res;
    });
  }
}
