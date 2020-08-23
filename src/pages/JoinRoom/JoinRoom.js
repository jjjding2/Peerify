import React from 'react';

<<<<<<< HEAD
import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
=======
>>>>>>> 8c1b2206194559e1d2cd75cc282c4bdfe3fd6c69
import BackButton from '../../components/BackButton/BackButton';

import socket from '../../socket';

import './JoinRoom.css';

class JoinRoom extends React.Component {
    constructor() {
        super();
<<<<<<< HEAD
        this.state = {
            joinedRoom: false,
            readyToStart: false,
        }
        socket.on('start', leader => {
            localStorage.setItem('leader', leader);
            this.setState({ readyToStart: true });
        });
    }

    joinRoom = () => {
        const roomID = document.getElementById('roomID').value; //get room id
        console.log(roomID);
        socket.emit('joinRoom', localStorage.getItem('userID'), roomID); 
        socket.on('validate', () => {
            this.setState({ joinedRoom: true, roomID });
        });
=======
    }

    joinRoom = () => {
        const roomID = 'roomID'; //get room id
        socket.emit('joinRoom', roomID);
>>>>>>> 8c1b2206194559e1d2cd75cc282c4bdfe3fd6c69
    }

    render() {
        return (
            <div>
                <BackButton />
<<<<<<< HEAD
                { !this.state.joinedRoom ?
=======
>>>>>>> 8c1b2206194559e1d2cd75cc282c4bdfe3fd6c69
                <div className = 'enter-room-code'>
                    <input id='text' className = 'enter-code-box' placeholder = 'Enter Room ID' />
                    <button className = 'confirm-join-button' onClick={this.joinRoom()}> Join </button>
                </div>
<<<<<<< HEAD
                : 
                <div>
                    <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '8vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                        Room ID: { this.state.roomID }
                    </p>
                    <JoinedPlayers roomID = { this.state.roomID } />
                </div>
                }
                {
                    this.state.readyToStart?
                    <Redirect to = '/play' />
                    :null
                }
=======
>>>>>>> 8c1b2206194559e1d2cd75cc282c4bdfe3fd6c69
            </div>
        );
    }
}

export default JoinRoom;
