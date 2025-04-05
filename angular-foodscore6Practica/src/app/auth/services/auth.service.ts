import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
    return this.#logged.asReadonly();
  }

  login(user: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#authUrl}/login`, user).pipe(
      map((res) => {
        this.#logged.set(true);
        // localStorage.setItem('token', res.accessToken);
        this.cookieService.set('token', res.accessToken, 365, '/');
      })
    );
  }

  logout() {
    this.#logged.set(false);
    // localStorage.removeItem('token');
    this.cookieService.delete('token');
  }

  isLogged(): Observable<boolean> {
    // const token = localStorage.getItem('token');
    const token = this.#ssrCookieService.getCookie('token');
    if (!this.#logged() && !token) {
      return of(false);
    } else if (!this.#logged() && token) {
      console.log('entrando a validar token');
      this.#http.get<Observable<boolean>>(`${this.#authUrl}/validate`).pipe(
        map(() => {
          this.#logged.set(true);
          console.log('validando token', token);
          console.log('validando token', this.#logged());
          // localStorage.setItem('token', res.accessToken);
          return true;
        }),
        catchError(() => {
          console.log('token no valido', token);
          console.log('token no valido', this.#logged());
          // localStorage.removeItem('token');
          this.cookieService.delete('token');
          return of(false);
        })
      );
    }
    // else if (this.#logged() === true) {
    //   return of(true);
    this.#logged.set(true);
    return of(true);
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
