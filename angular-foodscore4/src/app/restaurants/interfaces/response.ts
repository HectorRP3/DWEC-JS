import { Restaurant } from "./restaurant";

export interface SingleRestaurantResponse {
    restaurant: Restaurant;
}

export interface RestaurantsResponse {
    restaurants: Restaurant[];
}