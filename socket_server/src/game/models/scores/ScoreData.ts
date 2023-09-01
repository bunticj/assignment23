import { IDictionary } from "../../../interfaces/HelperInterfaces";
import { PlayerType } from "../../enums/PlayerType";
export class ScoreData {
    public roundWinners: IDictionary<number>; // { roundNumber: winnerPlayer }
    public totalScore: IDictionary<number>; // { PlayerType : result }
    public winner?: PlayerType;
    constructor(roundWinners: IDictionary<number> = {}) {
        this.roundWinners = roundWinners;
        this.totalScore = {};
        this.totalScore[PlayerType.Player1] = 0;
        this.totalScore[PlayerType.Player2] = 0;
    }
}