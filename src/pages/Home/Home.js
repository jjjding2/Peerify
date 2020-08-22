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
                <button key = 'abc' className = 'button' style = {{ left: '34vw' }}>
                    <Link className = 'remove-styling-home' to = '/create-room'> Create Room </Link>
                </button>
                <button key = 'abcd' className = 'button' style = {{ left: '51vw' }}>
                    <Link className = 'remove-styling-home' to = '/join-room'> Join Room </Link>
                </button>
            </div>
        );
    }
}

export default Home;
