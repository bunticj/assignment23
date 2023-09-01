import { gameService } from "../../game/services/GameService";
import { GameStateType } from "../../game/enums/GameStateType";
import { PickType } from "../../game/enums/PickType";
import { JoinEventData, PickEventData } from "../../interfaces/EventData";
import { Constants } from "../../utils/Constants";

export const validateJoinGame = (data: JoinEventData, playerId: number): string => {
    const gameId = data.gameId;
    if (!gameId || typeof gameId !== "string" || gameId.length !== Constants.GAME_ID_LENGTH) throw new Error(`Invalid gameId: ${gameId}`);
    const roomId = Constants.gameRoomPrefixName + data.gameId;
    const activeGameData = gameService.getValidationData(roomId);
    if (!activeGameData) return roomId;
    // allow reconnect
    if (!activeGameData.players.includes(playerId)) {
        if (activeGameData.gameState !== GameStateType.GameWaiting) throw new Error(`Invalid game state ${GameStateType[activeGameData.gameState]}`);
        if (activeGameData.players.length >= Constants.ROOM_MAX_SIZE) throw new Error(`Game is full!`);
    }
    return roomId;
}

export const validateSendPick = (data: PickEventData, roomId: string): string => {
    const pickType = data.pickType;
    if (!pickType || typeof pickType !== "number" || !PickType[pickType]) throw new Error(`Invalid pick type ${PickType[pickType]}`);
    const activeGameData = gameService.getValidationData(roomId);
    if (!activeGameData) throw new Error(`Invalid room id ${roomId}`);
    // We allow the event in intermission state, because we will handle it through game logic
    if (![GameStateType.GameInProgress, GameStateType.GameIntermission].includes(activeGameData.gameState)) throw new Error(`Invalid game state ${GameStateType[activeGameData.gameState]}`);
    return roomId;
}
