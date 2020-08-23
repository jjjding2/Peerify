import React from 'react';

import { Redirect } from 'react-router-dom';

import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
import socket from '../../socket';
import BackButton from '../../components/BackButton/BackButton';
import { kMaxLength } from 'buffer';

class WaitingRoom extends React.Component {
    constructor(props) {
        super(props);

        // console.log(props);

        this.state = {
            userID: props.location.state.userID,
            roomID: props.location.state.roomID,
            leader: props.location.state.leader,

            readyToStart: false,
        };

        socket.on('start', leader => {
            if(leader != "FAILED"){
                this.setState({
                    readyToStart: true,
                    leader
                });
            }
        });
    }

    startGame = () => {
        console.log("START");
        socket.emit('startGame', this.state.roomID);
    }

    render() {
        if(this.state.userID == undefined) return <Redirect to = '/' />
        return (
            <div>
                <BackButton />
                <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '10vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                    Room ID: { this.state.roomID }
                </p>
                { 
                    this.state.userID == this.state.leader ?
                    <button className = 'start-button' style = {{ position: 'fixed', right: '4vw', top: '10vh', transform: 'translate(0,50%)' }} onClick = { this.startGame }>
                        Start Game
                    </button>
                    :null
                }
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