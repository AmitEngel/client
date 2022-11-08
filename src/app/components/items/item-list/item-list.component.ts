import { Component, OnInit } from '@angular/core';
import { CartItemModel } from 'src/app/models/cart-item.model';
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
  BASE_URL = environment.apiUrl

  items: ItemModel[] = [];
  cart!: CartModel;
  isAdmin: boolean = false;
  isActive = true
  constructor(
    private shopService: ShopService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.authService
      .getUser()
      .subscribe((res) => (this.isAdmin = res.isAdmin!));
    this.shopService.getCart$.subscribe((res) => {
      this.cart = res;
    });
    this.shopService.getItems().subscribe((it) => {
      this.items = it.items;
    });
  }

  onItemDelete(itemId:string) {
    this.shopService.deleteItemFromShop(itemId).subscribe(res => {
      this.shopService.getItems().subscribe(res => this.items = res.items)
    })
  }

  onAddToCart({name, price, imagePath, _id }: ItemModel) {
    this.shopService
      .updateCart(this.cart._id!, { name, priceTotal:price, imagePath, quantity:1, itemId:_id })
      .subscribe((res) => {
        console.log(res)
        this.shopService.addItemToCart(res);
      });
  }
}
