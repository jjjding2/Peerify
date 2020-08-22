import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import CreateRoom from './pages/CreateRoom/CreateRoom';
import JoinRoom from './pages/JoinRoom/JoinRoom';

import './App.css';

import Navbar from './components/Navbar/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path = '/create-room' component = { CreateRoom } />
                <Route exact path = '/join-room' component = { JoinRoom } />
            </Switch>
        </Router>
    );
}

export default App;
