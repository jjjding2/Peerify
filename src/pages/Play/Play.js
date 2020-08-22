import React from 'react';

import { Redirect } from 'react-router-dom';

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
        };

        this.submitPrompt = this.submitPrompt.bind(this);
        this.submitResponse = this.submitResponse.bind(this);
        this.responseChange = this.responseChange.bind(this);
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

    submitPrompt() {
        let pp = trimText(document.getElementById('prompt').value);
        if(pp == "") return;
        localStorage.setItem('prompt', pp);
        this.forceUpdate();
    }

    submitResponse() {
        let pp = trimText(document.getElementById('user-response').value);
        if(pp == "") return;
        localStorage.setItem('user-response', pp);
        localStorage.setItem('response-ready', true);
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
                        <div className = 'bottom-bar' onClick = { this.submitPrompt }> </div>
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
                        <div className = 'bottom-bar' onClick = { this.submitResponse }> </div>
                    </div>
                </div>
            }else{
                component =
                <h1 className = 'page-header'> Waiting for other players to finish... </h1>
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