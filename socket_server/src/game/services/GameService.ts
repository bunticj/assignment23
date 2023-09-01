import { socketServer } from "../../App";
import { IDictionary, ValidationGameData } from "../../interfaces/HelperInterfaces";
import { Constants } from "../../utils/Constants";
import { LOGGER } from "../../utils/LoggerService";
import { GameInstance } from "../GameInstance";
import { GameStateType } from "../enums/GameStateType";
import { MessageType } from "../enums/MessageType";
import { PickType } from "../enums/PickType";
import { PlayerType } from "../enums/PlayerType";
import { GameData } from "../models/GameData";
import { Message } from "../models/messages/Message";
import { TextMessageData } from "../models/messages/TextMessageData";
import { messageService } from "./MessageService";

class GameService {
    private static activeGames: IDictionary<GameInstance> = {}; //roomId: GameInstance

    private createGame(roomId: string, playerId: number) {
        const gameId = roomId.split(Constants.gameRoomPrefixName)[1];
        LOGGER.debug(`User ${playerId} creates new game with id ${gameId}`);
        const gameData = new GameInstance(gameId, playerId);
        GameService.activeGames[roomId] = gameData;
    }

    public joinGame(roomId: string, playerId: number) {
        const activeGame = GameService.activeGames[roomId];
        if (!activeGame) this.createGame(roomId, playerId);
        else activeGame.joinExistingGame(playerId);
    }

    public sendPick(pickType: PickType, playerId: number, roomId: string) {
        const isSuccess = GameService.activeGames[roomId].sendPick(pickType, playerId);
        if (isSuccess) LOGGER.debug(`User ${playerId} plays ${PickType[pickType]}!`);
        else {
            const messageData = new TextMessageData("Move Rejected!");
            const message = new Message(MessageType.Rejected, messageData);
            messageService.sendMessageToPlayer(playerId, message);
            LOGGER.debug(`User ${playerId} ${PickType[pickType]} rejected!`);
        }
    }

    public getValidationData(roomId: string): ValidationGameData | undefined {
        const activeGame = GameService.activeGames[roomId];
        if (!activeGame) return;
        const validationData: ValidationGameData = { gameId: activeGame.gameId, players: Object.values(activeGame.playerInfo), gameState: activeGame.gameState };
        return validationData;
    }

    public getInstance(gameId: string): GameInstance {
        const roomId = Constants.gameRoomPrefixName + gameId;
        return GameService.activeGames[roomId];
    }

    public updateInstance(gameInstance: GameInstance) {
        const roomId = Constants.gameRoomPrefixName + gameInstance.gameId;
        GameService.activeGames[roomId] = gameInstance;
    }

    public destroyGame(gameData: GameData) {
        LOGGER.debug(`Destroy gameId ${gameData.gameId}`);
        const roomId = Constants.gameRoomPrefixName + gameData.gameId;
        socketServer.io.to(roomId).emit(Constants.leaveRoomName);
        delete GameService.activeGames[roomId];
        // todo update game data via api after php implementation
    }

    public cancelIfPossible(roomId: string) {
        const activeGame = GameService.activeGames[roomId];
        if (!activeGame || activeGame.gameState !== GameStateType.GameWaiting) return;
        activeGame.gameState = GameStateType.GameCancelled;
        activeGame.intermission;
        const cancelledGameData = new GameData(activeGame.gameId, GameStateType.GameCancelled, activeGame.playerInfo[PlayerType.Player1], undefined, Date.now(), Date.now());
        LOGGER.debug(`Cancel gameId ${activeGame.gameId}`);
        this.destroyGame(cancelledGameData)
    }

}

export const gameService = new GameService();