import { SERVER } from "../constants";
import { SingleUserResponse, TokenResponse } from "../interfaces/responses";
import { User, UserLogin } from "../interfaces/user";
import { Http } from "./http";

export class AuthService {
    #http;
    constructor() {
        this.#http = new Http();
    }

    async postRegister(user: User) {
        const register = await this.#http.post<SingleUserResponse, User>(
            SERVER + "/auth/register",
            user
        );
        return register.user;
    }

    async postLogin(user: UserLogin): Promise<TokenResponse> {
        const login = await this.#http.post<TokenResponse, UserLogin>(
            SERVER + "/auth/login",
            user
        );
        return login;
    }
}
