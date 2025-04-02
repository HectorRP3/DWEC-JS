import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SingleUserResponse } from '../../profile/interfaces/responses';
import {
  User,
  UserLogin,
  UserLoginFacebook,
  UserLoginGoogle,
} from '../../profile/interfaces/user';
import { TokenResponse } from '../../restaurants/interfaces/response';
import { SsrCookieService } from '../../shared/services/ssr-cookie.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #authUrl = 'auth';
  #http = inject(HttpClient);
  #logged = signal(false);
  cookieService = inject(CookieService);
  #ssrCookieService = inject(SsrCookieService);
  getLogged() {
    return this.#logged();
  }

  postLogin(user: UserLogin): Observable<TokenResponse> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/login`, user).pipe(
      map((res) => {
        this.#logged.set(true);
        // localStorage.setItem('token', res.accessToken);
        this.cookieService.set('token', res.accessToken, 365, '/');
        return res;
      })
    );
  }

  logout() {
    this.#logged.set(false);
    localStorage.removeItem('token');
  }
  isLogged(): Observable<boolean> {
    // const token = localStorage.getItem('token');
    const token = this.#ssrCookieService.getCookie('token');
    if (this.#logged() === false && token === null) {
      return of(false);
    } else if (this.#logged() === true) {
      return of(true);
    } else if (this.#logged() === false && token) {
      this.#http.post<TokenResponse>('auth/validate', token).pipe(
        map(() => {
          this.#logged.set(true);
          return of(true);
        }),
        catchError(() => {
          // localStorage.removeItem('token');
          this.cookieService.delete('token');
          return of(false);
        })
      );
    }
    return of(false);
  }

  postRegister(user: User): Observable<User> {
    return this.#http
      .post<SingleUserResponse>(`${this.#authUrl}/register`, user)
      .pipe(map((res) => res.user));
  }

  postLoginGoogle(user: UserLoginGoogle): Observable<TokenResponse> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/google`, user).pipe(
      map((res) => {
        this.#logged.set(true);
        // localStorage.setItem('token', res.accessToken);
        this.cookieService.set('token', res.accessToken, 365, '/');
        return res;
      })
    );
  }

  postLoginFacebook(user: UserLoginFacebook): Observable<TokenResponse> {
    return this.#http
      .post<TokenResponse>(`${this.#authUrl}/facebook`, user)
      .pipe(
        map((res) => {
          this.#logged.set(true);
          // localStorage.setItem('token', res.accessToken);
          this.cookieService.set('token', res.accessToken, 365, '/');
          return res;
        })
      );
  }
}
