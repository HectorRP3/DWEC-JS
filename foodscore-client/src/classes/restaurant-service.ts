import { SERVER } from "../constants";
import {
    CommentsResponse,
    RestaurantsResponse,
    SingleRestaurantResponse,
} from "../interfaces/responses";
import { Restaurant, RestaurantInsert } from "../interfaces/restaurant";
import { Http } from "./http";
import { Comment } from "../interfaces/comment";


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
    async getMore(page:number): Promise<boolean> {
        const resp = await this.#http.get<RestaurantsResponse>(
            SERVER + "/restaurants?page="+page
        );
        return resp.more;
    }
    async getNextRestaurants(page:number): Promise<Restaurant[]> {
        const resp = await this.#http.get<RestaurantsResponse>(
            SERVER + "/restaurants?page="+page
        );
        return resp.restaurants;
    }
    async getRestaurantId(id: number): Promise<Restaurant> {
        const resp = await this.#http.get<SingleRestaurantResponse>(
            SERVER + `/restaurants/${id}`
        );
        return resp.restaurant;
    }

    async getRestaurantSearch(search:string,page:number) : Promise<Restaurant[]>{
        const resp = await this.#http.get<RestaurantsResponse>(SERVER+"/restaurants?search="+search+"&page="+page);
        return resp.restaurants
    }
    async getRestaurantComments(id: number) : Promise<Comment[]>{
        const resp = await this.#http.get<CommentsResponse>(
            SERVER + `/restaurants/${id}/comments`
        );
        return resp.comments;
    }

    async postComment(id: number, comment: Comment) {
        const resp = await this.#http.post<Comment, Comment>(
            SERVER + `/restaurants/${id}/comments`,
            comment
        );
        return resp;
    }

    async getRestaurantByCreator(id: number): Promise<Restaurant[]> {
        const resp = await this.#http.get<RestaurantsResponse>(
            SERVER + `/restaurants?creator=${id}`
        );
        return resp.restaurants;
    }
    async getRestaurantByCreatorMore(id: number,page:number): Promise<boolean> {
        const resp = await this.#http.get<RestaurantsResponse>(
            SERVER + `/restaurants?creator=${id}&page=${page}`
        );
        return resp.more;
    }
    async getRestaurantByCreatorSearch(id: number,page:number,search:string): Promise<Restaurant[]> {
        const resp = await this.#http.get<RestaurantsResponse>(
            SERVER + `/restaurants?creator=${id}&page=${page}&search=${search}`
        );
        return resp.restaurants;
    }

    async delete(id: number) {
        await this.#http.delete<void>(SERVER + `/restaurants/${id}`);
    }
}
