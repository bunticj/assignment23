import { GameStateType } from "../../enums/GameStateType";
import { PlayerType } from "../../enums/PlayerType";

export class PreMatchMessageData {
    public players: PlayerType[];
    public gameState: GameStateType;
    constructor(players: PlayerType[], gameState: GameStateType) {
        this.players = players;
        this.gameState = gameState;
    }
}
