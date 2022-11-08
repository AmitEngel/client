import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
  constructor(private authService: AuthService) {}

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
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
