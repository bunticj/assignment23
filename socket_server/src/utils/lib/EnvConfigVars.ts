import * as dotenv from "dotenv";
dotenv.config();
export default {
    SOCKET_SERVER_PORT: +(process.env.SOCKET_SERVER_PORT)! || 3001,
    SOCKET_SERVER_HOST: process.env.SOCKET_SERVER_HOST || "localhost",
    HTTP_PROTOCOL_TYPE: process.env.HTTP_PROTOCOL_TYPE || 'http',
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH, // If we want to use https, add certificate path  and set protocol in .env file
    HTTPS_CERT_PATH: process.env.HTTPS_CERTIFICATE_PATH,
    SECRET_KEY: process.env.SECRET_KEY || "t32ads90_78-fda8?f09dfa89dfadfle",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    NGINX_IP: (process.env.NGINX_IP) ? "http://" + process.env.NGINX_IP : "http://localhost:80",
    VERBOSE_LOGS: process.env.VERBOSE_LOGS || ""
}