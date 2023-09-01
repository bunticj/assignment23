import { IDictionary } from "../../../interfaces/HelperInterfaces";
import { GameStateType } from "../../enums/GameStateType";
import { PickType } from "../../enums/PickType";
import { PlayerType } from "../../enums/PlayerType";

export class MatchMessageData {
    public gameState: GameStateType;
    public gameStarted: number;
    public totalScore: IDictionary<number>; // {PlayerType : score}
    public gameFinished?: number;
    public winner :PlayerType;
    constructor(gameState: GameStateType, gameStarted: number, totalScore: IDictionary<number>, gameFinished?: number, winner?: PlayerType) {
        this.gameState = gameState;
        this.gameStarted = gameStarted;
        this.totalScore = totalScore;
        this.gameFinished = gameFinished;
    }
}