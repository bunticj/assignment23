import { GameStateType } from "../enums/GameStateType";

export class GameData {
    public game_id: string;
    public game_state: GameStateType;
    public started_at?: number;
    public finished_at?: number
    public player1: number;
    public player2?: number;
    public winner?: number;
    constructor(gameId: string, gameState: GameStateType, player1: number, player2?: number, gameStarted?: number, gameFinished?: number, winner?: number) {
        this.game_id = gameId;
        this.game_state = gameState;
        this.started_at = gameStarted;
        this.finished_at = gameFinished;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = winner;
    }
}