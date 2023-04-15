import React, {Component} from 'react';

import OBR from "@owlbear-rodeo/sdk";
import CountdownDisplay from "./CountdownDisplay";
import {TimerEvent, TimerEventNames} from "./timerEvent";
import {getPluginId} from "./getPluginId";

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

    handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newInterval = parseInt(e.target.value)
        this.setState({interval: newInterval})

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
        if (this.state.playerRole != 'GM') {
            return <CountdownDisplay
                interval={this.state.interval}
                onTimerComplete={this.onTimerCompleteCallback}
                onTimerUpdate={this.onTimerUpdateCallback}
            />
        }

        return (
            <>
                <CountdownDisplay
                    interval={this.state.interval}
                    onTimerComplete={this.onTimerCompleteCallback}
                    onTimerUpdate={this.onTimerUpdateCallback}
                />
                <fieldset>
                    Countdown from:
                    <input
                        type="number"
                        value={this.state.interval}
                        onChange={this.handleIntervalChange}
                    />
                </ fieldset>
                <div>
                    <button
                        type="button"
                        onClick={this.handleStartClick}
                        disabled={this.state.currentState == CountdownState.Playing}
                    >
                        Start
                    </button>{' '}
                    <button
                        type="button"
                        onClick={this.handlePauseClick}
                        disabled={this.state.currentState != CountdownState.Playing}
                    >
                        Pause
                    </button>{' '}
                    <button
                        type="button"
                        onClick={this.handleStopClick}
                        disabled={this.state.currentState != CountdownState.Playing}
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
