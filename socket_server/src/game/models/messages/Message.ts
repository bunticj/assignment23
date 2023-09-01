import { MessageType } from "../../enums/MessageType";

export class Message<T> {
    public messageType: MessageType;
    public messageData: T;
    constructor(messageType: MessageType, messageData: T) {
        this.messageType = messageType;
        this.messageData = messageData;
    }
}