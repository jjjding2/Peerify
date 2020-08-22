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
                <div className = "title" >Heading</div>
                <div className = 'main-background'> </div>
                <div className = 'button' style = {{ left: '22vw', top: '27vh' }}>
                    <div className = 'bottom-bar'>
                        <Link className = 'remove-styling-home' to = '/create-room'> <p> Create Room </p> </Link>
                    </div>
                </div>
                <div className = 'button' style = {{ left: '58vw', top: '45vh' }}>
                    <div className = 'bottom-bar'>
                        <Link className = 'remove-styling-home' to = '/join-room'> <p> Join Room </p> </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
