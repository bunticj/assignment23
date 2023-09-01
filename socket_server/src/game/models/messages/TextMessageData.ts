import { GameStateType } from "../../enums/GameStateType";
import { MessageType } from "../../enums/MessageType";

export class TextMessageData {
    public messageText: string;
    constructor( messageText: string) {
        this.messageText = messageText;
    }
}