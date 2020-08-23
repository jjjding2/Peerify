import React from 'react';
import { Redirect } from 'react-router-dom';
import Ratings from '../../components/Ratings/Ratings';
import Waiting from '../../components/Waiting/Waiting';

import socket from '../../socket';

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
            readyNextRound: false,
            gameOver: false,

            rating: 2.5,
        };

        socket.removeAllListeners();

        if(this.state.userID == this.state.leader) {
            socket.emit('promptStage', this.state.roomID);
        }

        socket.on('finishPrompt', () => {
            if (this.state.userID == this.state.leader) {
                if (!this.state.promptSubmitted){
                    this.setState({ promptSubmitted: true });
                    socket.emit('writingStage', this.state.roomID, document.getElementById('prompt').value);
                }
            }
        });

        socket.on('prompt', prompt => {
            this.setState({
                prompt,
                promptSubmitted: true,
            });
        });

        socket.on('finishWriting', () => {
            if (!this.state.entrySubmitted) {
                this.setState({ entrySubmitted: true });
                socket.emit('sendText', this.state.userID, this.state.roomID, document.getElementById('user-response').value);
            }
            this.setState({ allEntrySubmitted: true });
        });

        socket.on('allSubmitted', () => {
            this.setState({ allEntrySubmitted: true });
            socket.emit('getEvaluation', this.state.userID, this.state.roomID);
            if(this.state.userID == this.state.leader){
                socket.emit('evaluationStage', this.state.RoomID);
            }
        });

        socket.on('evaluation', evalEntry => {
            console.log("eval entry "+evalEntry);
            this.setState({ evalEntry });
            if (this.state.userID == this.state.leader) {
                socket.emit('evaluationStage', this.state.roomID);
            }
        });

        socket.on('finishEvaluation', () => {
            if (!this.state.evalSubmitted){
                this.setState({ evalSubmitted: true });
                socket.emit('sendEvaluation', this.state.userID, this.state.roomID, document.getElementById('user-evaluation').value, this.state.rating)
            }
            // this.setState({ allEvalSubmitted: true });
        });

        socket.on('allEvaluated', () => {
            // this.setState({ allEvalSubmitted: true });
            socket.emit('getFeedback', this.state.userID, this.state.roomID);
            socket.emit('getScore', this.state.userID, this.state.roomID);
            if(this.state.userID == this.state.leader){
                socket.emit('feedbackStage', this.state.roomID);
            }
        });

        socket.on('feedback', feedback => {
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

        socket.on('finishFeedback', () => {
            if(!this.state.readyNextRound){
                this.nextRound();
            }
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
                readyNextRound: false,

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
        this.nextRound = this.nextRound.bind(this);
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

    nextRound() {
        socket.emit('sendReadyNextGame', this.state.userID, this.state.roomID);
        this.setState({
            readyNextRound: true,
        });
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
                            if(!this.state.readyNextRound){
                                component =
                                <div>
                                    <h1 className = 'page-header'> Your feedback is: </h1>
                                    <textarea className = 'user-response' readOnly = {true} style = {{ top: '20vh', height: '40vh' }} value={this.state.feedback} />
                                    <Ratings top = '63vh' left = '5vw' selectedRating = { this.state.rating } />
                                    <div className = 'prompt-submit' style = {{ top: '63vh' }}>
                                        <button className = 'prompt-submit' style = {{ top: '63vh' }}> Continue </button>
                                        <div className = 'bottom-bar' onClick = { () => this.nextRound() }> </div>
                                    </div>
                                </div>
                            }else{
                                component =
                                <Waiting></Waiting>
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