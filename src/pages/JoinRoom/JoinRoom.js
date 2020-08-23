import React from 'react';
import { Redirect } from 'react-router-dom';

import BackButton from '../../components/BackButton/BackButton';

import socket from '../../socket';

import './JoinRoom.css';

class JoinRoom extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {
        const { userID } = this.props.location.state;
        this.setState({ userID });
    }

    joinRoom = () => {
        const roomID = document.getElementById('roomID').value; //get room id
        socket.emit('joinRoom', localStorage.getItem('userID'), roomID); 
        socket.on('validate', () => {
            this.setState({ joinedRoom: true, roomID });
        });
    }

    render() {
        return (
            <div>
                <BackButton />
                <div className = 'enter-room-code'>
                    <input id='roomID' className = 'enter-code-box' placeholder = 'Enter Room ID' />
                    <button className = 'confirm-join-button' onClick={this.joinRoom}> Join </button>
                </div>
                {
                    this.state.joinedRoom?
                    <Redirect to = {{
                        pathname: '/waiting',
                        state: {
                            userID: this.state.userID,
                            roomID: this.state.roomID,
                            leader: null,
                        }
                    }} />
                    :null
                }
            </div>
        );
    }
}

export default JoinRoom;
