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
    async getMore(page:number,creator?:number): Promise<boolean> {
        let resp = null;
        if(creator == null){
            resp = await this.#http.get<RestaurantsResponse>(
                SERVER + "/restaurants?page="+page
            );
        }else{
            resp = await this.#http.get<RestaurantsResponse>(
                SERVER + "/restaurants?page="+page+"&creator="+creator
            );
        }
        return resp.more;
    }
    async getNextRestaurants(page:number,creator?:number): Promise<Restaurant[]> {
        let resp = null
        if(creator == null){
            resp = await this.#http.get<RestaurantsResponse>(
                SERVER + "/restaurants?page="+page
            );
        }else{
            resp = await this.#http.get<RestaurantsResponse>(
                SERVER + "/restaurants?page="+page+"&creator="+creator
            );
        }
        return resp.restaurants;
    }
    async getRestaurantId(id: number): Promise<Restaurant> {
        const resp = await this.#http.get<SingleRestaurantResponse>(
            SERVER + `/restaurants/${id}`
        );
        return resp.restaurant;
    }

    async getRestaurantSearch(search:string,page:number,creator?:number) : Promise<Restaurant[]>{
        let resp = null;
        if(creator == null){
            resp = await this.#http.get<RestaurantsResponse>(SERVER+"/restaurants?search="+search+"&page="+page);
        }else{
            resp = await this.#http.get<RestaurantsResponse>(SERVER+"/restaurants?search="+search+"&page="+page+"&creator="+creator);
        }
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

    async delete(id: number) {
        await this.#http.delete<void>(SERVER + `/restaurants/${id}`);
    }
}
