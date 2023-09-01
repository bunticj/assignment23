import axios from "axios";

class HttpClient {
    public async sendHttpRequest<T>(url: string, body: T, method: string, authToken: string) {
        const headers = {
            "Accept": "application/json",
            "Authorization": authToken,
            "Content-Type": "application/json"
        };
        switch (method) {
            case "GET": return await axios.get(url, { headers });
            case "POST": return await axios.post(url, body, { headers });
            case "PATCH": return await axios.patch(url, body, { headers });
            default: throw new Error("Unsupported method")
        }
    }
}

export const httpClient = new HttpClient()
