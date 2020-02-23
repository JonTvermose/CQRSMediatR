import HttpService from "./HttpService";
import { Defaults } from "../models/defaults";
declare const defaults: Defaults;
declare var isAuthenticated: boolean;

export default class AccountService {
    private httpService: HttpService;

    constructor() {
        this.httpService = new HttpService();
    }

    public isLoggedIn(): boolean {
        return isAuthenticated;
    }

    public logout(): Promise<any> {
        return this.httpService.post(defaults.jsonRoutes["logout"], {})
            .then(res => {
                isAuthenticated = false;
                return res.json
            });
    }

    public login(username: string, password: string, rememberMe: boolean): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["login"],
            {
                Email: username,
                Password: password,
                RememberMe: rememberMe
            });
    }

    public login2Fa(code: string, rememberMe: boolean): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["loginWith2fa"],
            {
                TwoFactorCode: code,
                RememberMe: rememberMe
            });
    }

    public forgotPassword(username: string): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["forgotPassword"],
            {
                UserName: username
            });
    }

    public refreshToken(): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["refreshToken"], {});
    }

}