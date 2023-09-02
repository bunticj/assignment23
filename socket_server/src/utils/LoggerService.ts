import EnvConfigVars from "./lib/EnvConfigVars";

export default class Logger {
    private verbose: string;
    constructor(verbose = "") {
        this.verbose = verbose;
    }
    public error(error: string): void {
        console.error(new Date().toISOString() + " [ERROR]: " + error);
    }

    public debug(message: string): void {
        if (!this.verbose) return;
        console.debug(new Date().toISOString() + " [DEBUG]: " + message);
    }

    public log(message: string): void {
        console.log(new Date().toISOString() + " [INFO]: " + message);
    }

}

export const LOGGER = new Logger(EnvConfigVars.VERBOSE_LOGS)