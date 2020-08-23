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
            roomID: 0,
        };

        socket.on('joinStatus', result => {
            if(result != "FAILED"){
                localStorage.setItem('roomID', result);
                this.setState({
                    roomID: result,
                })
            }
            console.log(result);
        });

        this.joinRoom = this.joinRoom.bind(this);
    }

    componentDidMount() {
        const { userID } = this.props.location.state;
        this.setState({ userID });
    }

    joinRoom() {
        let roomID = trimText(document.getElementById('room-code').value);
        let nickname = trimText(document.getElementById('nickname').value);
        if(nickname == "") return;
        console.log(nickname);
        socket.emit('setNickname', localStorage.getItem('userID'), roomID, nickname);
        socket.emit('joinRoom', localStorage.getItem('userID'), roomID);
    }

    render() {
        return (
            <div>
                <BackButton />
                <div className = 'enter-room-code'>
                    <input id = 'room-code' className = 'enter-code-box' placeholder = 'Enter Room ID' />
                    <input id = 'nickname' className = 'enter-code-box' style = {{ top: '50%' }} placeholder = 'Nickname' />
                    <button className = 'confirm-join-button' style = {{ top: '100%' }} onClick = { this.joinRoom }> Create </button>
                </div>
                {
                    this.state.roomID != 0?
                    <Redirect to = {{
                        pathname: '/waiting',
                        state: {
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
