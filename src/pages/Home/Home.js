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
                <Link to = '/create-room'>
                    <button key = 'abc' className = 'button' style = {{ left: '34vw' }}>
                        <div className = 'remove-styling-home' to = '/create-room'> Create Room </div>
                    </button>
                </Link>
                <Link to = 'join-room'>
                    <button key = 'abcd' className = 'button' style = {{ left: '51vw' }}>
                        <div className = 'remove-styling-home' to = '/join-room'> Join Room </div>
                    </button>
                </Link>

            </div>
        );
    }
}

export default Home;
