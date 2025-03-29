import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SingleUserResponse } from '../../shared/interfaces/responses';
import {
  User,
  UserLogin,
  UserLoginFacebook,
  UserLoginGoogle,
} from '../../shared/interfaces/user';
import { TokenResponse } from '../../restaurants/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #authUrl = 'auth';
  #http = inject(HttpClient);

  postLogin(user: UserLogin): Observable<TokenResponse> {
    return this.#http
      .post<TokenResponse>(`${this.#authUrl}/login`, user)
      .pipe(map((res) => res));
  }

  postRegister(user: User): Observable<User> {
    return this.#http
      .post<SingleUserResponse>(`${this.#authUrl}/register`, user)
      .pipe(map((res) => res.user));
  }

  postLoginGoogle(user: UserLoginGoogle): Observable<TokenResponse> {
    return this.#http
      .post<TokenResponse>(`${this.#authUrl}/google`, user)
      .pipe(map((res) => res));
  }

  postLoginFacebook(user: UserLoginFacebook): Observable<TokenResponse> {
    return this.#http
      .post<TokenResponse>(`${this.#authUrl}/facebook`, user)
      .pipe(map((res) => res));
  }
}
