import React from 'react';

import Navbar from '../../components/Navbar/Navbar';

import './JoinRoom.css';

class JoinRoom extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className = 'enter-room-code'>
                    <input className = 'enter-code-box' placeholder = 'Enter Room ID' />
                    <button className = 'confirm-join-button'> Join </button>
                </div>
            </div>
        );
    }
}

export default JoinRoom;
