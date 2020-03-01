import HttpService from "./HttpService";
import { Defaults } from "../models/defaults";
declare const defaults: Defaults;

export default class LogEntryService {
    private httpService: HttpService;

    constructor() {
        this.httpService = new HttpService();
    }
    
    public getLogEntries(): Promise<Response> {
        return this.httpService.get(defaults.jsonRoutes["getlogentries"]);
    }

    public getUserActivity(): Promise<Response> {
        return this.httpService.get(defaults.jsonRoutes["getUserActivity"]);
    }

}