import HttpService from "./HttpService";
import { Defaults } from "../models/defaults";

declare const defaults: Defaults;
declare var stringResources: any;

class Localizer {
    static httpService: HttpService = new HttpService();
    static languageCode: string = "en-US";

    static loadLanguage(languageCode: string): Promise<void> {
        return Localizer.httpService.get(defaults.jsonRoutes["getResources"] + "?languageCode=" + languageCode)
            .then(res => res.json())
            .then(res => {
                stringResources.push(res);
            });
    }

    static L(key: string): string {
        let resources = stringResources.find(x => x.languageCode == Localizer.languageCode);
        try {
            let value = resources.values[key];
            if (value != undefined)                
                return value;
            // Key not found - Fallback to english, create the key if we are allready looking for english
            if (Localizer.languageCode == "en-US") {
                Localizer.addMissing(key);
            } else {
                try {
                    return stringResources.find(x => x.languageCode == "en-US")[key];
                } catch {
                    Localizer.addMissing(key);
                }
            }
        } catch { }
        return key;
    }
    
    static addMissing(key: string): Promise<void> {
        console.log("Adding key: " + key);
        return Localizer.httpService.post(defaults.jsonRoutes["addMissingStringResource"],
            {
                key: key
            })
            .then(res => res.json())
            .then(res => {
                console.log(res.message);
                let resources = stringResources.find(x => x.languageCode == Localizer.languageCode);
                resources.values[key] = key;
            });
    }
}
export default Localizer;