import { socketServer } from "../../App";
import { socketManager } from "../../socket/SocketPlayerManager";
import { Constants } from "../../utils/Constants";
import { Message } from "../models/messages/Message";

class MessageService {
    
    public sendMessageToPlayer<T>(playerId: number, message: Message<T>) {
        const socketId = socketManager.getSocketId(playerId);
        if (socketId) socketServer.io.to(socketId).emit(Constants.messageName, message);
    }

    public sendMessageToRoom<T>(gameId: string, message: Message<T>) {
        const roomId = Constants.gameRoomPrefixName + gameId;
        socketServer.io.to(roomId).emit(Constants.messageName, message);
    }
}

export const messageService = new MessageService();