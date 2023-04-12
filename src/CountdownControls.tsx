import React, { Component } from 'react';

import OBR from "@owlbear-rodeo/sdk";
import {getPluginId} from "./getPluginId";
import {TimerEvent, TimerEventNames} from "./timerEvent";

export default class CountdownControls extends Component<any, any> {

    /*
    How does this work?
    - Start with a default interval.
    - Everthing runs on events

    - Changes to interval set default interval in meta (can only be changed while stopped)
    - Play
        Event - PLAY
        Time - Timestamp when clicked
        Interval - the interval to count down

    - Stop
        Event - STOP
        Time - Timestamp when clicked
        Interval - the interval to reset to

    - Pause
        Event - PAUSE
        Time - Timestamp when clicked
        Interval - the remaining time on the timer (_shouldn't_ be needed if things are in sync)

    - Reset
        Event - RESET
        Time - Timestamp when clicked
        Interval - the interval to reset to

    - Resume is handled the same as play, just the interval is the remaining time on the timer.
    - Reset can be running or static, just need to track the current running status of the timer.

     */

    state = {
        date: Date.now() + 10000,
        defaultInterval: 10000, // 120000, // 2 minutes
        isPlaying: false,
        playerRole: undefined,
    };

    handleStartClick = (): void => {
        console.log('handleStartClick')
        this.setState({isPlaying: true})
        this.triggerEvent({
            event: TimerEventNames.Play,
            timestamp: Date.now(),
            interval: this.state.defaultInterval,
        });
    };

    handlePauseClick = (): void => {
        this.setState({isPlaying: false})
        this.triggerEvent({
            event: TimerEventNames.Pause,
            timestamp: Date.now(),
            interval: this.state.defaultInterval,
        });
    };

    handleStopClick = (): void => {
        this.setState({isPlaying: false})
        this.triggerEvent({
            event: TimerEventNames.Stop,
            timestamp: Date.now(),
            interval: this.state.defaultInterval,
        });
    };

    handleResetClick = (): void => {
        this.triggerEvent({
            event: TimerEventNames.Reset,
            timestamp: Date.now(),
            interval: this.state.defaultInterval,
        });
    };

    triggerEvent = (event: TimerEvent): void => {
        console.log('triggerEvent', event)

        OBR.scene.setMetadata({
            [getPluginId('event')]: event,
        })
    }

    render() {
        return (
            <>
                <div>
                    <button
                        type="button"
                        onClick={this.handleStartClick}
                        disabled={this.state.isPlaying}
                    >
                        Start
                    </button>{' '}
                    <button
                        type="button"
                        onClick={this.handlePauseClick}
                        disabled={!this.state.isPlaying}
                    >
                        Pause
                    </button>{' '}
                    <button
                        type="button"
                        onClick={this.handleStopClick}
                        disabled={!this.state.isPlaying}
                    >
                        Stop
                    </button>{' '}
                    <button type="button" onClick={this.handleResetClick}>
                        Reset
                    </button>
                </div>
            </>
        );
    }
}
