import HttpService from "./HttpService";
import { Defaults } from "../models/defaults";
declare const defaults: Defaults;

export default class AccountService {
    private httpService: HttpService;

    constructor() {
        this.httpService = new HttpService();
    }
    
    public login(username: string, password: string, rememberMe: boolean): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["login"],
            {
                userName: username,
                password: password,
                rememberMe: rememberMe
            });
    }

    public forgotPassword(username: string): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["forgotPassword"],
            {
                userName: username
            });
    }

}