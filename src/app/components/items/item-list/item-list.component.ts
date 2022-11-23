import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CartModel } from 'src/app/models/cart.model';
import { ItemModel } from 'src/app/models/item.model';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit {
  BASE_URL = environment.apiUrl;

  items: ItemModel[] = [];
  cart!: CartModel;
  categories!: string[];
  isAdmin: boolean = false;
  searchText!: string;
  constructor(
    private shopService: ShopService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.authService
      .getUser()
      .subscribe((res) => (this.isAdmin = res.isAdmin!));
    this.shopService.getCart$.subscribe((res) => {
      this.cart = res;
    });
    this.shopService.getItems$.subscribe((it) => {
      this.items = it;
    });
    this.shopService
      .getCategories()
      .subscribe((res) => (this.categories = res));
  }

  onItemDelete(itemId: string) {
    this.shopService.deleteItemFromShop(itemId);
  }

  onAddToCart({ name, price, imagePath, _id }: ItemModel) {
    console.log('cartId: ' + this.cart._id, 'itemId: ' + _id);
    this.shopService
      .updateCart(this.cart._id!, {
        name,
        priceTotal: price,
        imagePath,
        quantity: 1,
        itemId: _id,
      })
      .subscribe((res) => {
        console.log(res);
        this.shopService.addItemToCart(res);
      });
  }

  onCategoryClick(event: MatTabChangeEvent) {
    this.shopService.filterByCategory(event.tab.textLabel);
  }
}
