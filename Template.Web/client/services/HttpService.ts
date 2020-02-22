export default class HttpService {

    public get(url: string): Promise<Response> {
        if (!url)
            throw new Error("HttpService.get(): Url was null or undefined");
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    public post(url: string, data: any) {
        if (!url)
            throw new Error("HttpService.post(): Url was null or undefined");
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
}