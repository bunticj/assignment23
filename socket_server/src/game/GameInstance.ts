import { Constants } from "../utils/Constants";
import { GameStateType } from "./enums/GameStateType";
import { ScoreData } from "./models/scores/ScoreData";
import { MessageType } from "./enums/MessageType";
import { IDictionary } from "../interfaces/HelperInterfaces";
import { GameTimestamps } from "./models/GameTimestamps";
import { RoundData } from "./models/scores/RoundData";
import { GameSystem } from "./GameSystem";
import { PlayerType } from "./enums/PlayerType";
import SchedulerService from "./services/SchedulerService";
import { SchedulerType } from "./enums/SchedulerType";
import { PickType } from "./enums/PickType";
import { messageService } from "./services/MessageService";
import { LOGGER } from "../utils/LoggerService";
export class GameInstance {
    public gameId: string;
    public gameState: GameStateType;
    public scoreData: ScoreData;
    public gameTimestamps: GameTimestamps; //init timestamps
    public currentRound: RoundData;
    public intermission: boolean;
    public playerInfo: IDictionary<number>; // { PlayerType : RealPlayerId }
    constructor(gameId: string, firstPlayerId: number) {
        this.gameId = gameId;
        this.playerInfo = {};
        this.playerInfo[PlayerType.Player1] = firstPlayerId;
        this.gameState = GameStateType.GameWaiting;
        this.intermission = false;
        this.scoreData = new ScoreData();
    }

    public joinExistingGame(playerId: number) {
        //emit the message so the user can receive the latest data on reconnect
        if (this.playerInfo[PlayerType.Player1] === playerId) GameSystem.sendMatchMessage(MessageType.Reconnect, this, PlayerType.Player1)
        else if (this.playerInfo[PlayerType.Player2] === playerId) GameSystem.sendMatchMessage(MessageType.Reconnect, this, PlayerType.Player2)
        else this.playerInfo[PlayerType.Player2] = playerId;

        // state change is initiated
        if (this.intermission) return;
        if (this.gameState === GameStateType.GameWaiting && Object.keys(this.playerInfo).length === Constants.ROOM_MAX_SIZE) {
            LOGGER.debug("Room full! The game is about to start..");
            this.startingGame();
        }
    }

    public sendPick(pickType: PickType, playerId: number): boolean {
        if (this.gameState !== GameStateType.GameInProgress || this.intermission) return false;
        const playerType = this.getPlayerType(playerId);
        if (!playerType) return false;
        this.currentRound.playedThisRound[playerType] = pickType;
        return true
    }

    public startingGame() {
        this.intermission = true;
        this.gameState = GameStateType.GameStarting;
        this.gameTimestamps = new GameTimestamps();
        GameSystem.sendMatchMessage(MessageType.GameStarting, this);
        // todo update game data via api after php implementation
        SchedulerService.executeScheduler(SchedulerType.SetGameInProgress, this.gameId)
    }

    private getPlayerType(playerId: number): PlayerType | undefined {
        if (this.playerInfo[PlayerType.Player1] === playerId) return PlayerType.Player1;
        else if (this.playerInfo[PlayerType.Player2] === playerId) return PlayerType.Player2;
        return;
    }
}