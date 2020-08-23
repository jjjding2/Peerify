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
                {
                    name: 'adsfasfds',
                    text: 'sadfsafasdf'
                },{
                    name: 'dsafasdff',
                    text: 'dasfasdf',
                }, {
                    name: 'adsfasf',
                    text: 'sdafas',
                },{
                    name: 'adsfasfds',
                    text: 'sadfsafasdf'
                },{
                    name: 'dsafasdff',
                    text: 'dasfasdf',
                }, {
                    name: 'adsfasf',
                    text: 'sdafas',
                }
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
                                            <div style={{ display: 'inline-block', marginTop: '100px', backgroundColor: '#6C63FF', borderRadius: '90px', padding: '0 30px'}}>
                                                <h1 style={{ fontSize: '60px', color: 'white' }}>Current Scoreboard</h1>
                                            </div>
                                            <div style={{ display: 'flex', width: '100%', height: '100vh', marginTop: '50px', justifyContent: 'center'}}>
                                                <img src={steppingUp} style={{ width: '500px', height: '380px' }}></img>
                                                <div style={{ width: '540px'}}>
                                                <   div style={{ display: 'flex', backgroundColor: '#6C63FF', borderRadius: '20px', justifyContent: 'space-between', marginBottom: '10px'}}>
                                                        <div style={{marginLeft: '40px'}}>
                                                            <h3 className='scoreboard' style={{ textDecoration: 'underline'}}> Name </h3>
                                                        </div>
                                                        <div style={{marginRight: '40px'}}>
                                                            <h3 className='scoreboard' style={{ textDecoration: 'underline'}}> Score </h3>
                                                        </div>
                                                    </div>
                                                    {   
                                                        this.state.topUsers.map(function(user, idx) {
                                                            if (user.name == "") return;
                                                            let color;
                                                            if (idx==0) color = '#F7D802';
                                                            else if (idx==1) color = '#DEDEDE';
                                                            else if (idx==2) color = '#C77B30';
                                                            else color = 'white';
                                                            return (
                                                                <div style={{ display: 'flex', backgroundColor: color, borderRadius: '20px', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                                    <div style={{marginLeft: '40px'}}>
                                                                        <h3 className='scoreboard'> {user.name} </h3>
                                                                    </div>
                                                                    <div style={{marginRight: '40px'}}>
                                                                        <h3 className='scoreboard'>{user.score}</h3>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                        
                                                <img src={books} style={{ width: '500px', height: '266px' }}></img>
                                            </div>
                                            <div style={{ display: 'inline-block', marginTop: '100px', backgroundColor: '#6C63FF', borderRadius: '90px', padding: '0 30px'}}>
                                                <h1 style={{ fontSize: '60px', color: 'white'}}> Entries </h1>
                                            </div>
                                            <div style={{ display: 'flex', width: '100%',  justifyContent: 'center', marginTop: '50px', marginBottom: '500px', overflow: 'scroll'}}>
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
                                            <div className = 'prompt-submit' style = {{ top: '90vh' }}>
                                                <button className = 'prompt-submit' style = {{ top: '90vh' }}> Continue </button>
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