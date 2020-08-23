import React from 'react';

import { Redirect } from 'react-router-dom';
import Ratings from '../../components/Ratings/Ratings';

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
            isLeader: true,
            startTime: 0,
            endTime: 0,

            userResponse: localStorage.getItem('user-response') == undefined?"":localStorage.getItem('user-response'),
            characterUpdateCount: 0,

            userEvaluation: "",
            evaluationCharacterUpdateCount: 0,

            rating: 2.5,
        };

        this.submitPrompt = this.submitPrompt.bind(this);
        this.submitResponse = this.submitResponse.bind(this);
        this.responseChange = this.responseChange.bind(this);
        this.evaluationChange = this.evaluationChange.bind(this);
        this.nextRound = this.nextRound.bind(this);
        this.updateRating = this.updateRating.bind(this);
    }

    componentDidMount() {
        socket.on('start', leader => {
            localStorage.setItem('leaderID', leader);
            console.log(localStorage.getItem('userID')+" "+leader);
            this.setState({ isLeader : (leader == localStorage.getItem('userID'))});
        });

        socket.on('finishPrompt', () => {
            if(this.state.isLeader && localStorage.getItem('prompt') == undefined){
                this.submitPrompt(true);
            }
        });

        socket.on('finishWriting', () => {
            if(localStorage.getItem('response-ready') == undefined){
                this.submitResponse(true);
            }
        });

        socket.on('allSubmitted', () => {
            if(this.state.isLeader){
                socket.emit('evaluationStage', localStorage.getItem("roomID"));
            }
            socket.emit('getEvaluation', localStorage.getItem('userID'), localStorage.getItem('roomID'));
        });

        socket.on('evaluation', entry => {
            localStorage.setItem('evaluation', entry.text);
            localStorage.setItem('evaluation-ready', true);
            this.forceUpdate();
        });

        socket.on('finishEvaluation', () => {
            if(localStorage.getItem('evaluation-ready') == undefined){
                this.submitEvaluation();
            }
        });

        socket.on('allEvaluated', () => {
            if(this.state.isLeader){
                socket.emit('feedbackStage', localStorage.getItem("roomID"));
            }
            socket.emit('getFeedback', localStorage.getItem('userID'), localStorage.getItem('roomID'));
        });

        socket.on('feedback', entry => {
            localStorage.setItem('feedback', entry.text);
            localStorage.setItem('feedback-rating', entry.rating);
            localStorage.setItem('feedback-ready', true);
            this.forceUpdate();
        });

        socket.on('finishFeedback', newLeader => {
            if(localStorage.getItem('ready_next_game') == undefined){
                this.nextRound();
            }
            this.setState({
                isLeader: (localStorage.get('userID') == newLeader),
            });
        });

        socket.on('allReadyNextGame', () => {
            global.clearLocalStorage();
            this.forceUpdate();
        });
    }

    evaluationChange(e) {
        let t = this.state.evaluationCharacterUpdateCount+1;
        if(t == 20){
            localStorage.setItem('user-evaluation', e);
            t = 0;
        }
        this.setState({
            userEvaluation: e,
            evaluationCharacterUpdateCount: t,
        });
    }

    responseChange(e) {
        let t = this.state.characterUpdateCount+1;
        if(t == 20){
            localStorage.setItem('user-response', e);
            t = 0;
        }
        this.setState({
            userResponse: e,
            characterUpdateCount: t,
        });
    }

    submitPrompt(forceSubmit) {
        let pp = trimText(document.getElementById('prompt').value);
        if(pp == "" && forceSubmit == false) return;
        localStorage.setItem('prompt', pp);
        socket.emit('writingStage', localStorage.getItem('roomID'), pp );
        this.forceUpdate();
    }

    submitResponse(forceSubmit) {
        let pp = trimText(document.getElementById('user-response').value);
        if(pp == "" && forceSubmit == false) return;
        localStorage.setItem('user-response', pp);
        localStorage.setItem('response-ready', true);
        socket.emit('sendText', localStorage.getItem('userID'), localStorage.getItem('roomID'), pp );
        this.forceUpdate();
    }

    submitEvaluation() {
        let pp = trimText(document.getElementById('user-evaluation').value);
        localStorage.setItem('user-evaluation', pp);
        localStorage.setItem('evaluation-ready', true);
        socket.emit('sendEvaluation', localStorage.getItem('userID'), localStorage.getItem('roomID'), pp, this.state.rating )
        this.forceUpdate();
    }

    updateRating(val) {
        this.setState({
            rating: val,
        })
    }

    nextRound() {
        global.clearLocalStorage();
        localStorage.setItem('ready_next_game', true);
        socket.emit('sendReadyNextRound', localStorage.getItem('userID'));
        this.forceUpdate();
    }
    
    render() {
        if(localStorage.getItem('roomID') == undefined) return <Redirect to = '/' />

        let component = null;

        if(localStorage.getItem('prompt') == undefined){
            if(this.state.isLeader){
                component = 
                <div>
                    <input id = 'prompt' className = 'prompt' placeholder = 'Enter your prompt.' />
                    <div className = 'prompt-submit'>
                        <button className = 'prompt-submit'> Submit </button>
                        <div className = 'bottom-bar' onClick = { () => this.submitPrompt(false) }> </div>
                    </div>
                </div>
            }else{
                component =
                <div>
                    <h1 className = 'page-header'> Waiting for the leader to write their prompt... </h1>
                </div>
            }
        }else{
            if(localStorage.getItem('response-ready') == undefined){
                component =
                <div>
                    <h1 className = 'page-header'> { "Your prompt is: " + localStorage.getItem('prompt') } </h1>
                    <textarea id = 'user-response' className = 'user-response' placeholder = 'Enter your response!' value = { this.state.userResponse } onChange = { e => this.responseChange(e.target.value) } />
                    <div className = 'prompt-submit' style = {{ top: '83vh' }}>
                        <button className = 'prompt-submit' style = {{ top: '83vh' }}> Submit </button>
                        <div className = 'bottom-bar' onClick = { () => this.submitResponse(false) }> </div>
                    </div>
                </div>
            }else{
                if(localStorage.getItem('evaluation') == undefined){
                    component =
                    <div>
                            <h1 className = 'page-header'> Waiting for other players to finish... </h1>
                        <div className = 'image-container'>
                            <div className = 'waiting-image'></div>
                        </div>
                    </div>
                }else{
                    if(localStorage.getItem('evaluation-ready') == undefined){
                        component =
                        <div>
                            <h1 className = 'page-header'> Your partner's response was: </h1>
                            <textarea className = 'user-response' readonly = 'true' style = {{ top: '20vh', height: '25vh' }} value = { localStorage.getItem('evaluation') } />
                            <textarea id = 'user-evaluation' className = 'user-response' style = {{ top: '48vh', height: '30vh' }} placeholder = 'Any advice/thoughts?' value = { this.state.userEvaluation } onChange = { e => this.evaluationChange(e.target.value) } />
                            <div className = 'prompt-submit' style = {{ top: '90vh' }}>
                                <button className = 'prompt-submit' style = {{ top: '90vh' }}> Submit </button>
                                <div className = 'bottom-bar' onClick = { () => this.submitEvaluation() }> </div>
                            </div>
                        </div>
                    }else{
                        if(localStorage.getItem('feedback-ready') == undefined){
                            component =
                            <h1 className = 'page-header'> Waiting for other players to finish... </h1>
                        }else{
                            if(localStorage.getItem('ready_next_game') == undefined){
                                component =
                                <div>
                                    <h1 className = 'page-header'> Your feedback is: </h1>
                                    <textarea className = 'user-response' readonly = 'true' style = {{ top: '20vh', height: '40vh' }} value = { localStorage.getItem('feedback') } />
                                    <Ratings selectedRating = { localStorage.getItem('feedback-rating') } top = '63vh' left = '5vw' />
                                    <div className = 'prompt-submit' style = {{ top: '63vh' }}>
                                        <button className = 'prompt-submit' style = {{ top: '63vh' }}> Continue </button>
                                        <div className = 'bottom-bar' onClick = { () => this.nextRound() }> </div>
                                    </div>
                                </div>
                            }else{
                                component =
                                <h1 className = 'page-header'> Waiting for other players to finish... </h1>
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