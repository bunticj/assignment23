import { GameStateType } from "../enums/GameStateType";

export class GameData {
    public gameId: string;
    public gameState: GameStateType;
    public gameStarted?: number;
    public gameFinished?: number
    public player1: number;
    public player2?: number;
    public winner?: number;
    constructor(gameId: string, gameState: GameStateType, player1: number, player2?: number, gameStarted?: number, gameFinished?: number, winner?: number) {
        this.gameId = gameId;
        this.gameState = gameState;
        this.gameStarted = gameStarted;
        this.gameFinished = gameFinished;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = winner;

    }
}