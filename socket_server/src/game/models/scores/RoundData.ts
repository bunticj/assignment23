import { IDictionary } from "../../../interfaces/HelperInterfaces";
import { PickType } from "../../enums/PickType";
import { PlayerType } from "../../enums/PlayerType";

export class RoundData {
    public roundNumber: number;
    public playedThisRound: IDictionary<PickType>; // {PlayerType: PickType}
    public roundWinner?: PlayerType;
    constructor(roundNumber: number = 0, playedThisRound: IDictionary<PickType> = {}, roundWinner?: PlayerType) {
        this.roundNumber = roundNumber;
        this.roundWinner = roundWinner;
        this.playedThisRound = playedThisRound;
    }
}