import React from 'react';

import { Redirect } from 'react-router-dom';

import './Play.css';
import { tsExpressionWithTypeArguments } from '@babel/types';

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
            prompt: "",
            startTime: 0,
            endTime: 0,
        };

        this.submitPrompt = this.submitPrompt.bind(this);
    }

    submitPrompt() {
        let pp = trimText(document.getElementById('prompt').value);
        if(pp == "") return;
        this.setState({
            prompt: pp,
        });
    }

    render() {
        if(localStorage.getItem('roomID') == undefined) return <Redirect to = '/' />
        return (
            <div>
                {
                    this.state.prompt == ""?
                    this.state.isLeader?
                    <div>
                        <input id = 'prompt' className = 'prompt' placeholder = 'Enter your prompt.' />
                        <div className = 'prompt-submit'>
                            <button className = 'prompt-submit' onClick = { this.submitPrompt }> Submit </button>
                            <div className = 'bottom-bar'> </div>
                        </div>
                    </div>
                    :
                    <div>
                        <h1>Wait for the leader to write their prompt...</h1>
                    </div>
                    :
                    <div>
                        
                        
                    </div>
                }
            </div>
        );
    }
}

export default Play;