import React from 'react';
import socketIOClient from 'socket.io-client';

import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
import Navbar from '../../components/Navbar/Navbar';

import './CreateRoom.css';

const ENDPOINT = 'http://138.197.129.190:3000';
const socket = socketIOClient(ENDPOINT);

const keyLength = 7;

function genRandomNumber() {
    let low = Math.pow(10,keyLength-1), high = Math.pow(10,keyLength)-1;
    return Math.floor(Math.random()*(high-low+1)+low);
}

function genKey() {
    //temporary thing, key will actually be retrieved from backend
    return genRandomNumber();
}

class CreateRoom extends React.Component {
    constructor() {
        super();

        this.state = {
            roomID: genKey(),
            currentPlayers: [],
        };
    }

    componentDidMount() {

    }

    render() {
        const roomIDText = "Room ID: " + this.state.roomID;
        return (
            <div>
                <Navbar />
                <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '8vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                    { roomIDText }
                </p>
                <button className = 'start-button' style = {{ position: 'fixed', right: '4vw', top: '8vh', transform: 'translate(0,50%)' }}>
                    Start Game
                </button>
                <JoinedPlayers roomID = { this.state.roomID } />
            </div>
        );
    }
}

export default CreateRoom;
