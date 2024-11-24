import { SERVER } from "../constants";
import { SingleUserResponse } from "../interfaces/responses";
import { User } from "../interfaces/user";
import { Http } from "./http";

export class UserService {
    #http;
    constructor() {
        this.#http = new Http();
    }

    async getInformationMe(): Promise<User> {
        const resp = await this.#http.get<SingleUserResponse>(
            SERVER + "/users/me"
        );
        return resp.user;
    }
}
