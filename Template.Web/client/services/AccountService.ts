import HttpService from "./HttpService";
import { Defaults } from "../models/defaults";
import { User } from "../models/user";

declare const defaults: Defaults;
declare var isAuthenticated: boolean;
declare var currentUser: User;

export default class AccountService {
    private httpService: HttpService;

    constructor() {
        this.httpService = new HttpService();
    }

    public isLoggedIn(): boolean {
        return isAuthenticated;
    }

    public getUser(): Promise<any> {
        if (!currentUser.email) {
            return this.httpService.get(defaults.jsonRoutes["getProfile"]).then(res => res.json()).then(res => {
                currentUser = res;
                return res;
            });
        } else {
            return new Promise<any>((resolve) => resolve(currentUser));
        }
    }

    public setUser(user: User): void {
        currentUser = user;
    }

    public logout(): Promise<any> {
        return this.httpService.post(defaults.jsonRoutes["logout"], {})
            .then(res => {
                if (res.ok) {
                    isAuthenticated = false;
                } else {
                    throw new Error("Error logging user out.");
                }
                return res.json
            })
            .then(res => {
                window.location.href = window.location.origin;
            });
    }    

    public confirmAccount(userid: string, code: string, password: string): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["confirmAccount"],
            {
                UserId: userid,
                Code: code,
                Password: password
            });
    }

    public signUp(username: string, firstName: string, lastName: string): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["signup"],
            {
                Email: username,
                FirstName: firstName,
                LastName: lastName
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

    public resetAuthenticator(): Promise<Response> {
        currentUser.email = "";
        return this.httpService.post(defaults.jsonRoutes["resetAuthenticator"],
            {
            });
    }
    

    public changePassword(password: string, newPassword: string, email: string): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["changePassword"],
            {
                Password: password,
                NewPassword: newPassword,
                Email: email
            });
    }

    public getAuthenticatorUrl(): Promise<Response> {
        return this.httpService.get(defaults.jsonRoutes["enableAuthenticator"]);
    }

    public enableAuthenticator(code: string): Promise<Response> {
        currentUser.email = "";
        return this.httpService.post(defaults.jsonRoutes["enableAuthenticator"],
            {
                Code: code
            });
    }

    public editProfile(username: string, firstName: string, lastName: string): Promise<Response> {
        currentUser.email = "";
        return this.httpService.post(defaults.jsonRoutes["editProfile"],
            {
                Email: username,
                FirstName: firstName,
                LastName: lastName
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