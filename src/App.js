import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './pages/Home/Home';
import CreateRoom from './pages/CreateRoom/CreateRoom';
import JoinRoom from './pages/JoinRoom/JoinRoom';

import './App.css';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path = '/' component = { Home } />
                <Route exact path = '/create-room' component = { CreateRoom } />
                <Route exact path = '/join-room' component = { JoinRoom } />
            </Switch>
        </Router>
    );
}

export default App;
