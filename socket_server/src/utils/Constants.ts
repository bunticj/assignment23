export class Constants {
    // configuration
    public static readonly GAME_ID_LENGTH = 9;
    public static readonly ROOM_MAX_SIZE = 2;
    public static readonly SERVER_TOKEN_DURATION = 45; // s => 45s;
    public static readonly DISCONNECT_TIMER = 45000;  // ms => 45s;
    public static readonly STARTING_MATCH_DURATION = 15000;  // ms => 45s;
    public static readonly ROUND_DURATION = 5000;  // ms => 5s;
    public static readonly ROUNDS_TO_WIN = 3;

    //socket event names
    public static readonly gameRoomPrefixName = "game_";
    public static readonly leaveRoomName = "leave_room";
    public static readonly joinGameName = "join_game";
    public static readonly sendPickName = "send_pick";
    public static readonly messageName = "message";
}
