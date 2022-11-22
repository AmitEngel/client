import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ItemModel } from '../models/item.model';
import { CartModel } from '../models/cart.model';
import { Router } from '@angular/router';
import { CartItemModel } from '../models/cart-item.model';
import { OrderModel } from '../models/order.model';

const BACKEND_URL = environment.apiUrl + '/shop/';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private _cartItems$: BehaviorSubject<ItemModel[]> = new BehaviorSubject<
    ItemModel[]
  >([]);
  cartItems$ = this._cartItems$.asObservable();
  private cart: BehaviorSubject<CartModel> = new BehaviorSubject<CartModel>(
    new CartModel([])
  );
  getCart$ = this.cart.asObservable();
  setCart(cart: CartModel) {
    return this.cart.next(cart);
  }
  private orders$ = new BehaviorSubject<OrderModel[]>([])
  getOrders() {
    return this.orders$.asObservable()
  }
  isOrderActive = new BehaviorSubject(true);
  getOrderStatus() {
    return this.isOrderActive.asObservable();
  }

  constructor(private httpClient: HttpClient, private router: Router) {}

  getItems() {
    return this.httpClient.get<{ items: ItemModel[] }>(BACKEND_URL);
  }

  getItemById(id: string) {
    return this.httpClient.get<{
      _id: string;
      name: string;
      price: number;
      category: string;
      imagePath: string;
    }>(BACKEND_URL + 'edit/' + id);
  }

  getCart() {
    return this.httpClient.get<CartModel>(BACKEND_URL + 'cart').subscribe(res => {
      this.cart.next(res)
    });
  }

  createNewCart() {
   return this.httpClient.post<CartModel>(BACKEND_URL + 'cart', {dateCreated: new Date()})
  }

  createItem(name: string, price: number, category: string, image: File) {
    const itemData = new FormData();
    itemData.append('name', name);
    itemData.append('price', String(price));
    itemData.append('category', category);
    itemData.append('image', image, name);
    this.httpClient
      .post<{ message: string; item: ItemModel }>(BACKEND_URL, itemData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updateItem(
    id: string,
    name: string,
    price: number,
    category: string,
    image: File | string
  ) {
    let itemData: ItemModel | FormData;
    if (typeof image === 'object') {
      itemData = new FormData();
      itemData.append('id', id);
      itemData.append('name', name);
      itemData.append('price', String(price));
      itemData.append('category', category);
      itemData.append('image', image, name);
    } else {
      itemData = {
        _id: id,
        name: name,
        price: price,
        category: category,
        imagePath: image,
      };
    }
    this.httpClient
      .put(BACKEND_URL + 'edit/' + id, itemData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deleteItemFromShop(itemId: string) {
    return this.httpClient.delete(BACKEND_URL + 'delete/' + itemId)
  }

  addItemToCart(item: CartItemModel) {
    const cartItem = this.cart.value.items.find((it) => item.name === it.name);
    if (cartItem) {
      this.cart.next({
        ...this.cart.value,
        items: this.cart.value.items.map((a) =>
          a.name === item.name
            ? {
                itemId: a.itemId,
                imagePath: a.imagePath,
                name: a.name,
                priceTotal: a.priceTotal + item.priceTotal,
                quantity: a.quantity + item.quantity,
              }
            : a
        ),
      });
    } else {
      this.cart.next({
        ...this.cart.value,
        items: [...this.cart.value.items, item],
      });
    }
  }

  updateCart(cartId: string, item: CartItemModel) {
    return this.httpClient.put<CartItemModel>(BACKEND_URL + cartId, item);
  }

  deleteItemFromCart(cartId:string, itemId:string) {
    return this.httpClient.delete<{message:string, item:ItemModel}>(BACKEND_URL + cartId + '/' + itemId);
  }

  getOrderByUserId(userId:string) {
    return this.httpClient.get<{message:string ,orders: OrderModel[] }>(BACKEND_URL + 'order/' + userId)
  }

  orderCart(order: OrderModel) {
    return this.httpClient.post<OrderModel>(BACKEND_URL + 'order', order);
  }
}
