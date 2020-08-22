import React from 'react';
import socketIOClient from 'socket.io-client';

import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';
import Navbar from '../../components/Navbar/Navbar';

import './CreateRoom.css';

import socket from '../../socket';

function trimText(str) {
    while(str.length > 0 && str[0] == ' ') str = str.substring(1);
    while(str.length > 0 && str[str.length-1] == ' ') str = str.substring(0,str.length-1);
    return str;
}

class CreateRoom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numRounds: -1,
            currentPlayers: [],
        };

        this.create = this.create.bind(this);
    }

    create() {
        let owner_nick = trimText(document.getElementById('owner-nickname').value);
        let num_rounds = document.getElementById('num-rounds').value;
        if(owner_nick == "" || num_rounds == "") return;

        socket.emit('createRoom', this.props.id);
        socket.on('sendRoomId', roomID => {
            this.setState({ roomID });
        });

        let curr = this.state.currentPlayers;
        curr.push(owner_nick);
        this.setState({
            numRounds: num_rounds,
            currentPlayers: curr,
        });
    }

    render() {
        const roomIDText = "Room ID: " + this.state.roomID;
        return (
            <div>
                <Navbar />
                {
                    this.state.numRounds == -1?
                    <div className = 'enter-room-code'>
                        <input id = 'owner-nickname' className = 'enter-code-box' placeholder = 'Nickname' />
                        <input id = 'num-rounds' className = 'enter-code-box' style = {{ top: '50%' }} type = 'number' placeholder = '# Rounds' />
                        <button className = 'confirm-join-button' style = {{ top: '100%' }} onClick = { this.create }> Create </button>
                    </div>
                    :
                    <div>
                        <p style = {{ height: '6vh', position: 'fixed', left: '4vw', top: '8vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                            Room ID: { this.state.roomID }
                        </p>
                        <button className = 'start-button' style = {{ position: 'fixed', right: '4vw', top: '8vh', transform: 'translate(0,50%)' }}>
                            Start Game
                        </button>
                        <JoinedPlayers roomID = { this.state.roomID } />
                    </div>
                }
            </div>
        );
    }
}

export default CreateRoom;
