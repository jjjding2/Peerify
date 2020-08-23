import React from 'react';

import { Link } from 'react-router-dom';

import './Home.css';

import socket from '../../socket';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {};

        socket.on('createId', id => {
            this.setState({ id });
        });
    }

    render() {
        return (
            <div>
                <h1 className = 'title'> Heading </h1>
                <div className = 'main-background'>
                    <div className = 'button' style = {{ left: '24%', top: '44%' }}>
                        <div className = 'bottom-bar'>
                            <Link className = 'remove-styling-home' to = {{
                                pathname: '/create-room',
                                state: {
                                    userID: this.state.id
                                }
                                }}> 
                                <p style = {{ height: '110%' }}> Create Room </p>
                            </Link>
                        </div>
                    </div>
                    <div className = 'button' style = {{ left: '57%', top: '30%' }}>
                        <div className = 'bottom-bar'>
                            <Link className = 'remove-styling-home' to ={{
                                pathname: '/join-room',
                                state: {
                                    userID: this.state.id
                                }
                                }}> 
                                <p style = {{ height: '110%' }}> Join Room </p> 
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
