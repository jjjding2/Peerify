import React from 'react';

import socket from '../../socket';

import './JoinedPlayers.css';

class JoinedPlayers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomID: props.roomID,
            currentPlayers: [],
        };

        socket.on('playerJoined', userNick => {
            let tt = this.state.currentPlayers;
            tt.push(
                <h1> { userNick } </h1>
            );
            this.setState({
                currentPlayers: tt,
            })
        });
    }

    render() {
        return (
            <div className = 'parent-div'>
                { this.state.currentPlayers }
            </div>
        );
    }
}

export default JoinedPlayers;
