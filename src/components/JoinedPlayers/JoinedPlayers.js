import React from 'react';

import './JoinedPlayers.css';
import socket from '../../socket';

class JoinedPlayers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomID: props.roomID,
            userList: []
        };
        
        socket.on('updateList', userList => {
            this.setState({ userList });
        });
        console.log(this.state.userList);
    }

    render() {
        return (
            <div className = 'parent-div'>
                { this.state.userList.map( (user) => {
                    return <h3> { user } </h3>;
                })}
            </div>
        );
    }
}

export default JoinedPlayers;
