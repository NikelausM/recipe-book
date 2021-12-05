import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.authService.user.subscribe();
    return this.store.select('auth').pipe(
      // take 1 value from auth observable and unsubscribe from it
      take(1),
      // get user
      map(authState => authState.user),
      // wait for first user observable from take() to complete 
      // to return new inner user observable which replaces outer user observable
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });

        return next.handle(modifiedReq);
      }));
  }

}