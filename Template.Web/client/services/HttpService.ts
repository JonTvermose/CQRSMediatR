export default class HttpService {

    public get(url: string): Promise<Response> {
        if (!url)
            throw new Error("HttpService.get(): Url was null or undefined");

        let cookie = this.getCookie('XSRF-TOKEN'); // Name must match that of StartUp.cs middleware
        if (!cookie)
            throw new Error("HttpService.post(): XSRF-TOKEN was null or undefined");

        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookie // Name must match that of StartUp.cs configuration
            }
        });
    }

    public post(url: string, data: any) {
        if (!url)
            throw new Error("HttpService.post(): Url was null or undefined");

        let cookie = this.getCookie('XSRF-TOKEN'); // Name must match that of StartUp.cs middleware
        if (!cookie)
            throw new Error("HttpService.post(): XSRF-TOKEN was null or undefined");

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookie // Name must match that of StartUp.cs configuration
            },
            body: JSON.stringify(data)
        });
    }

    private getCookie(cname: string) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
}