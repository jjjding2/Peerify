import React from 'react';
import { Redirect } from 'react-router-dom';

import BackButton from '../../components/BackButton/BackButton';

import socket from '../../socket';

import './JoinRoom.css';

function trimText(str) {
    while(str.length > 0 && str[0] == ' ') str = str.substring(0);
    while(str.length > 0 && str[str.length-1] == ' ') str = str.substring(1,str.length-1);
    return str;
}

class JoinRoom extends React.Component {
    constructor() {
        super();

        this.state = {
            userID: 0,
            roomID: 0,
        };

        socket.on('joinStatus', result => {
            if(result != "FAILED"){
                this.setState({
                    roomID: result,
                });
            }
            console.log(result);
        });
        socket.emit('createId');
        socket.on('getId', id => {
            this.state.userID = id;
        });

        this.joinRoom = this.joinRoom.bind(this);
    }

    joinRoom() {
        let roomID = trimText(document.getElementById('room-code').value);
        let nickname = trimText(document.getElementById('nickname').value);
        if(nickname == "") return;
        socket.emit('setNickname', this.state.userID, roomID, nickname);
        socket.emit('joinRoom', this.state.userID, roomID);
    }

    render() {
        return (
            <div>
                <BackButton />
                <div className = 'enter-room-code'>
                    <input autoComplete = 'off' id = 'room-code' className = 'enter-code-box' placeholder = 'Enter Room ID' />
                    <input autoComplete = 'off' id = 'nickname' className = 'enter-code-box' style = {{ top: '50%' }} placeholder = 'Nickname' />
                    <button className = 'confirm-join-button' style = {{ top: '100%' }} onClick = { this.joinRoom }> Join </button>
                </div>
                {
                    this.state.roomID != 0?
                    <Redirect to = {{
                        pathname: '/waiting',
                        state: {
                            userID: this.state.userID,
                            roomID: this.state.roomID,
                        }
                    }} />
                    :null
                }
            </div>
        );
    }
}

export default JoinRoom;
