import { GameInstance } from "./GameInstance";
import { GameStateType } from "./enums/GameStateType";
import { MessageType } from "./enums/MessageType";
import { Message } from "./models/messages/Message";
import { messageService } from "./services/MessageService";
import { PlayerType } from "./enums/PlayerType";
import SchedulerService from "./services/SchedulerService";
import { SchedulerType } from "./enums/SchedulerType";
import { gameService } from "./services/GameService";
import { RoundData } from "./models/scores/RoundData";
import { LOGGER } from "../utils/LoggerService";
import { PickType } from "./enums/PickType";
import { ScoreData } from "./models/scores/ScoreData";
import { Constants } from "../utils/Constants";
import { RoundChangeMessageData } from "./models/messages/RoundChangeMessageData";
import { ScoreMessageData } from "./models/messages/ScoreMessageData";
import { MatchMessageData } from "./models/messages/MatchMessageData";
import { PreMatchMessageData } from "./models/messages/PreMatchMessageData";
import { GameData } from "./models/GameData";
import { getRandomInteger } from "../utils/GetRandomNumber";
import { httpClient } from "../utils/lib/HttpClient";
import EnvConfigVars from "../utils/lib/EnvConfigVars";

export class GameSystem {

    public static beginGame(gameId: string) {
        const gameInstance = gameService.getInstance(gameId);
        gameInstance.gameState = GameStateType.GameInProgress;
        gameService.updateInstance(gameInstance);
        this.startRound(gameId);
    }

    public static startRound(gameId: string) {
        const gameInstance = gameService.getInstance(gameId);
        gameInstance.intermission = false;
        let newRoundNumber;
        if (gameInstance.currentRound) newRoundNumber = gameInstance.currentRound.roundNumber + 1;
        else newRoundNumber = 1;
        gameInstance.currentRound = new RoundData(newRoundNumber);
        gameInstance.gameState = GameStateType.GameInProgress;
        gameInstance.gameTimestamps.rounds[newRoundNumber] = { started: Date.now() };
        LOGGER.debug(`Round ${newRoundNumber} started, gameId ${gameId}`);
        GameSystem.sendMatchMessage(MessageType.RoundStart, gameInstance);
        gameService.updateInstance(gameInstance);
        SchedulerService.executeScheduler(SchedulerType.EndRound, gameInstance.gameId);
    }

    public static EndRound(gameId: string) {
        const gameInstance = gameService.getInstance(gameId);
        SchedulerService.cancelScheduler(SchedulerType.EndRound, gameId);
        gameInstance.intermission = true;
        gameInstance.gameState = GameStateType.GameIntermission;
        gameInstance.gameTimestamps.rounds[gameInstance.currentRound.roundNumber].finished = Date.now();
        GameSystem.sendMatchMessage(MessageType.RoundEnd, gameInstance);
        LOGGER.debug(`Round ${gameInstance.currentRound.roundNumber} finished, gameId ${gameId}`);
        this.handleRoundScore(gameInstance.currentRound);
        const isFinishedGame = this.handleTotalScore(gameInstance.scoreData, gameInstance.currentRound.roundWinner!, gameInstance.currentRound.roundNumber);
        GameSystem.sendMatchMessage(MessageType.Score, gameInstance);
        LOGGER.debug(`Round ${gameInstance.currentRound.roundNumber} total score, gameId ${gameId}, total score ${JSON.stringify(gameInstance.scoreData)} `);
        gameService.updateInstance(gameInstance);
        if (isFinishedGame) this.handleEndGame(gameId, gameInstance.currentRound.roundWinner!)
        else this.startRound(gameId);
    }

    private static handleEndGame(gameId: string, winner: PlayerType) {
        const gameInstance = gameService.getInstance(gameId);
        gameInstance.gameState = GameStateType.GameFinished;
        gameInstance.scoreData.winner = winner;
        gameInstance.gameTimestamps.match.finished = Date.now();
        this.sendMatchMessage(MessageType.GameFinished, gameInstance)
        LOGGER.debug(`GameId ${gameId} finished. Winner ${winner} `);
        gameService.updateInstance(gameInstance);
        const gameApiData = new GameData(gameId, GameStateType.GameFinished, gameInstance.playerInfo[PlayerType.Player1], gameInstance.playerInfo[PlayerType.Player2],
            gameInstance.gameTimestamps.match.started, gameInstance.gameTimestamps.match.finished, gameInstance.playerInfo[winner]);
        gameService.destroyGame(gameApiData)
    }

    private static handleRoundScore(currentRound: RoundData) {
        const playedThisRound = currentRound.playedThisRound;
        if (!playedThisRound[PlayerType.Player1]) playedThisRound[PlayerType.Player1] = getRandomInteger(1, 3);
        if (!playedThisRound[PlayerType.Player2]) playedThisRound[PlayerType.Player2] = getRandomInteger(1, 3);
        currentRound.roundWinner = this.calculateRoundWinner(playedThisRound[PlayerType.Player1], playedThisRound[PlayerType.Player2]);
        LOGGER.debug(`Round ${currentRound.roundNumber} picks ${JSON.stringify(playedThisRound)}. Round winner ${currentRound.roundWinner}`);
    }

    private static handleTotalScore(scoreData: ScoreData, roundWinner: PlayerType, roundNum: number): boolean {
        scoreData.roundWinners[roundNum] = roundWinner;
        if (roundWinner !== PlayerType.Tie) {
            scoreData.totalScore[roundWinner]++;
            if (scoreData.totalScore[roundWinner] >= Constants.ROUNDS_TO_WIN) return true;
        }
        return false;
    }

    private static calculateRoundWinner(player1Pick: PickType, player2Pick: PickType): PlayerType {
        const winners = [PlayerType.Tie, PlayerType.Player1, PlayerType.Player2];
        const winIndex = (player1Pick - player2Pick + 3) % 3;
        return winners[winIndex];
    }

    public static sendMatchMessage(messageType: MessageType, gameInstance: GameInstance, player?: PlayerType) {
        const gameState = gameInstance.gameState;
        let messageData;
        switch (messageType) {
            case MessageType.GameWaiting:
            case MessageType.GameStarting: {
                messageData = new PreMatchMessageData(Object.values(gameInstance.playerInfo), gameState);
                break;
            }
            case MessageType.GameInProgress:
            case MessageType.GameFinished: {
                const matchTimeStamps = gameInstance.gameTimestamps?.match;
                const totalScore = gameInstance.scoreData.totalScore;
                messageData = new MatchMessageData(gameState, matchTimeStamps.started, totalScore, matchTimeStamps.finished, gameInstance.scoreData.winner);
                break;
            }

            case MessageType.RoundStart:
            case MessageType.RoundEnd: {
                const roundNumber = gameInstance.currentRound.roundNumber;
                const roundTimeStamps = gameInstance.gameTimestamps.rounds;
                messageData = new RoundChangeMessageData(gameState, roundNumber, roundTimeStamps[roundNumber].started, roundTimeStamps[roundNumber].finished);
                break;
            }
            case MessageType.Score: {
                const currentRound = gameInstance.currentRound;
                const totalScore = gameInstance.scoreData.totalScore;
                messageData = new ScoreMessageData(currentRound.playedThisRound, currentRound.roundWinner!, totalScore);
                break;
            }
            case MessageType.Reconnect: {
                if (gameState === GameStateType.GameWaiting) messageData = new PreMatchMessageData(Object.values(gameInstance.playerInfo), gameState);
                else {
                    const matchTimeStamps = gameInstance.gameTimestamps?.match;
                    const totalScore = gameInstance.scoreData.totalScore;
                    messageData = new MatchMessageData(gameState, matchTimeStamps.started, totalScore, matchTimeStamps.finished, gameInstance.scoreData.winner);
                }
                break;
            }
            default: throw new Error(`Invalid message type ${MessageType[messageType]}`);
        }

        const message = new Message(messageType, messageData);

        if (player) {
            let playerId = gameInstance.playerInfo[player];
            messageService.sendMessageToPlayer(playerId, message);
        }
        else messageService.sendMessageToRoom(gameInstance.gameId, message);
    }


}