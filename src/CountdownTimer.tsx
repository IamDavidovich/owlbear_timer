import React, { Component } from 'react';

import Countdown, { CountdownApi } from 'react-countdown';
import OBR from "@owlbear-rodeo/sdk";

export default class CountdownTimer extends Component<any, any> {
    countdownApi: CountdownApi | null = null;
    state = {
        date: Date.now() + 10000,
        defaultInterval: 10000, // 120000, // 2 minutes
        isPlaying: false,
        playerRole: undefined,
    };

    componentDidMount() {
        this.fetchPlayerRole();
    }

    handleStartClick = (): void => {
        this.setState({isPlaying: true})
        this.countdownApi && this.countdownApi.start();
    };

    handlePauseClick = (): void => {
        this.setState({isPlaying: false})
        this.countdownApi && this.countdownApi.pause();
    };

    handleStopClick = (): void => {
        this.setState({isPlaying: false})
        this.countdownApi && this.countdownApi.stop();
    };

    handleResetClick = (): void => {
        // Using `stop` here works better because it resets the timer, but
        // also triggers the onStop callback where we can continue playing
        // if we want to.
        // This works because in handleUpdate we check look at the current
        // isPlaying state and start the timer if it's true.
        this.countdownApi && this.countdownApi.stop();
    };

    handleUpdate = (): void => {
        console.log("isPlaying in update ", this.state.isPlaying.toString())
        if (this.state.isPlaying && (this.isStopped() || this.isPaused()) && !this.isCompleted()) {
            this.countdownApi && this.countdownApi.start();
        }
        this.forceUpdate();
    };

    setRef = (countdown: Countdown | null): void => {
        if (countdown) {
            this.countdownApi = countdown.getApi();
        }
    };

    isPlaying(): boolean {
        return !(this.isPaused() || this.isStopped() || this.isCompleted());
    }

    isPaused(): boolean {
        return !!(this.countdownApi && this.countdownApi.isPaused());
    }

    isCompleted(): boolean {
        return !!(this.countdownApi && this.countdownApi.isCompleted());
    }

    isStopped(): boolean {
        return !!(this.countdownApi && this.countdownApi.isStopped());
    }

    fetchPlayerRole(): void {
        OBR.player.getRole()
            .then((role) => { this.setState({playerRole: role});
        })
    }

    getPlayerRole(): string | undefined {
        return this.state.playerRole;
    }

    render() {
        return (
            <>
                <Countdown
                    key={this.state.date}
                    ref={this.setRef}
                    date={this.state.date}
                    onMount={this.handleUpdate}
                    onStart={this.handleUpdate}
                    onPause={this.handleUpdate}
                    onStop={this.handleUpdate}
                    onComplete={this.handleUpdate}
                    autoStart={false}
                />
                <div>
                    <button
                        type="button"
                        onClick={this.handleStartClick}
                        disabled={!(this.isPaused() || this.isStopped()) || this.isCompleted()}
                    >
                        Start
                    </button>{' '}
                    <button
                        type="button"
                        onClick={this.handlePauseClick}
                        disabled={this.isPaused() || this.isStopped() || this.isCompleted()}
                    >
                        Pause
                    </button>{' '}
                    <button
                        type="button"
                        onClick={this.handleStopClick}
                        disabled={this.isStopped() || this.isCompleted()}
                    >
                        Stop
                    </button>{' '}
                    <button type="button" onClick={this.handleResetClick}>
                        Reset
                    </button>
                </div>
                <ul>
                    <li>Is this the GM?: {this.getPlayerRole()}</li>
                    <li>isPlaying: {this.isPlaying().toString()}</li>
                    <li>isPaused: {this.isPaused().toString()}</li>
                    <li>isStopped: {this.isStopped().toString()}</li>
                    <li>isCompleted: {this.isCompleted().toString()}</li>
                </ul>
            </>
        );
    }
}
