import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import './Waiting.css';

class Waiting extends React.Component {
    constructor(props) {
        super(props);
    }

   
    render() {
        let component = null;
        return (
            <div>
            <h1 className = 'page-header'> Waiting for other players to finish... </h1>
            <div className = 'image-container'>
                <div className = 'waiting-image'></div>
            </div>
        </div>
        );
    }
}

export default Waiting;
