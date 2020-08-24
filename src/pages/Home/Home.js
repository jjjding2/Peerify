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
                <div className = 'title'> </div>
                <div className = 'diamond' style = {{ left: '73.3vw', top: '16.5vh' }}></div>
                <div className = 'diamond' style = {{ height: '40vh', width: '40vh', left: '62vw', top: '28.5vh' }}></div>
                <div className = 'diamond' style = {{ left: '60vw', top: '57.5vh' }}></div>
                <div className = 'button' style = {{ left: '76.7%', top: '23.1%' }}>
                    <div className = 'bottom-bar'>
                        <Link className = 'remove-styling-home' to = '/create-room'>
                            <p style = {{ height: '110%' }}> Create </p>
                        </Link>
                    </div>
                </div>
                <div className = 'button' style = {{ left: '64.5%', top: '64.5%' }}>
                    <div className = 'bottom-bar'>
                        <Link className = 'remove-styling-home' to = '/join-room'>
                            <p style = {{ height: '110%' }}> Join </p> 
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
