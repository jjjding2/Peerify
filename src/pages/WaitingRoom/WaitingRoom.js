import React from 'react';

import { Redirect } from 'react-router-dom';

import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
import socket from '../../socket';
import BackButton from '../../components/BackButton/BackButton';

import './WaitingRoom.css';

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
                <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '13vh', fontSize: '3vh', fontFamily: 'Montserrat-Bold'}}>
                    Room ID: { this.state.roomID }
                </p>
                { 
                    this.state.userID == this.state.leader ?
                    <div className = 'start-button'  style = {{ position: 'fixed', right: '4vw', top: '12vh', transform: 'translate(0,50%)' }}>
                        <button className = 'start-button' onClick = { this.startGame }>
                            Start Game
                        </button>
                        <div className = 'bottom-bar' style = {{ cursor: 'pointer' }} onClick = { this.startGame }> </div>
                    </div>
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