import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import './Navbar.css';

class Navbar extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className = 'navbar'>
                <div className = 'navbar-entry' style = {{ left: '1%' }}>
                    <button className = 'navbar-button'>
                        <Link className = 'remove-styling' to = '/'> Back </Link>
                    </button>
                </div>
            </div>
        );
    }
}

export default Navbar;
