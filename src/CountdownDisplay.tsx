import React, {Component} from 'react';

import OBR from "@owlbear-rodeo/sdk";
import {getPluginId} from "./getPluginId";
import {TimerEvent, TimerEventNames} from "./timerEvent";
import CountdownTimer, {CountdownTimerAPI} from "./CountdownTimer";

interface CountdownDisplayProps {
    interval: number;
    onTimerUpdate: (timeRemaining: number) => void;
    onTimerComplete: () => void;
}
export default class CountdownDisplay extends Component<CountdownDisplayProps, any> {
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
            console.log('metadata changed', metadata);
            console.log('last event', this.state.lastEvent);

            let eventData = metadata[getPluginId('event')];
            if (!eventData) {
                return;
            }

            let lastEvent: TimerEvent = {
                event: eventData.event as TimerEventNames,
                timestamp: eventData.timestamp as number,
                interval: eventData.interval as number,
            }

            if (!this.state.lastEvent) {
                this.setState({lastEvent: lastEvent});
            } else if (!this.alreadyReceived(lastEvent)) {
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
        this.countdownTimer.pause(event.timestamp)
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

    render() {
        return (
            <>
                <CountdownTimer
                    setRef={(ref) => this.countdownTimer = ref}
                    interval={this.props.interval}
                    onTimerComplete={this.props.onTimerComplete}
                    onTimerUpdate={this.props.onTimerUpdate}
                />
            </>
        );
    }
}
