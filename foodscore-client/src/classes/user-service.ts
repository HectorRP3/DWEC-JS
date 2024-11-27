import { SERVER } from "../constants";
import { AvatarResponse, SingleUserResponse } from "../interfaces/responses";
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from "../interfaces/user";
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
    async putProfile(user:UserProfileEdit) {
        const resp = await this.#http.put<void,UserProfileEdit>(SERVER + "/users/me",user);
        return resp;
    }

    async putPhoto(user:UserPhotoEdit) {
        const resp = await this.#http.put<AvatarResponse,UserPhotoEdit>(SERVER + "/users/me/avatar",user);
        return resp.avatar;
    }

    async putPassword(user:UserPasswordEdit) {
        const resp = await this.#http.put<void,UserPasswordEdit>(SERVER + "/users/me/password",user);
        return resp;
    }
    async getInformationUser(id:number): Promise<User> {
        const resp = await this.#http.get<SingleUserResponse>(
            SERVER + `/users/${id}`
        );
        return resp.user;
    }
}
