import React, { Component } from 'react';

import Countdown, { CountdownApi } from 'react-countdown';
import OBR from "@owlbear-rodeo/sdk";
import CountdownControls from "./CountdownControls";
import CountdownTimer from "./CountdownTimer";

export default class CountdownUi extends Component<any, any> {
    state = {
        playerRole: undefined,
    };

    componentDidMount() {
        this.fetchPlayerRole();
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
                {/*<CountdownTimer />*/}
                { this.getPlayerRole() == 'GM' ? <CountdownControls /> : null }
            </>
        );
    }
}
