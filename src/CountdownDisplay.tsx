import React, {Component} from 'react';

import OBR from "@owlbear-rodeo/sdk";
import {getPluginId} from "./getPluginId";
import {TimerEvent, TimerEventNames} from "./timerEvent";
import CountdownTimer, {CountdownTimerAPI, CountdownTimerState} from "./CountdownTimer";

interface CountdownDisplayProps {
    interval: number;
    onTimerUpdate: (timeRemaining: number) => void;
    onTimerComplete: () => void;
    setRef: (ref: CountdownTimerAPI) => void;
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
        this.unsubscribeMetadataListener = OBR.scene.onMetadataChange((metadata) => {
            const lastEvent = metadata[getPluginId('event')] as TimerEvent;
            if (!lastEvent) {
                return;
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
        if (this.countdownTimer.currentState() == CountdownTimerState.Stopped) {
            this.countdownTimer.reset(event.timestamp, event.interval)
        }
    }

    setCountdownTimerRef(ref: CountdownTimerAPI): void {
        this.countdownTimer = ref;
        // TODO: This should actually create a different interface that only exposes externally appropriate methods
        // E.g. start/stop/etc. shouldn't be available beyond this point, they have to be triggered by metadata
        this.props.setRef(ref);
    }

    render() {
        return (
            <>
                <CountdownTimer
                    setRef={this.setCountdownTimerRef.bind(this)}
                    interval={this.props.interval}
                    onTimerComplete={this.props.onTimerComplete}
                    onTimerUpdate={this.props.onTimerUpdate}
                />
            </>
        );
    }
}
