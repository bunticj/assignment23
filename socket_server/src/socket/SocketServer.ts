import { Server as IoServer, Socket } from 'socket.io';
import { LOGGER } from '../utils/LoggerService';
import { socketManager } from './SocketPlayerManager';
import EnvConfigVars from '../utils/lib/EnvConfigVars';
import { AuthSocket } from '../interfaces/HelperInterfaces';

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
        if (!socket || !socket.handshake.query.authorization) return false;
        const authToken = socket.handshake.query.authorization as string;
        const fullUrl = EnvConfigVars.CODE_IGNITER_URL + "/me";
        // delete this, uncomment down
        if (authToken === "auth1") socket.playerId = 101;
        else if (authToken === "auth2") socket.playerId = 202;
        else return false;
        //  const response = await sendRequest(fullUrl, undefined, "GET", authToken);
        //  if (response.status !== 200 || response.data.error) return false
        //  const playerId = "responseData.playerId";
        return true;
    }
}
