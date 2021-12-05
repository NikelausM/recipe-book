import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserDataAll } from '../user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string,
) => {
  const expirationDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred';

  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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

  // return non-error observable
  return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(AuthService.authUrl('signUp'), {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(Number(resData.expiresIn) * 1000);
          }),
          // wraps what you return into an observable
          map(resData => handleAuthentication(
            Number(resData.expiresIn),
            resData.email,
            resData.localId,
            resData.idToken)
          ),
          // doesn't wrap what you return into an observable
          catchError(errorRes => handleError(errorRes))
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(AuthService.authUrl('signInWithPassword'), {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(Number(resData.expiresIn) * 1000);
          }),
          // wraps what you return into an observable
          map(resData => handleAuthentication(
            Number(resData.expiresIn),
            resData.email,
            resData.localId,
            resData.idToken)
          ),
          // doesn't wrap what you return into an observable
          catchError(errorRes => handleError(errorRes))
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType<AuthActions.AutoLogin>(AuthActions.AUTO_LOGIN),
    map(() => {
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
        const expirationDuration = expirationDate.getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        console.log("About to authenticate success");
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: loadedUser.tokenExpirationDate,
          redirect: false
        });
      }

      console.log("About to not authenticate fail");
      return of(new AuthActions.PlaceholderAction());
    })
  )

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }
}