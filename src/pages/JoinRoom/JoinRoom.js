import React from 'react';
import { Redirect } from 'react-router-dom';

<<<<<<< HEAD
import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
import Navbar from '../../components/Navbar/Navbar';
=======
import BackButton from '../../components/BackButton/BackButton';
>>>>>>> f1916f63d27c14c8953f921a103dbd9774c35dfb

import socket from '../../socket';

import './JoinRoom.css';

class JoinRoom extends React.Component {
    constructor() {
        super();
        this.state = {
            joinedRoom: false,
            readyToStart: false
        }
        socket.on('start', leader => {
            this.setState({ readyToStart: true });
        });
    }

    joinRoom = () => {
        const roomID = document.getElementById('roomID').value; //get room id
        console.log(roomID);
        socket.emit('joinRoom', localStorage.getItem('userID'), roomID); 
        socket.on('validated', () => {
            this.setState({ joinedRoom: true, roomID });
        });
    }

    render() {
        return (
            <div>
<<<<<<< HEAD
                <Navbar />
                { !this.state.joinedRoom ?
=======
                <BackButton />
>>>>>>> f1916f63d27c14c8953f921a103dbd9774c35dfb
                <div className = 'enter-room-code'>
                    <input id='roomID' className = 'enter-code-box' placeholder = 'Enter Room ID' />
                    <button className = 'confirm-join-button' onClick={this.joinRoom}> Join </button>
                </div>
                : 
                <div>
                    <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '8vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                        Room ID: { this.state.roomID }
                    </p>
                    <JoinedPlayers roomID = { this.state.roomID } />
                </div>}
                {
                    this.state.readyToStart?
                    <Redirect to = '/play' />
                    :null
                }
            </div>
        );
    }
}

export default JoinRoom;
