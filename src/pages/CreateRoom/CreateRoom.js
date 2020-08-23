import React from 'react';
import { Redirect } from 'react-router-dom';

import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
import BackButton from '../../components/BackButton/BackButton';

import './CreateRoom.css';

import socket from '../../socket';

function trimText(str) {
    while(str.length > 0 && str[0] == ' ') str = str.substring(1);
    while(str.length > 0 && str[str.length-1] == ' ') str = str.substring(0,str.length-1);
    return str;
}

class CreateRoom extends React.Component {
    constructor() {
        super();

        this.state = {
            roomID: localStorage.getItem('roomID'),
            numRounds: -1,
        };

        this.create = this.create.bind(this);
    }

    create() {
        let owner_nick = trimText(document.getElementById('owner-nickname').value);
        let num_rounds = document.getElementById('num-rounds').value;
        if(owner_nick == "" || num_rounds == "") return;

        socket.emit('createRoom', localStorage.getItem('userID'), num_rounds);
        socket.emit('setNickname', localStorage.getItem('userID'), this.state.roomID, owner_nick);
        socket.on('sendRoomId', roomID => {
            // localStorage.setItem('roomID', roomID);
            this.setState({ roomID: roomID });
        });

        this.setState({
            numRounds: num_rounds,
        });
<<<<<<< HEAD
        socket.emit('startGame', this.state.roomID);
        localStorage.setItem('leaderID', localStorage.getItem('userID'));
=======
>>>>>>> 8c1b2206194559e1d2cd75cc282c4bdfe3fd6c69
    }

    render() {
        const roomIDText = "Room ID: " + this.state.roomID;
        return (
            <div>
                {
                    this.state.numRounds == -1?
                    <div>
                        <BackButton />
                        <div className = 'enter-room-code'>
                            <input id = 'owner-nickname' className = 'enter-code-box' placeholder = 'Nickname' />
                            <input id = 'num-rounds' className = 'enter-code-box' style = {{ top: '50%' }} type = 'number' placeholder = '# Rounds' />
                            <button className = 'confirm-join-button' style = {{ top: '100%' }} onClick = { this.create }> Create </button>
                        </div>
                    </div>
                    :
                    <Redirect to = {{
                        pathname: '/waiting',
                        state: {
                            roomID: this.state.roomID,
                            numRounds: this.state.numRounds,
                        }
                    }} />
                }
            </div>
        );
    }
}

export default CreateRoom;
