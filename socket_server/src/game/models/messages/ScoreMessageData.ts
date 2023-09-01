import { IDictionary } from "../../../interfaces/HelperInterfaces";
import { PickType } from "../../enums/PickType";

export class ScoreMessageData {
    public playedThisRound: IDictionary<PickType>;
    public roundWinner: number;
    public totalScore: IDictionary<number>;
    constructor(playedThisRound: IDictionary<PickType>, roundWinner: number, totalScore: IDictionary<number>) {
        this.playedThisRound = playedThisRound;
        this.roundWinner = roundWinner;
        this.totalScore = totalScore;
    }
}