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
        socket.on('start', leader => {
            this.setState({ readyToStart: true, leader });
        });
    }

    componentDidMount() {
        const { userID, roomID, leader } = this.props.location.state;
        this.setState({ userID, roomID, leader });
    }

    startGame = () => {
        socket.emit('startGame', this.state.roomID);
    }

    render() {
        return (
            <div>
                <BackButton />
                <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '10vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                    Room ID: { this.state.roomID }
                </p>
                { this.state.userID == this.state.leader ?
                <button className = 'start-button' style = {{ position: 'fixed', right: '4vw', top: '10vh', transform: 'translate(0,50%)' }} onClick = { this.startGame }>
                    Start Game
                </button>
                :null}
                <JoinedPlayers roomID = { this.state.roomID } />
                {
                    this.state.readyToStart?
                    <Redirect to = {{
                        pathname: '/play',
                        state: {
                            userID: this.state.userID,
                            roomID: this.state.roomID,
                            leader: this.state.leader
                        }
                    }} />
                    :null
                }
            </div>
        );
    }
}

export default WaitingRoom;