import React from 'react';

import { Link } from 'react-router-dom';

import './Home.css';

class Home extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <h1 className = 'title'> Heading </h1>
                <div className = 'main-background'>
                    <div className = 'button' style = {{ left: '24%', top: '44%' }}>
                        <div className = 'bottom-bar'>
                            <Link className = 'remove-styling-home' to = '/create-room'> 
                                <p style = {{ height: '110%' }}> Create Room </p>
                            </Link>
                        </div>
                    </div>
                    <div className = 'button' style = {{ left: '57%', top: '30%' }}>
                        <div className = 'bottom-bar'>
                            <Link className = 'remove-styling-home' to = '/join-room'> 
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
