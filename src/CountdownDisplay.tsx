import React, {Component} from 'react';

import OBR from "@owlbear-rodeo/sdk";
import {getPluginId} from "./getPluginId";
import {TimerEvent, TimerEventNames} from "./timerEvent";
import CountdownTimer, {CountdownTimerAPI} from "./CountdownTimer";

export default class CountdownDisplay extends Component<any, any> {
    state:{
        lastEvent: TimerEvent | null;
    } = {
        lastEvent: null,
    };

    private countdownTimer: CountdownTimerAPI;
    private unsubscribeMetadataListener: () => void;

    componentDidMount() {
        // Register listener
        this.unsubscribeMetadataListener = OBR.scene.onMetadataChange((metadata) => {
            let eventData = metadata[getPluginId('event')];
            if (!eventData) {
                return;
            }

            let lastEvent: TimerEvent = {
                event: eventData.event as TimerEventNames,
                timestamp: eventData.timestamp as number,
                interval: eventData.interval as number,
            }

            if (!this.alreadyReceived(lastEvent)) {
                this.setState({lastEvent: lastEvent});
                this.handleEvent(lastEvent);
            }
        })
    }

    componentWillUnmount() {
        this.unsubscribeMetadataListener();
    }

    alreadyReceived(event: TimerEvent): boolean {
        return this.state.lastEvent?.event === event.event && this.state.lastEvent?.timestamp === event.timestamp
    }

    handleEvent(event: TimerEvent): void {
        switch (event.event) {
            case TimerEventNames.Play:
                this.handlePlayEvent(event)
                break;
            case TimerEventNames.Pause:
                this.handlePauseEvent(event)
                break;
            case TimerEventNames.Stop:
                this.handleStopEvent(event)
                break;
            case TimerEventNames.Reset:
                this.handleResetEvent(event)
                break;
            case TimerEventNames.UpdateDefaultInterval:
                this.handleUpdateDefaultIntervalEvent(event)
                break;
        }
    }

    handlePlayEvent(event: TimerEvent): void {
        this.countdownTimer.start(event.timestamp, event.interval)
    }

    handlePauseEvent(event: TimerEvent): void {
        this.countdownTimer.pause(event.interval)
    }

    handleStopEvent(event: TimerEvent): void {
        this.countdownTimer.stop(event.interval)
    }

    handleResetEvent(event: TimerEvent): void {
        this.countdownTimer.reset(event.timestamp, event.interval)
    }

    handleUpdateDefaultIntervalEvent(event: TimerEvent): void {
        if (!this.countdownTimer.isRunning()) {
            this.countdownTimer.reset(event.timestamp, event.interval)
        }
    }

    getLastEvent(): TimerEvent {
        return (this.state.lastEvent) ? this.state.lastEvent : {
            event: TimerEventNames.Stop,
            timestamp: 0,
            interval: 0,
        };
    }
    render() {
        return (
            <>
                <CountdownTimer setRef={(ref) => this.countdownTimer = ref} />
                <ul>
                    <li>last event type: {this.getLastEvent().event}</li>
                    <li>last event timestamp: {this.getLastEvent().timestamp}</li>
                    <li>last event interval: {this.getLastEvent().interval}</li>
                </ul>
            </>
        );
    }
}
