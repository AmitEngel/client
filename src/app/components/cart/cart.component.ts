import { Component, OnInit } from '@angular/core';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { CartModel } from 'src/app/models/cart.model';
import { ShopService } from 'src/app/services/shop.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  BASE_URL = environment.apiUrl

  items: CartItemModel[] = [];
  cart!: CartModel;
  priceTotal: number = 0;
  isOrderActive!: boolean;
  constructor(private shopService:ShopService) {}

  ngOnInit(): void {
    this.shopService.getOrderStatus().subscribe(res => {
      this.isOrderActive = res
    })
    this.shopService.getCart$.subscribe(res => {
      this.cart = res
      this.items = res.items
    })
  }

  onDeleteClick(cartId: string, itemId: string) {
    console.log("cartId: " + cartId, "itemId: " + itemId)
    this.shopService.deleteItemFromCart(cartId, itemId).subscribe({
      next: (response) => {
        console.log(response);
        this.shopService.setCart({ ...this.cart, items: this.cart.items.filter(item => item.itemId !== itemId) });
      },
    });
  }
  onBackToShopClick() {
    this.shopService.isOrderActive.next(true)
  }
}
