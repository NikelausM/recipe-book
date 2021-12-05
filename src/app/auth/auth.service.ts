import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment'; // swapped by angular cli in production build
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  static readonly USER_DATA_KEY = 'userData';

  private static readonly AUTH_BASE_URL = environment.firebaseAuthBaseURL;
  private static readonly WEB_API_KEY = environment.firebaseAPIKey;
  // user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  static authUrl(urlType: string): string {
    const params = new HttpParams({ fromObject: { 'key': this.WEB_API_KEY } })
    const url = `${this.AUTH_BASE_URL}${urlType}?${params.toString()}`;
    return url;
  }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}