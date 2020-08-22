import React from 'react';

import JoinedPlayers from '../../components/JoinedPlayers/JoinedPlayers';

const keyLength = 7;

function genRandomNumber() {
    let low = Math.pow(10,keyLength-1), high = Math.pow(10,keyLength)-1;
    return Math.floor(Math.random()*(high-low+1)+low);
}

function genKey() {
    //temporary thing, key will actually be retrieved from backend
    return genRandomNumber();
}

class CreateRoom extends React.Component {
    constructor() {
        super();

        this.state = {
            roomID: genKey(),
        };
    }

    render() {
        const roomIDText = "Room ID: " + this.state.roomID;
        return (
            <div>
                <p style = {{ position: 'absolute', left: '4vw', top: '15vh', fontSize: '3vh', fontFamily: 'OpenSans-Light' }}>
                    { roomIDText }
                </p>
                <JoinedPlayers roomID = { this.state.roomID } />
            </div>
        );
    }
}

export default CreateRoom;
