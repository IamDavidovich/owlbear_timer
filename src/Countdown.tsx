import React, {Component} from 'react';

import OBR from "@owlbear-rodeo/sdk";
import CountdownDisplay from "./CountdownDisplay";
import {TimerEvent, TimerEventNames} from "./timerEvent";
import {getPluginId} from "./getPluginId";
import ControllerButton, {ControllerButtonType} from "./ControllerButton";

enum CountdownState {
    Stopped = 'stopped',
    Playing = 'playing',
    Paused = 'paused',
}

export default class Countdown extends Component<any, any> {
    state = {
        playerRole: undefined,
        interval: 10000, // 120000, // 2 minutes
        timeRemaining: 10000,
        isPlaying: false,
        currentState: 'stopped',
        editHidden: true,
    };

    componentDidMount() {
        OBR.player.getRole()
            .then((role) => {
                this.setState({playerRole: role});
            })
    }

    handleStartClick = (): void => {
        this.setState({currentState: CountdownState.Playing})
        this.triggerEvent({
            event: TimerEventNames.Play,
            timestamp: Date.now(),
            interval: (this.state.currentState == CountdownState.Paused) ? this.state.timeRemaining : this.state.interval,
        });
    };

    handlePauseClick = (): void => {
        this.setState({currentState: CountdownState.Paused})
        this.triggerEvent({
            event: TimerEventNames.Pause,
            timestamp: Date.now(),
            interval: this.state.timeRemaining,
        });
    };

    handleStopClick = (): void => {
        this.setState({currentState: CountdownState.Stopped, timeRemaining: this.state.interval})
        this.triggerEvent({
            event: TimerEventNames.Stop,
            timestamp: Date.now(),
            interval: this.state.interval,
        });
    };

    handleResetClick = (): void => {
        this.setState({timeRemaining: this.state.interval})
        this.triggerEvent({
            event: TimerEventNames.Reset,
            timestamp: Date.now(),
            interval: this.state.interval,
        });
    };

    handleEditClick = (): void => {
        this.setState({editHidden: false})
    }

    handleTimerIntervalSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const h = parseInt(e.target.elements.h.value)
        const m = parseInt(e.target.elements.m.value)
        const s = parseInt(e.target.elements.s.value)

        const newInterval = (h * 60 * 60 * 1000) + (m * 60 * 1000) + (s * 1000)
        this.setState({interval: newInterval, editHidden: true})

        this.triggerEvent({
            event: TimerEventNames.UpdateDefaultInterval,
            timestamp: Date.now(),
            interval: newInterval,
        });
    }

    triggerEvent = (event: TimerEvent): void => {
        OBR.scene.setMetadata({
            [getPluginId('event')]: event,
        })
    }

    onTimerCompleteCallback = (): void => {
        this.setState({currentState: CountdownState.Stopped})
        console.log('onTimerCompleteCallback')
    }

    onTimerUpdateCallback = (timeRemaining: number): void => {
        this.setState({timeRemaining: timeRemaining})
        console.log('onTimerUpdateCallback', timeRemaining)
    }

    render() {
        const percentTimeRemaining: number = (this.state.timeRemaining / this.state.interval) * 100;
        let warningClass: string = '';
        if (10 < percentTimeRemaining && percentTimeRemaining <= 30) {
            warningClass = 'low';
        } else if (percentTimeRemaining <= 10) {
            warningClass = 'critical';
            if (this.state.timeRemaining == 0) {
                warningClass += ' timeout';
            }
        }

        if (this.state.playerRole != 'GM') {
            return (
                <div id={"countdown"} className={warningClass}>
                    <CountdownDisplay
                        interval={this.state.interval}
                        onTimerComplete={this.onTimerCompleteCallback}
                        onTimerUpdate={this.onTimerUpdateCallback}
                    />
                </div>
            )
        }

        const h: number = Math.floor((this.state.interval / (1000 * 60 * 60)) % 24);
        const m: number = Math.floor((this.state.interval / 1000 / 60) % 60);
        const s: number = Math.floor((this.state.interval / 1000) % 60);


        return (
                <div id={"countdown"} className={warningClass}>
                    <CountdownDisplay
                        interval={this.state.interval}
                        onTimerComplete={this.onTimerCompleteCallback}
                        onTimerUpdate={this.onTimerUpdateCallback}
                    />
                    <div id="controller">
                        <ControllerButton buttonType={ControllerButtonType.Start} onClick={this.handleStartClick} disabled={this.state.currentState == CountdownState.Playing} />
                        <ControllerButton buttonType={ControllerButtonType.Pause} onClick={this.handlePauseClick} disabled={this.state.currentState != CountdownState.Playing} />
                        <ControllerButton buttonType={ControllerButtonType.Stop} onClick={this.handleStopClick} disabled={this.state.currentState != CountdownState.Playing} />
                        <ControllerButton buttonType={ControllerButtonType.Reset} onClick={this.handleResetClick} />
                        <ControllerButton buttonType={ControllerButtonType.Edit} onClick={this.handleEditClick} disabled={false} />
                    </div>

                    <div id="set-timer" className={this.state.editHidden ? 'hidden' : ''}>
                        <form id="timer-interval-form" onSubmit={this.handleTimerIntervalSubmit}>
                            <input
                                name="h"
                                type="number"
                                defaultValue={h}
                            />
                            <span className="divider">:</span>
                            <input
                                name="m"
                                type="number"
                                defaultValue={m}
                            />
                            <span className="divider">:</span>
                            <input
                                name="s"
                                type="number"
                                defaultValue={s}
                            />
                            <button
                                className={`controller_button accept`}
                                type="submit"
                            >
                                <svg fill="currentColor" width="800px" height="800px" viewBox="-4 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <title>Accept</title>
                                    <path d="M19.375 5.063l-9.5 13.625-6.563-4.875-3.313 4.594 11.188 8.531 12.813-18.375z"></path>
                                </svg>
                            </button>
                        </ form>
                    </div>
                </div>
        );
    }
}
