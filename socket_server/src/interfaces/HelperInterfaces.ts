import { GameStateType } from "../game/enums/GameStateType";
import { Socket } from "socket.io";
export interface AuthSocket extends Socket {
    playerId?: number;
    shouldSkipClearData?: boolean;
}
export interface IDictionary<T> {
    [key: string | number]: T;
}

export interface ITimestamps {
    started: number;
    finished?: number;
}

export interface ValidationGameData {
    gameId: string
    players: number[];
    gameState: GameStateType;
}