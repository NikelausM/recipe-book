import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User, UserDataAll } from "./user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private static readonly WEB_API_KEY = 'AIzaSyBQUHJT6xw28BLNCzM2zzoVThrv4jLYFWs';
  private static readonly USER_DATA_KEY = 'userData';

  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private static authUrl(urlType: string): string {
    const params = new HttpParams({ fromObject: { 'key': this.WEB_API_KEY } })
    const url = `${this.AUTH_BASE_URL}${urlType}?${params.toString()}`;
    return url;
  }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(AuthService.authUrl('signUp'), {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            Number(resData.expiresIn));
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(AuthService.authUrl('signInWithPassword'), {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            Number(resData.expiresIn));
        })
      );
  }

  autoLogin() {
    const userData: UserDataAll = JSON.parse(localStorage.getItem(AuthService.USER_DATA_KEY));

    if (!userData) {
      return;
    }

    const expirationDate = new Date(userData._tokenExpirationDate)
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      expirationDate
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    console.log("Logging out...");
    this.user.next(null);
    localStorage.removeItem(AuthService.USER_DATA_KEY);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      default:
        break;
    }

    return throwError(errorMessage);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem(AuthService.USER_DATA_KEY, JSON.stringify(user));
  }
}