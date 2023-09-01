import { socketManager } from '../socket/SocketPlayerManager';
import { LOGGER } from '../utils/LoggerService';
import { validateJoinGame, validateSendPick } from '../socket/validator/SocketEventValidation';
import { Constants } from '../utils/Constants';
import { gameService } from '../game/services/GameService';
import SchedulerService from '../game/services/SchedulerService';
import { SchedulerType } from '../game/enums/SchedulerType';
import { JoinEventData, LeaveRoomData, PickEventData } from '../interfaces/EventData';
import { AuthSocket } from '../interfaces/HelperInterfaces';

export default class SocketController {
    public socket: AuthSocket;
    private connectedAt: number;
    public roomId: string;
    constructor(socket: AuthSocket) {
        this.socket = socket;
        this.connectedAt = this.connectedAt;
        this.roomId = "";
    }

    public initializeSocketHandlers(oldSocket?: AuthSocket) {
        this.connectionHandler(oldSocket);
        this.disconnectHandler();
        this.joinGameHandler();
        this.sendPickHandler();
        this.leaveRoomHandler();
    }

    private connectionHandler(oldSocket?: AuthSocket) {
        //handle multiple logins, disconnect the previous socket
        if (oldSocket) {
            oldSocket.shouldSkipClearData = true;
            oldSocket.disconnect()
        }
    }

    private disconnectHandler() {
        this.socket.on("disconnect", (reason) => {
            const playerId = this.socket.playerId!;
            LOGGER.debug(`Socket Disconnect called for player ${playerId}, on socket ${this.socket.id} because ${reason}`);
            if (reason === "transport close" || reason === "ping timeout") {
                // if the connection unexpectedly closed, await for the reconnect for 60seconds, after that cleanup the player data if the timer is not cancelled
                SchedulerService.executeScheduler(SchedulerType.DisconnectPlayer, playerId);
            }
            else if (!this.socket.shouldSkipClearData) socketManager.removeOnlinePlayer(playerId);
        });
    }

    private joinGameHandler() {
        this.socket.on(Constants.joinGameName, (data: JoinEventData) => {
            try {
                const playerId = this.socket.playerId!;
                const roomId = validateJoinGame(data, playerId);
                this.socket.join(roomId);
                this.roomId = roomId;
                LOGGER.debug(`User ${playerId} joins room ${roomId}`);
                gameService.joinGame(roomId, playerId);
            }
            catch (error) {
                LOGGER.error("Error " + error + "stack = " + (error as Error).stack);
            }
        });
    }

    private leaveRoomHandler() {
        this.socket.on(Constants.leaveRoomName, (data: LeaveRoomData) => {
            try {
                const playerId = this.socket.playerId!;
                this.roomId = "";
                this.socket.leave(data.roomId);
                LOGGER.debug(`User ${playerId} leaves room ${data.roomId}`);
            }
            catch (error) {
                LOGGER.error("Error " + error + "stack = " + (error as Error).stack);
            }
        });
    }

    private sendPickHandler() {
        this.socket.on(Constants.sendPickName, (data: PickEventData) => {
            try {
                const playerId = this.socket.playerId!;
                validateSendPick(data, this.roomId);
                gameService.sendPick(data.pickType, playerId, this.roomId);
            }
            catch (error) {
                LOGGER.error("Error " + error + "stack = " + (error as Error).stack);
            }
        });
    }

}

