import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './pages/Home/Home';
import CreateRoom from './pages/CreateRoom/CreateRoom';
import JoinRoom from './pages/JoinRoom/JoinRoom';
import Play from './pages/Play/Play';

import './App.css';
import socket from './socket';
import Ratings from './components/Ratings/Ratings';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        socket.on('createId', (id) => {
            this.setState({ id })
        });
    }

    render(){
        return (
            <Router>
                <div className = 'top-border'> </div>
                <Switch>
                    <Route exact path = '/' component = { Home } />
                    <Route exact path = '/create-room' render={(routeProps) => (
                        <CreateRoom id={this.state.id}/>
                    )}/>
                    <Route exact path = '/join-room' component = { JoinRoom } id={this.state.id}/>
                    <Route exact path = '/play' component = { Play } />
                </Switch>
            </Router>
        );
    }
}

export default App;
