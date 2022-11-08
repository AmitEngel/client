import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-order-success-dialog',
  templateUrl: './order-success-dialog.component.html',
  styleUrls: ['./order-success-dialog.component.css'],
})
export class OrderSuccessDialogComponent implements OnInit {
  isOrderActive = false;
  constructor(private shopService: ShopService) {}

  ngOnInit(): void { }

  createNewCart() {
    this.shopService.createNewCart().subscribe(res => {
      this.shopService.setCart(res)
      this.shopService.isOrderActive.next(true)
    })
  }
}
