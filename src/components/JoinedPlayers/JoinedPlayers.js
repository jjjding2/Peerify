import React from 'react';

import socket from '../../socket';

import './JoinedPlayers.css';
import { isFulfilled } from 'q';

class JoinedPlayers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomID: this.props.roomID,
            currentPlayers: [],
        };

        console.log("ROOM ID"+this.props.roomID);
        socket.emit('getRoomList', this.props.roomID);
        socket.on('roomList', data => {
            let nick_list = [];
            for(let key in data)
                nick_list.push(data[key]);
            this.state.currentPlayers = nick_list;
            console.log("DAB");
            console.log(data);
        });

        socket.on('playerJoined', userNick => {
            let tt = this.state.currentPlayers;
            tt.push(userNick);
            this.setState({
                currentPlayers: tt,
            })
            console.log(userNick + " has joined");
        });
    }

    render() {
        let players = [], per_row = 5, gap = 1, each_wid = (100-(per_row+1)*gap)/per_row;
        console.log(each_wid);
        let top_value = 3, left_value = 0;
        for(let name in this.state.currentPlayers){
            if(left_value+gap+each_wid > 100){
                top_value += 17;
                left_value = gap;
            }else left_value += gap;
            players.push(
                <div className = 'user-entry' style = {{ width: each_wid + '%', top: top_value + '%', left: left_value + '%' }}>
                    <h1> { name } </h1>
                </div>
            );
            left_value += each_wid;
        }
        console.log("OK")
        console.log(this.state.currentPlayers);

        return (
            <div className = 'parent-div'>
                { players }
            </div>
        );
    }
}

export default JoinedPlayers;
