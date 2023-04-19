import React, {Component} from 'react';

interface CountdownTimerProps {
    interval: number;
    setRef: (ref: CountdownTimerAPI) => void;
    onTimerUpdate: (timeRemaining: number) => void;
    onTimerComplete: () => void;
}

export interface CountdownTimerAPI {
    start: (startTimestamp: number, interval: number) => void;
    stop: (interval: number) => void;
    pause: (stopTimestamp: number) => void;
    reset: (startTimestamp: number, interval: number) => void;
    getRemainingTime: () => number;
    isRunning: () => boolean;
}

export default class CountdownTimer extends Component<CountdownTimerProps, any> {
    state = {
        startTime: Date.now(),
        interval: this.props.interval,
        timeRemaining: 10000,
    }

    private timeoutReference: number | null = null

    componentDidMount() {
        this.props.setRef(this.getApi());
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer(): void {
        if (this.timeoutReference === null) {
            this.timeoutReference = setInterval(() => this.tick(), 1000);
        }
    }

    stopTimer(): void {
        if (this.timeoutReference !== null) {
            clearInterval(this.timeoutReference);
            this.timeoutReference = null;
        }
    }

    tick(): void {
        const timeLeft = this.state.startTime + this.state.interval - Date.now();

        // Round to the nearest thousand (I.e. second)
        const total = Math.round(Math.max(0, timeLeft) / 1000) * 1000;

        this.setState({ timeRemaining: total });
        this.props.onTimerUpdate(total)

        if (total <= 0) {
            this.stopTimer();
            this.props.onTimerComplete();
        }
    }

    getApi(): CountdownTimerAPI {
        return {
            start: this.start.bind(this),
            stop: this.stop.bind(this),
            pause: this.pause.bind(this),
            reset: this.reset.bind(this),
            getRemainingTime: this.getRemainingTime.bind(this),
            isRunning: this.isRunning.bind(this),
        }
    }

    start(startTimestamp: number, interval: number): void {
        this.setState({
            startTime: startTimestamp,
            interval: interval,
            timeRemaining: interval,
        })
        this.props.onTimerUpdate(interval)

        this.startTimer();
    }

    stop(interval: number): void {
        this.setState({
            startTime: Date.now(),
            interval: interval,
            timeRemaining: interval,
        })
        this.props.onTimerUpdate(interval)

        this.stopTimer();
    }

    pause(pauseTimestamp: number): void {
        this.stopTimer();
    }

    reset(startTimestamp: number, interval: number): void {
        this.setState({
            startTime: startTimestamp,
            interval: interval,
            timeRemaining: interval,
        })

        this.props.onTimerUpdate(interval)

        if (this.isRunning()) {
            // If we're running, reset the timer to ensure the first second is a whole second.
            this.stopTimer();
            this.startTimer();
        }
    }

    getRemainingTime(): number {
        return this.state.timeRemaining;
    }

    isRunning(): boolean {
        return this.timeoutReference !== null;
    }

    render() {
        const h: number = Math.floor((this.state.timeRemaining / (1000 * 60 * 60)) % 24);
        const m: number = Math.floor((this.state.timeRemaining / 1000 / 60) % 60);
        const s: number = Math.floor((this.state.timeRemaining / 1000) % 60);

        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        const ss = s.toString().padStart(2, '0');

        const timerString = (h == 0 ? '' : hh + ':') + mm + ':' + ss;
        return (
            <>
                <div id="countdown_timer">{timerString}</div>
            </>
        );
    }
}
