import React, {Component} from 'react';

interface CountdownTimerProps {
    setRef: (ref: CountdownTimerAPI) => void;
}

export interface CountdownTimerAPI {
    start: (startTimestamp: number, interval: number) => void;
    stop: (interval: number) => void;
    pause: (interval: number) => void;
    reset: (startTimestamp: number, interval: number) => void;
    getRemainingTime: () => number;
}

export default class CountdownTimer extends Component<CountdownTimerProps, any> {
    state = {
        startTime: Date.now(),
        interval: 10000,
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
    }

    getApi(): CountdownTimerAPI {
        return {
            start: this.start.bind(this),
            stop: this.stop.bind(this),
            pause: this.pause.bind(this),
            reset: this.reset.bind(this),
            getRemainingTime: this.getRemainingTime.bind(this),
        }
    }

    start(startTimestamp: number, interval: number): void {
        console.log('start', startTimestamp, interval)

        this.setState({
            startTime: startTimestamp,
            interval: interval,
            timeRemaining: interval,
        })

        this.startTimer();
    }

    stop(interval: number): void {
        console.log('stop', interval)

        this.setState({
            startTime: Date.now(),
            interval: interval,
            timeRemaining: interval,
        })

        this.stopTimer();
    }

    pause(interval: number): void {
        console.log('pause', interval)

        this.setState({
            startTime: Date.now(),
            interval: interval,
            timeRemaining: interval,
        })

        this.stopTimer();
    }

    reset(startTimestamp: number, interval: number): void {
        console.log('reset', startTimestamp, interval)

        this.setState({
            startTime: startTimestamp,
            interval: interval,
            timeRemaining: interval,
        })

        // TODO wrap this check in a more descriptive function
        if (this.timeoutReference !== null) {
            // If we're running, reset the timer to ensure the first second is a whole second.
            this.stopTimer();
            this.startTimer();
        }
    }

    getRemainingTime(): number {
        return this.state.timeRemaining;
    }

    render() {
        const h: number = Math.floor((this.state.timeRemaining / (1000 * 60 * 60)) % 24);
        const m: number = Math.floor((this.state.timeRemaining / 1000 / 60) % 60);
        const s: number = Math.floor((this.state.timeRemaining / 1000) % 60);

        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        const ss = s.toString().padStart(2, '0');

        return (
            <>
                <h2>{hh}:{mm}:{ss}</h2>
            </>
        );
    }
}
