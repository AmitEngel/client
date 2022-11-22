import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthData } from '../components/auth/auth-data.model';
import { UserModel } from '../models/user.model';

const BACKEND_URL = environment.apiUrl + '/auth/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token!: string | null;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer!: any;
  public user = new BehaviorSubject<UserModel>({});
  private userId!: string | null;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  public checkToken() {
    if (localStorage.getItem('token')) {
       this.httpClient.get(BACKEND_URL + 'reload').subscribe((res) => {
         this.user.next(res);
         this.authStatusListener.next(true)
      });
    }
  }

  getUser() {
    return this.user.asObservable();
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(user: UserModel) {
    const authData: UserModel = user;
    return this.httpClient.post(BACKEND_URL + 'signup', authData).subscribe({
      next: (result) => {
        console.log(result);
        this.router.navigate(['/auth/login']);
      },
      error: () => this.authStatusListener.next(false),
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        user: UserModel;
      }>(BACKEND_URL + 'login', authData)
      .subscribe({
        next: (response) => {
          console.log(response);
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.user.next(response.user);
            this.userId = response.userId;
            //this.username = response.user.firstName;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.user.value
            );

            //this.router.navigate(['/']);
          }
        },
        error: (err) => this.authStatusListener.next(false),
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn =
      authInformation?.expirationDate!.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation?.token!;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.user.next({})
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    user: UserModel
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      user: this.user,
    };
  }
}
