
import http from "http";
import https from "https";
import { Server as IoServer } from "socket.io"
import fs from "fs"
import EnvConfigVars from "./utils/lib/EnvConfigVars";
import { SocketServer } from "./socket/SocketServer";

let server: http.Server | https.Server;
// If we want to create a secure server
if (EnvConfigVars.HTTP_PROTOCOL_TYPE === 'https') {
    const key = fs.readFileSync(`${EnvConfigVars.HTTPS_KEY_PATH}`);
    const cert = fs.readFileSync(`${EnvConfigVars.HTTPS_CERT_PATH}`);
    server = https.createServer({ key, cert });
}
else server = http.createServer();
const ioServer = new IoServer(server, { allowEIO3: true, cors: { origin: EnvConfigVars.CORS_ORIGIN } });
server.listen(EnvConfigVars.SOCKET_SERVER_PORT, () => {
    console.log(`Server listening at ${EnvConfigVars.SOCKET_SERVER_PORT}`);
});

export const socketServer = new SocketServer(ioServer);
