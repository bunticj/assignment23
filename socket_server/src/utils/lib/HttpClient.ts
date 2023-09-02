import axios, { AxiosResponse } from "axios";
import { jwtToken } from "./JwtToken";

class HttpClient {
    public async sendHttpRequest<T>(url: string, body: T, method: string, authToken?: string): Promise<AxiosResponse> {
        if (!authToken) authToken = jwtToken.signJwtToken();
        const headers = {
            "Accept": "application/json",
            "Authorization": authToken,
            "Content-Type": "application/json"
        };
        switch (method) {
            case "GET": return axios.get(url, { headers });
            case "POST": return axios.post(url, body, { headers });
            case "PATCH": return axios.patch(url, body, { headers });
            default: throw new Error("Unsupported method")
        }
    }
}

export const httpClient = new HttpClient()
