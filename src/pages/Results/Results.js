import React from 'react';

import BackButton from '../../components/BackButton/BackButton';
import socket from '../../socket';

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomID: props.location.state.roomID,
        }

        socket.emit('getResults', this.state.roomID);
        socket.on('results', (first, second, third) => {
            this.setState({ first, second, third });
        });
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100vh' }}>
                <BackButton />
                <div style={{ width: '100%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <div style={{ width: '150px', height: '200px', backgroundColor: '#DEDEDE', textAlign: 'center' }}>
                        <h3 style={{ marginTop: '-50px'}}>{ this.state.second }</h3>
                    </div>
                    <div style={{ width: '150px', height: '300px', backgroundColor: '#F7D802', margin: '0 50px', textAlign: 'center' }}>
                        <h3 style={{ marginTop: '-50px'}}>{ this.state.first }</h3>
                    </div>
                    <div style={{ width: '150px', height: '100px', backgroundColor: '#C77B30', textAlign: 'center' }}>
                        <h3 style={{ marginTop: '-50px'}}>{ this.state.third }</h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default Results;