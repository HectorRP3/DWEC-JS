import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  RestaurantsResponse,
  SingleRestaurantResponse,
} from '../interfaces/response';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  #restaurantUrl = 'restaurants';
  #http = inject(HttpClient);

  getRestaurants(
    search = '',
    page = 1,
    open = 0
  ): Observable<RestaurantsResponse> {
    const urlParams = new URLSearchParams({
      search: search,
      page: page.toString(),
      open: open.toString(),
    });
    console.log(search + '' + page + '' + open);
    return this.#http
      .get<RestaurantsResponse>(`${this.#restaurantUrl}?${urlParams}`)
      .pipe(map((r) => r));
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.#http
      .get<SingleRestaurantResponse>(`${this.#restaurantUrl}/${id}`)
      .pipe(map((r) => r.restaurant));
  }
  addRestaurant(restaurant: RestaurantInsert): Observable<Restaurant> {
    return this.#http
      .post<SingleRestaurantResponse>(this.#restaurantUrl, restaurant)
      .pipe(map((res) => res.restaurant));
  }
  deleteRestaurant(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#restaurantUrl}/${id}`);
  }
}
