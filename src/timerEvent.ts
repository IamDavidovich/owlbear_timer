export type TimerEvent = {
    event: TimerEventNames;
    timestamp: number;
    interval: number;
};

export enum TimerEventNames {
    Play = "PLAY",
    Pause = "PAUSE",
    Stop = "STOP",
    Reset = "RESET",
    UpdateDefaultInterval = "UPDATE_DEFAULT_INTERVAL",
}
