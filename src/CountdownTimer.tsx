import React, {Component} from 'react';

import OBR from "@owlbear-rodeo/sdk";
import {getPluginId} from "./getPluginId";
import {TimerEvent, TimerEventNames} from "./timerEvent";

export default class CountdownTimer extends Component<any, any> {
    state:{
        isPlaying: boolean;
        lastEvent: TimerEvent | null;
    } = {
        isPlaying: false,
        lastEvent: null,
    };

    componentDidMount() {
        // Register listener
        OBR.scene.onMetadataChange((metadata) => {
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
        }
    }

    handlePlayEvent(event: TimerEvent): void {
        this.setState({isPlaying: true})
        console.log('handlePlayEvent', event)
    }

    handlePauseEvent(event: TimerEvent): void {
        this.setState({isPlaying: false})
        console.log('handlePauseEvent', event)
    }

    handleStopEvent(event: TimerEvent): void {
        this.setState({isPlaying: false})
        console.log('handleStopEvent', event)
    }

    handleResetEvent(event: TimerEvent): void {
        console.log('handleResetEvent', event)
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
                <ul>
                    <li>isPlaying: {this.state.isPlaying.toString()}</li>
                    <li>last event type: {this.getLastEvent().event}</li>
                    <li>last event timestamp: {this.getLastEvent().timestamp}</li>
                    <li>last event interval: {this.getLastEvent().interval}</li>
                </ul>
            </>
        );
    }
}
