import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartModel } from 'src/app/models/cart.model';
import { ShopService } from 'src/app/services/shop.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderSuccessDialogComponent } from '../order-success-dialog/order-success-dialog.component';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css'],
})
export class OrderCompleteComponent implements OnInit {
  cart!: CartModel;
  constructor(private shopService: ShopService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.shopService.getCart();
    this.shopService.isOrderActive.next(false);
  }
  onOrderClick(form: NgForm) {
    console.log(this.cart);
    this.shopService
      .orderCart({
        city: form.value.city,
        street: form.value.street,
        desiredShippingDate: form.value.desiredDate,
        lastFourDigits: form.value.card,
        dateCreated: new Date(),
        cartId: this.cart._id!,
        owner: this.cart.owner!,
        priceTotal: this.cart.items
          .map((it) => it.priceTotal)
          .reduce((a, b) => a + b),
      })
      .subscribe((orderData) => this.dialog.open(OrderSuccessDialogComponent));
  }
}
