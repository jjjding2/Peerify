import React from 'react';
import { Redirect } from 'react-router-dom';

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
            roomID: 0,
        };

        this.create = this.create.bind(this);
    }

    componentDidMount() {
        const { userID } = this.props.location.state;
        this.setState({ userID });
    }

    create() {
        let owner_nick = trimText(document.getElementById('owner-nickname').value);
        let num_rounds = document.getElementById('num-rounds').value;
        if(owner_nick == "" || num_rounds == "") return;

        socket.emit('createRoom', localStorage.getItem('userID'), num_rounds);
        socket.on('sendRoomId', pp => {
            // localStorage.setItem('roomID', roomID);
            localStorage.setItem('roomID', pp);
            socket.emit('setNickname', localStorage.getItem('userID'), pp, owner_nick);
            this.setState({
                roomID: pp
            });
            console.log(pp);
        });
    }

    render() {
        return (
            <div>
                {
                    this.state.roomID == 0?
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
                            userID: this.state.userID,
                            roomID: this.state.roomID,
                        }
                    }} />
                }
            </div>
        );
    }
}

export default CreateRoom;
