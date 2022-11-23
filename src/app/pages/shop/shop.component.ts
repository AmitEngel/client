import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authStatusSub!: Subscription;
  userId!: string | null;
  isAdmin = false
  constructor(private authService: AuthService, private shopService:ShopService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((res) => {
      (this.isAdmin = res.isAdmin!)
    });
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userId = this.authService.getUserId();
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onSearch(word: string) {
    console.log(word)
    this.shopService.filterBySearch(word)
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
