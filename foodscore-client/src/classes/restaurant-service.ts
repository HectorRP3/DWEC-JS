import { SERVER } from "../constants";
import {
    RestaurantsResponse,
    SingleRestaurantResponse,
} from "../interfaces/responses";
import { Restaurant, RestaurantInsert } from "../interfaces/restaurant";
import { Http } from "./http";

export class RestaurantService {
    #http;
    constructor() {
        this.#http = new Http();
    }

    async getAll(): Promise<Restaurant[]> {
        const resp = await this.#http.get<RestaurantsResponse>(
            SERVER + "/restaurants"
        );
        return resp.restaurants;
    }
    async post(restaurants: RestaurantInsert) {
        const resp = await this.#http.post<
            SingleRestaurantResponse,
            RestaurantInsert
        >(SERVER + "/restaurants", restaurants);
        return resp.restaurant;
    }
    delete(id: number) {
        this.#http.delete<void>(SERVER + `/restaurants/${id}`);
    }
}