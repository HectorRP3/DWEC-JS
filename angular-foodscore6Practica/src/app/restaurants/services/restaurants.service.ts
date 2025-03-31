import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  CommentsResponse,
  RestaurantsResponse,
  SingleCommentResponse,
  SingleRestaurantResponse,
} from '../interfaces/response';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';
import { Comment } from '../interfaces/comments';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  #restaurantUrl = 'restaurants';
  #http = inject(HttpClient);

  getRestaurants(
    search = '',
    page = 1,
    open = 0,
    creator?: string
  ): Observable<RestaurantsResponse> {
    let urlParams;
    if (creator) {
      urlParams = new URLSearchParams({
        search: search,
        page: page.toString(),
        open: open.toString(),
        creator: creator,
      });
    } else {
      urlParams = new URLSearchParams({
        search: search,
        page: page.toString(),
        open: open.toString(),
      });
    }
    console.log(search + ' ' + page + ' ' + open + ' ' + creator);
    return this.#http
      .get<RestaurantsResponse>(`${this.#restaurantUrl}?${urlParams}`)
      .pipe(map((r) => r));
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.#http
      .get<SingleRestaurantResponse>(`${this.#restaurantUrl}/${id}`)
      .pipe(map((r) => r.restaurant));
  }

  getCommentById(id: number): Observable<CommentsResponse> {
    return this.#http.get<CommentsResponse>(
      `${this.#restaurantUrl}/${id}/comments`
    );
  }

  postComment(comment: Comment, id: number): Observable<Comment> {
    return this.#http
      .post<SingleCommentResponse>(
        `${this.#restaurantUrl}/${id}/comments`,
        comment
      )
      .pipe(map((res) => res.comment));
  }

  putRestaurant(
    restaurant: RestaurantInsert,
    id: number
  ): Observable<Restaurant> {
    return this.#http
      .put<Restaurant>(`${this.#restaurantUrl}/${id}`, restaurant)
      .pipe(map((res) => res));
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
