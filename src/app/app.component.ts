import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { ShopService } from './services/shop.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';
  private authStatusSub!: Subscription;
  constructor(private authService: AuthService, private shopService:ShopService) {}

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.authService.checkToken();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      if (authStatus) {
        this.shopService.getCart()
      }
    })
    this.shopService.getItems()
  }
}
