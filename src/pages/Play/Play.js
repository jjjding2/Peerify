import React from 'react';
import { Redirect } from 'react-router-dom';
import Ratings from '../../components/Ratings/Ratings';
import Waiting from '../../components/Waiting/Waiting';

import socket from '../../socket';

import steppingUp from '../../images/steppingUp.png';
import books from '../../images/books.png';

import './Play.css';

function trimText(str) {
    while(str.length > 0 && str[0] == ' ') str = str.substring(1);
    while(str.length > 0 && str[str.length-1] == ' ') str = str.substring(0,str.length-1);
    return str;
}

class Play extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: props.location.state.userID,
            roomID: props.location.state.roomID,
            leader: props.location.state.leader,

            promptSubmitted: false,
            entrySubmitted: false,
            evalEntry: null,
            allEntrySubmitted: false,
            evalSubmitted: false,
            allEvalSubmitted: false,
            feedback: null,
            doneFeedback: false,
            allDoneFeedback: false,
            doneScoreboard: false,
            gameOver: false,

            topUsers: [
                {
                    name: '1',
                    score: 10,
                }, {
                    name: '2',
                    score: 10,
                }, {
                    name: '3',
                    score: 10,
                }, {
                    name: '4',
                    score: 10,
                }, {
                    name: '5',
                    score: 10,
                }
            ],
            userEntries: [

            ],

            rating: 2.5,
        };

        socket.removeAllListeners();

        if(this.state.userID == this.state.leader) {
            socket.emit('promptStage', this.state.roomID);
        }

        socket.on('prompt', prompt => {
            this.setState({
                prompt,
                promptSubmitted: true,
            });
        });

        socket.on('allSubmitted', () => {
            this.setState({ allEntrySubmitted: true });
            socket.emit('getEvaluation', this.state.userID, this.state.roomID);
        });

        socket.on('evaluation', evalEntry => {
            console.log("eval entry "+evalEntry);
            this.setState({ evalEntry });
        });

        socket.on('allEvaluated', () => {
            // this.setState({ allEvalSubmitted: true });
            socket.emit('getFeedback', this.state.userID, this.state.roomID);
            socket.emit('getScore', this.state.userID, this.state.roomID);
        });

        socket.on('feedback', feedback => {
            let t = feedback.text, r = feedback.rating;
            if(t == undefined) t = "";
            this.setState({ 
                feedback: feedback.text,
                rating: feedback.rating
            }, () => {
                this.setState({ allEvalSubmitted: true });
            });
        });

        socket.on('score', score => {
            this.setState({ score });
        });

        socket.on('gameOver', () => { //implement later
            this.setState({ gameOver: true });
        });

        socket.on('results', array => {
            console.log("RESULTS GOTTEN");
            this.setState({ topUsers: array });
        });

        socket.on('entries', array => {
            this.setState({ userEntries: array });
        });

        socket.on('allDoneWithFeedback', () => {
            console.log("FEEDBACK DONE");
            this.setState({ allDoneFeedback: true, doneFeedback: true });
            if (this.state.userID == this.state.leader){
                socket.emit('getResults', this.state.roomID, 5);
                socket.emit('getEntries', this.state.roomID);
            }
        });

        socket.on('scoreboardStageOver', () => {
            socket.emit('sendReadyNextGame', this.state.roomID);
        });

        socket.on('allReadyNextGame', newLeader => {
            this.setState({
                leader: newLeader,

                promptSubmitted: false,
                entrySubmitted: false,
                evalEntry: null,
                allEntrySubmitted: false,
                evalSubmitted: false,
                allEvalSubmitted: false,
                feedback: null,
                doneFeedback: false,
                allDoneFeedback: false,
                doneScoreboard: false,
                gameOver: false,

                rating: 2.5,
            });
            // console.log(newLeader);
            // console.log(this.state.userID);
            if(this.state.userID == newLeader){
                socket.emit('promptStage', this.state.roomID);
            }
        });

        this.submitPrompt = this.submitPrompt.bind(this);
        this.submitEntry = this.submitEntry.bind(this);
        this.submitEval = this.submitEval.bind(this);
        this.updateRating = this.updateRating.bind(this);
        this.doneFeedback = this.doneFeedback.bind(this);
    }

    submitPrompt() {
        this.setState({ promptSubmitted: true });
        this.setState({ prompt: document.getElementById('prompt').value });
        console.log(document.getElementById('prompt').value);
        socket.emit('writingStage', this.state.roomID, document.getElementById('prompt').value);
    }

    submitEntry() {
        this.setState({ entrySubmitted: true });
        socket.emit('sendText', this.state.userID, this.state.roomID, document.getElementById('user-response').value );
    }

    submitEval() {
        this.setState({ evalSubmitted: true });
        socket.emit('sendEvaluation', this.state.userID, this.state.roomID, document.getElementById('user-evaluation').value, this.state.rating);
    }

    updateRating(val) {
        this.setState({
            rating: val,
        });
    }

    doneFeedback() {
        this.setState({ doneFeedback: true });
        console.log("ALLDONE FEEDBACK "+this.state.allDoneFeedback);
        socket.emit('doneWithFeedback', this.state.roomID);
    }

    doneScoreboard() {
        this.setState({ doneScoreboard: true });
        socket.emit('doneScoreboard', this.state.roomID);
    }
    
    render() {
        if(this.state.gameOver) {
            return <Redirect to = {{
                pathname: '/results',
                state: {
                    roomID: this.state.roomID,
                }
            }} />
        }
        let component = null;

        if(!this.state.promptSubmitted){
            if(this.state.userID == this.state.leader){
                component = 
                <div>
                    <input id = 'prompt' className = 'prompt' placeholder = 'Enter your prompt.' />
                    <div className = 'prompt-submit'>
                        <button className = 'prompt-submit'> Submit </button>
                        <div className = 'bottom-bar' onClick = { () => this.submitPrompt() }> </div>
                    </div>
                </div>
            }else{
                component =
                <div>
                    <h1 className = 'page-header'> Waiting for the leader to write their prompt... </h1>
                </div>
            }
        }else{
            if(!this.state.entrySubmitted){
                component =
                <div>
                    <h1 className = 'page-header'> { "Your prompt is: " + this.state.prompt } </h1>
                    <textarea id = 'user-response' className = 'user-response' placeholder = 'Enter your response!' />
                    <div className = 'prompt-submit' style = {{ top: '83vh' }}>
                        <button className = 'prompt-submit' style = {{ top: '83vh' }}> Submit </button>
                        <div className = 'bottom-bar' onClick = { () => this.submitEntry() }> </div>
                    </div>
                </div>
            }else{
                if(!this.state.allEntrySubmitted){
                    component =
                    <Waiting></Waiting>
                }else{
                    if(!this.state.evalSubmitted){
                        component =
                        <div>
                            <h1 className = 'page-header'> Your partner's response was: </h1>
                            <textarea className = 'user-response' readOnly = {true} style = {{ top: '20vh', height: '25vh' }} value={this.state.evalEntry}/>
                            <textarea id = 'user-evaluation' className = 'user-response' style = {{ top: '48vh', height: '30vh' }} placeholder = 'Any advice/thoughts?' />
                            <Ratings top = '80vh' left = '5vw' onSelectRating = { this.updateRating } />
                            <div className = 'prompt-submit' style = {{ top: '80vh' }}>
                                <button className = 'prompt-submit' style = {{ top: '80vh' }}> Submit </button>
                                <div className = 'bottom-bar' onClick = { () => this.submitEval() }> </div>
                            </div>
                        </div>
                    }else{
                        if(!this.state.allEvalSubmitted){
                            component =
                            <Waiting></Waiting>
                        }else{
                            if(!this.state.doneFeedback){
                                component =
                                <div>
                                    <h1 className = 'page-header'> Your feedback is: </h1>
                                    <textarea className = 'user-response' readOnly = {true} style = {{ top: '20vh', height: '40vh' }} value={this.state.feedback} />
                                    <Ratings top = '63vh' left = '5vw' selectedRating = { this.state.rating } />
                                    <div className = 'prompt-submit' style = {{ top: '63vh' }}>
                                        <button className = 'prompt-submit' style = {{ top: '63vh' }}> Continue </button>
                                        <div className = 'bottom-bar' onClick = { () => this.doneFeedback() }> </div>
                                    </div>
                                </div>
                            }else{
                                if (!this.state.allDoneFeedback) {
                                    component =
                                    <Waiting></Waiting>
                                }else {
                                    if (!this.state.doneScoreboard){
                                        component = 
                                        <div style={{ textAlign: 'center' }}>
                                            <h1 className = 'page-header' style={{ marginTop: '100px', fontSize: '60px' }}>Current Scoreboard</h1>
                                            <div style={{ display: 'flex', width: '100%', height: '100vh', marginTop: '300px', justifyContent: 'center'}}>
                                            <img src={steppingUp} style={{ width: '500px', height: '380px' }}></img>
                                            <div>
                                                <h2 className='scoreboard'>Name</h2>
                                                {
                                                this.state.topUsers.map(function(user, idx) {
                                                    if (user.name != ""){
                                                        return (
                                                            <h3 className='scoreboard'>{user.name}</h3>
                                                        )
                                                    }
                                                })
                                            }
                                            </div>
                                            <div style={{marginLeft: '300px'}}>
                                            <h2 className='scoreboard'>Score</h2>
                                            {
                                                this.state.topUsers.map(function(user, idx) {
                                                    if (user.name != ""){
                                                        return (
                                                            <h3 className='scoreboard'>{user.score}</h3>
                                                        )
                                                    }
                                                })
                                            }
                                            </div>
                                            <img src={books} style={{ width: '500px', height: '266px' }}></img>
                                            </div>
                                            <h2> Entries </h2>
                                            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '500px'}}>
                                            {
                                                this.state.userEntries.map(function(entry, idx) {
                                                    return (
                                                        <div style={{margin: '10px'}}>
                                                            <h2> {entry.name} </h2>
                                                            <div style={{ width: '300px', height: '100px' }}>
                                                                {entry.text}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div>
                                            <div className = 'prompt-submit' style = {{ top: '63vh' }}>
                                                <button className = 'prompt-submit' style = {{ top: '63vh' }}> Continue </button>
                                                <div className = 'bottom-bar' onClick = { () => this.doneScoreboard() }> </div>
                                            </div>
                                        </div>
                                    }else {
                                        component =
                                        <Waiting></Waiting>
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return (
            <div>
                { component }
            </div>
        );
    }
}

export default Play;