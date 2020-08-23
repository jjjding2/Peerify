import React from 'react';

import { Redirect, Link } from 'react-router-dom';

import './BackButton.css';

class BackButton extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <button className = 'back-button'>
                    <Link className = 'remove-styling-back' to = '/'>
                        Back
                    </Link>
                </button>
            </div>
        );
    }
}

export default BackButton;