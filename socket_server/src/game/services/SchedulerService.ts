import { IDictionary } from "../../interfaces/HelperInterfaces";
import { socketManager } from "../../socket/SocketPlayerManager";
import { Constants } from "../../utils/Constants";
import { LOGGER } from "../../utils/LoggerService";
import { GameSystem } from "../GameSystem";
import { SchedulerType } from "../enums/SchedulerType";


export default class SchedulerService {
    private static schedulers: IDictionary<IDictionary<NodeJS.Timeout>> = {};// { ownerId :   { schedulerType : timeout }}

    public static cancelScheduler(schedulerType: SchedulerType, ownerId: string | number) {
        const scheduler = SchedulerService.schedulers[ownerId];
        if (scheduler && scheduler[schedulerType]) {
            clearTimeout(scheduler[schedulerType]);
            delete scheduler[schedulerType];
        }
    }

    public static async executeScheduler(schedulerType: SchedulerType, ownerId: string | number) {
        this.cancelScheduler(schedulerType, ownerId);
        let schedulerCallback: () => void;
        let delayInMs = 0;
        switch (schedulerType) {
            case SchedulerType.DisconnectPlayer: {
                delayInMs = Constants.DISCONNECT_TIMER;
                schedulerCallback = () => socketManager.removeOnlinePlayer(ownerId as number);
                break;
            }
            case SchedulerType.SetGameInProgress: {
                delayInMs = Constants.STARTING_MATCH_DURATION;
                schedulerCallback = () => GameSystem.beginGame(ownerId as string)
                break;
            }
            case SchedulerType.EndRound: {
                delayInMs = Constants.ROUND_DURATION;
                schedulerCallback = () => GameSystem.EndRound(ownerId as string);
                break;
            }
            default: {
                LOGGER.error("Invalid scheduler type, data =  " + JSON.stringify({ schedulerType, ownerId }));
                return;
            }
        }
        if (!this.schedulers[ownerId]) this.schedulers[ownerId] = {};
        SchedulerService.schedulers[ownerId][schedulerType] = setTimeout(() => {
            schedulerCallback();
        }, delayInMs);

    }
}
