import React from 'react';

import './JoinedPlayers.css';

class JoinedPlayers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomID: props.roomID,
        };
    }

    render() {
        return (
            <div className = 'parent-div'>
            </div>
        );
    }
}

export default JoinedPlayers;
