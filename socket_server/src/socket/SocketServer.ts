import { Server as IoServer, Socket } from 'socket.io';
import { LOGGER } from '../utils/LoggerService';
import { socketManager } from './SocketPlayerManager';
import EnvConfigVars from '../utils/lib/EnvConfigVars';
import { AuthSocket } from '../interfaces/HelperInterfaces';
import { httpClient } from '../utils/lib/HttpClient';

export class SocketServer {
    public io: IoServer;
    constructor(io: IoServer) {
        this.io = io;
        this.setupSockets();
    }

    private setupSockets() {
        this.io.use(async (socket: Socket, next) => {
            if (await this.isSocketAuthenticated(socket as AuthSocket)) next();
            else LOGGER.error("Invalid authentication");
        });

        this.io.on("connection", (socket: AuthSocket) => {
            LOGGER.debug(`User ${socket.playerId} connected with socket ${socket.id}`);
            socketManager.addNewPlayer(socket);
        });
    }

    private async isSocketAuthenticated(socket: AuthSocket): Promise<boolean> {
        try {
            if (!socket || !socket.handshake.query.authorization) return false;
            const authToken = socket.handshake.query.authorization as string;
            const fullUrl = EnvConfigVars.CODE_IGNITER_URL + "/me";
            const axiosResponse = await httpClient.sendHttpRequest(fullUrl, undefined, "GET", authToken);
            const response = axiosResponse.data;
            LOGGER.debug(JSON.stringify(response));
            if (!response || axiosResponse.status !== 200 || !response.user_id) return false;


            socket.playerId = response.user_id;
            socket.email = response.email;
            return true;

        }
        catch (error) {
            return false;
        }
    }
}
