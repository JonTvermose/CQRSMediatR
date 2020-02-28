import HttpService from "./HttpService";
import { Defaults } from "../models/defaults";
declare const defaults: Defaults;

export default class StringResourceService {
    private httpService: HttpService;

    constructor() {
        this.httpService = new HttpService();
    }
    
    public getStringResources(languages: string[]): Promise<Response> {
        let queryString = "?"
        for (let i = 0; i < languages.length; i++) {
            queryString += "languages=" + languages[i] + "&";
        }
        queryString = queryString.substring(0, queryString.length - 1);
        return this.httpService.get(defaults.jsonRoutes["getResourceList"] + queryString);
    }

    public updateKeyValue(key: string, value: string, languageCode: string): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["saveStringResource"],
            {
                Key: key,
                Value: value,
                LanguageCode: languageCode
            });
    }

    public deleteKey(key: string): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["deleteStringResource"],
            {
                Key: key
            });
    }
    

}