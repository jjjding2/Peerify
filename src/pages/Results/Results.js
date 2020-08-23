import React from 'react';

import BackButton from '../../components/BackButton/BackButton';
import socket from '../../socket';

import './Results.css';

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomID: props.location.state.roomID,
            first: {
                name: null,
                score: null
            },
            second: {
                name: null,
                score: null,
            },
            third: {
                name: null,
                score: null
            }
        }

        socket.emit('getResults', this.state.roomID, 3);
        socket.on('finalResults', (first, second, third) => {
            this.setState({ first, second, third });
        });
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100vh' }}>
                <BackButton />
                <div style={{ width: '100%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <div className='silver' style={{ width: '10%', backgroundColor: '#DEDEDE', textAlign: 'center' }}>
                        <h3 className='winner'>{ this.state.second.name } ({ this.state.second.score })</h3>
                    </div>
                    <div className='gold' style={{ width: '10%', backgroundColor: '#F7D802', margin: '0 50px', textAlign: 'center' }}>
                        <h3 className='winner'>{ this.state.first.name } ({ this.state.first.score })</h3>
                    </div>
                    <div className='bronze' style={{ width: '10%', backgroundColor: '#C77B30', textAlign: 'center' }}>
                        { this.state.third.name == "" ? null :
                        <h3 className='winner'>{ this.state.third.name } ({ this.state.third.score })</h3> }
                    </div>
                </div>
            </div>
        );
    }
}

export default Results;