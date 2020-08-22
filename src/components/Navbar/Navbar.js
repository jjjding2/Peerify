import React from 'react';
import './Navbar.css';

class Navbar extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className = 'navbar'>
                <div className = 'navbar-entry' style = {{ right: '10%' }}>
                    <button className = 'navbar-button'> Create Room </button>
                </div>
                <div className = 'navbar-entry' style = {{ right: '1%' }}>
                    <button className = 'navbar-button'> Join Room </button>
                </div>
            </div>
        );
    }
}

export default Navbar;
