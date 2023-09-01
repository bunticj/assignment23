import { IDictionary, ITimestamps } from "../../interfaces/HelperInterfaces";

export class GameTimestamps {
    public match: ITimestamps;
    public rounds: IDictionary<ITimestamps>;
    constructor(match: ITimestamps = { started: Date.now() }, rounds: IDictionary<ITimestamps> = {}) {
        this.match = match;
        this.rounds = rounds;
    }
}