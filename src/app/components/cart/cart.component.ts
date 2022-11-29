import { Component, OnInit } from '@angular/core';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { CartModel } from 'src/app/models/cart.model';
import { ItemModel } from 'src/app/models/item.model';
import { ShopService } from 'src/app/services/shop.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  BASE_URL = environment.apiUrl;

  items: CartItemModel[] = [];
  cart!: CartModel;
  priceTotal: number = 0;
  isOrderActive!: boolean;
  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.shopService.getOrderStatus().subscribe((res) => {
      this.isOrderActive = res;
    });
    this.shopService.getCart$.subscribe((res) => {
      this.cart = res;
      this.items = res.items;
      this.getTotalPrice()
    });
  }

  getTotalPrice() {
    this.priceTotal = this.items.reduce((a, b) => a+b.priceTotal, 0)
  }

  onAddClick({ name, priceTotal, imagePath, quantity, itemId }: CartItemModel) {
    console.log('cartId: ' + this.cart._id, 'itemId: ' + itemId);
    this.shopService
      .updateCart(this.cart._id!, {
        name,
        priceTotal: priceTotal / quantity,
        imagePath,
        quantity: 1,
        itemId,
      })
      .subscribe((res) => {
        console.log(res);
        this.shopService.addItemToCart(res);
        this.getTotalPrice();
      });
  }

  onSubtractClick({ name, priceTotal, imagePath, quantity, itemId }: CartItemModel) {
    if (quantity === 1) {
      this.onDeleteClick(this.cart._id!, itemId!)
    } else {
      this.shopService
        .updateCart(this.cart._id!, {
          name,
          priceTotal: priceTotal / quantity,
          imagePath,
          quantity: 1,
          itemId,
        })
        .subscribe((res) => {
          console.log(res);
          this.shopService.subtractItemFromCart(res);
          this.getTotalPrice();
        });
    }
  }

  onDeleteClick(cartId: string, itemId: string) {
    console.log('cartId: ' + cartId, 'itemId: ' + itemId);
    this.shopService.deleteItemFromCart(cartId, itemId).subscribe({
      next: (response) => {
        console.log(response);
        this.shopService.setCart({
          ...this.cart,
          items: this.cart.items.filter((item) => item.itemId !== itemId),
        });
        this.getTotalPrice();
      },
    });
  }
  onBackToShopClick() {
    this.shopService.isOrderActive.next(true);
  }
}
