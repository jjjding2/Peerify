import React from 'react';

import Navbar from '../../components/Navbar/Navbar';

import socket from '../../socket';

import './JoinRoom.css';

class JoinRoom extends React.Component {
    constructor() {
        super();
    }

    joinRoom = () => {
        const roomID = 'roomID'; //get room id
        socket.emit('joinRoom', roomID); 
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className = 'enter-room-code'>
                    <input id='text' className = 'enter-code-box' placeholder = 'Enter Room ID' />
                    <button className = 'confirm-join-button' onClick={this.joinRoom()}> Join </button>
                </div>
            </div>
        );
    }
}

export default JoinRoom;
