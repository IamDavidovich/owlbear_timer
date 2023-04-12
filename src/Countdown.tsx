import React, { Component } from 'react';

import OBR from "@owlbear-rodeo/sdk";
import CountdownControls from "./CountdownControls";
import CountdownDisplay from "./CountdownDisplay";

export default class Countdown extends Component<any, any> {
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
                <CountdownDisplay />
                { this.getPlayerRole() == 'GM' ? <CountdownControls /> : null }
            </>
        );
    }
}