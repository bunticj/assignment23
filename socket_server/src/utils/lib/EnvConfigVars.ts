import * as dotenv from "dotenv";
dotenv.config();
export default {
    SOCKET_SERVER_PORT: +(process.env.SOCKET_SERVER_PORT)! || 3001,
    SOCKET_SERVER_HOST: process.env.SOCKET_SERVER_HOST || "localhost",
    HTTP_PROTOCOL_TYPE: process.env.HTTP_PROTOCOL_TYPE || 'http',
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH, // If we want to use https, add certificate path  and set protocol in .env file
    HTTPS_CERT_PATH: process.env.HTTPS_CERTIFICATE_PATH,
    SECRET_KEY: process.env.SECRET_KEY || "testsecretkey,movetoenvfile",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    CODE_IGNITER_URL: (process.env.CODE_IGNITER_URL) || "http://localhost:80",
    VERBOSE_LOGS: process.env.VERBOSE_LOGS || ""
}