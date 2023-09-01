import SocketController from '../controllers/SocketController';
import { SchedulerType } from '../game/enums/SchedulerType';
import { gameService } from '../game/services/GameService';
import SchedulerService from '../game/services/SchedulerService';
import { AuthSocket, IDictionary } from '../interfaces/HelperInterfaces';
class SocketPlayerManager {
    private playerSockets: IDictionary<SocketController>; //  { playerId: SocketInstance }
    constructor() {
        this.playerSockets = {};
    }

    public getSocketId(playerId: number): string | undefined {
        return this.playerSockets[playerId]?.socket.id;
    }

    public addNewPlayer(socket: AuthSocket) {
        const playerId = socket.playerId!;
        SchedulerService.cancelScheduler(SchedulerType.DisconnectPlayer, playerId);
        const socketController = new SocketController(socket);
        const oldSocket = this.playerSockets[playerId]?.socket;
        socketController.initializeSocketHandlers(oldSocket);
        this.playerSockets[playerId] = socketController;
    }

    public removeOnlinePlayer(playerId: number) {
        gameService.cancelIfPossible(this.playerSockets[playerId].roomId);
        SchedulerService.cancelScheduler(SchedulerType.DisconnectPlayer, playerId);
        delete this.playerSockets[playerId];
    }

}

export const socketManager = new SocketPlayerManager();