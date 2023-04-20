import React, {Component} from 'react';

import OBR from "@owlbear-rodeo/sdk";
import CountdownDisplay from "./CountdownDisplay";
import {TimerEvent, TimerEventNames} from "./timerEvent";
import {getPluginId} from "./getPluginId";
import ControllerButton, {ControllerButtonType} from "./ControllerButton";
import {CountdownTimerAPI, CountdownTimerState} from "./CountdownTimer";

export default class Countdown extends Component<any, any> {
    state = {
        playerRole: undefined,
        interval: 10000, // 120000, // 2 minutes
        editHidden: true,
        warningClass: '',
        isOpen: false,
        hasEverPlayed: false,
    };

    private countdownTimer: CountdownTimerAPI;

    unsubscribePlayerChangeListener: () => void;
    unsubscribeActionOpenChangeListener: () => void;

    componentDidMount() {
        OBR.player.getRole()
            .then((role) => {
                this.setState({playerRole: role});
            })

        this.unsubscribePlayerChangeListener = OBR.player.onChange((player) => {
            this.setState({playerRole: player.role});
        })

        this.unsubscribeActionOpenChangeListener = OBR.action.onOpenChange((isOpen) => {
            if (isOpen) {
                this.hideBadge();
            }
            this.setState({isOpen: isOpen});
        })
    }

    componentWillUnmount() {
        this.unsubscribePlayerChangeListener();
        this.unsubscribeActionOpenChangeListener();
    }

    handleStartClick = (): void => {
        this.triggerEvent({
            event: TimerEventNames.Play,
            timestamp: Date.now(),
            interval: (this.getCurrentState() == CountdownTimerState.Paused) ? this.getRemainingTime() : this.state.interval,
        });
    };

    handlePauseClick = (): void => {
        this.triggerEvent({
            event: TimerEventNames.Pause,
            timestamp: Date.now(),
            interval: this.getRemainingTime(),
        });
    };

    handleStopClick = (): void => {
        this.triggerEvent({
            event: TimerEventNames.Stop,
            timestamp: Date.now(),
            interval: this.state.interval,
        });
    };

    handleResetClick = (): void => {
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
        this.setBadge();
    }

    onTimerUpdateCallback = (timeRemaining: number): void => {
        const percentTimeRemaining: number = (timeRemaining / this.state.interval) * 100;

        let warningClass: string = '';

        if (10 < percentTimeRemaining && percentTimeRemaining <= 30) {
            warningClass = 'low';
        } else if (percentTimeRemaining <= 10) {
            warningClass = 'critical';

            if (timeRemaining == 0) {
                warningClass += ' timeout';
            }
        }

        this.setState({
            warningClass: warningClass,
            hasEverPlayed: true,
        })
    }

    getCurrentState = (): CountdownTimerState => {
        return this.countdownTimer.currentState();
    }

    getRemainingTime = (): number => {
        return this.countdownTimer.remainingTime();
    }

    hideBadge = (): void => {
        OBR.action.setBadgeText(undefined);
    }

    setBadge = (): void => {
        if (this.state.isOpen || !this.state.hasEverPlayed) {
            return
        }
        const timeRemaining = this.getRemainingTime();

        const percentTimeRemaining: number = (timeRemaining / this.state.interval) * 100;

        let badgeColour: string = '';

        if (10 < percentTimeRemaining && percentTimeRemaining <= 30) {
            badgeColour = '#FF8C0099';
        } else if (percentTimeRemaining <= 10) {
            badgeColour = '#E3000099';
        } else {
            badgeColour = '#CACACACC';
        }

        const timerString = this.countdownTimer.displayTime();

        OBR.action.setBadgeBackgroundColor(badgeColour);
        OBR.action.setBadgeText(timerString);
    }

    setCountdownTimerRef = (ref: CountdownTimerAPI): void => {
        this.countdownTimer = ref;
    }

    render() {
        if (!this.state.isOpen) {
            this.setBadge();
        }

        if (this.state.playerRole != 'GM') {
            return (
                <div id={"countdown"} className={this.state.warningClass}>
                    <CountdownDisplay
                        interval={this.state.interval}
                        onTimerComplete={this.onTimerCompleteCallback}
                        onTimerUpdate={this.onTimerUpdateCallback}
                        setRef={this.setCountdownTimerRef}
                    />
                </div>
            )
        }

        const h: number = Math.floor((this.state.interval / (1000 * 60 * 60)) % 24);
        const m: number = Math.floor((this.state.interval / 1000 / 60) % 60);
        const s: number = Math.floor((this.state.interval / 1000) % 60);

        return (
                <div id={"countdown"} className={this.state.warningClass}>
                    <CountdownDisplay
                        interval={this.state.interval}
                        onTimerComplete={this.onTimerCompleteCallback}
                        onTimerUpdate={this.onTimerUpdateCallback}
                        setRef={this.setCountdownTimerRef}
                    />
                    <div id="controller">
                        <ControllerButton buttonType={ControllerButtonType.Start} onClick={this.handleStartClick} disabled={this.getCurrentState() == CountdownTimerState.Playing} />
                        <ControllerButton buttonType={ControllerButtonType.Pause} onClick={this.handlePauseClick} disabled={this.getCurrentState() != CountdownTimerState.Playing} />
                        <ControllerButton buttonType={ControllerButtonType.Stop} onClick={this.handleStopClick} disabled={this.getCurrentState() != CountdownTimerState.Playing} />
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
