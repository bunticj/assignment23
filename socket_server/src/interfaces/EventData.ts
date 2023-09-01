import { PickType } from "../game/enums/PickType";

export interface JoinEventData {
    gameId: string;
}

export interface PickEventData {
    pickType: PickType
}

export interface LeaveRoomData {
    roomId: string;
}

