import HttpService from "./HttpService";
import { Defaults } from "../models/defaults";
declare const defaults: Defaults;

export default class ErrorService {
    private httpService: HttpService;

    constructor() {
        this.httpService = new HttpService(); 
    }
    
    public logError(errorData: any): Promise<Response> {
        return this.httpService.post(defaults.jsonRoutes["logerror"], errorData);
    }

}