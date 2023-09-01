import { GameStateType } from "../../enums/GameStateType";

export class RoundChangeMessageData {
    public roundNumber: number;
    public roundStarted: number;
    public roundEnded?: number;
    public gameState: GameStateType;
    constructor(gameState: GameStateType, roundNumber: number, roundStarted: number, roundEnded?: number) {
        this.gameState = gameState;
        this.roundNumber = roundNumber;
        this.roundStarted = roundStarted;
        this.roundEnded = roundEnded;
    }
}