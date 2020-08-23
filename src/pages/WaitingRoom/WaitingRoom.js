import React from 'react';

import { Redirect } from 'react-router-dom';

import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
import socket from '../../socket';
import BackButton from '../../components/BackButton/BackButton';
import { kMaxLength } from 'buffer';

class WaitingRoom extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            roomID: props.location.state.roomID,

            readyToStart: false,
        }

        this.startGame = this.startGame.bind(this);
    }

    startGame() {
        localStorage.setItem("roomID", this.state.roomID);
        global.clearLocalStorage();
        socket.emit('startGame', this.state.roomID);
        socket.emit('promptStage', this.state.roomID);
        this.setState({
            readyToStart: true,
        });
    }

    render() {
        return (
            <div>
                <BackButton />
                <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '10vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                    Room ID: { this.state.roomID }
                </p>
                <button className = 'start-button' style = {{ position: 'fixed', right: '4vw', top: '10vh', transform: 'translate(0,50%)' }} onClick = { this.startGame }>
                    Start Game
                </button>
                <JoinedPlayers roomID = { this.state.roomID } />
                {
                    this.state.readyToStart?
                    <Redirect to = '/play' />
                    :null
                }
            </div>
        );
    }
}

export default WaitingRoom;