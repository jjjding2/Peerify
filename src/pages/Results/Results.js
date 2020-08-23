import React from 'react';

import BackButton from '../../components/BackButton/BackButton';

import socket from '../../socket';

import './Results.css';

function retrieveTop(map){
    let array = [];
    for (let key in map) {
        array.push({
            text: key,
            value: map[key],
        })
    }
    array.sort((a, b) => (a.value > b.value ? -1 : 1));
    let ret = [];
    for (let i=0; i<Math.min(array.length, 5); i++){
        ret.push(array[i].text);
    }
    return ret;
}

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomID: props.location.state.roomID,
            first: {
                name: null,
                score: null
            },
            second: {
                name: null,
                score: null,
            },
            third: {
                name: null,
                score: null
            },
            positive_words: ['adsfsa', 'adsf', 'adfasd', 'adsfads', 'adfas'],
            negative_words: ['adf', 'adfa', 'adf', 'adfds', 'adfas'],
        }

        socket.emit('getResults', this.state.roomID, 3);
        socket.on('finalResults', (first, second, third, positive_words, negative_words) => {
            this.setState({
                first, second, third, positive_words: retrieveTop(positive_words), negative_words: retrieveTop(negative_words)
            });
        });
    }

    render() {
        return (
            <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily : 'Montserrat-Bold' }}>
                <BackButton />
                <div style={{ display: 'flex', width: '100%', height: '80%', justifyContent: 'space-between' }}>
                    <div style={{ width: '70%', height: '100%'}}>
                        <div style={{ width: '100%', height: '20%', textAlign: 'center', paddingTop: '100px'}}>
                            <h1 style={{ fontSize: '60px' }}> Congratulations! </h1>
                        </div>
                        <div style={{ width: '100%', height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <div className='silver' style={{ width: '20%', backgroundColor: '#DEDEDE', textAlign: 'center' }}>
                                <h3 className='winner'>{ this.state.second.name } ({ this.state.second.score })</h3>
                            </div>
                            <div className='gold' style={{ width: '20%', backgroundColor: '#F7D802', margin: '0 50px', textAlign: 'center' }}>
                                <h3 className='winner'>{ this.state.first.name } ({ this.state.first.score })</h3>
                            </div>
                            <div className='bronze' style={{ width: '20%', backgroundColor: '#C77B30', textAlign: 'center' }}>
                                { this.state.third.name == "" ? null :
                                <h3 className='winner'>{ this.state.third.name } ({ this.state.third.score })</h3> }
                            </div>
                        </div>
                    </div>
                    <div style={{width: '30%', textAlign: 'center', marginRight: '200px'}}>
                        <div style={{ display: 'inline-block', backgroundColor: 'rgb(91, 224, 29)', borderRadius: '20px', fontSize: '30px', fontWeight: '900', padding: '10px 20px'}}>
                            Positive Correlation
                        </div>
                        {
                            this.state.positive_words.map(function(word, idx) {
                                let className = 'word'+idx;
                                return (
                                    <h2 className={className}>{word}</h2>
                                )
                            })
                        }
                        <div style={{ display: 'inline-block', backgroundColor: 'rgb(224, 29, 38)', borderRadius: '20px', fontSize: '30px', fontWeight: '900', padding: '10px 20px', marginTop: '50px'}}>
                            Negative Correlation
                        </div>
                        {
                            this.state.negative_words.map(function(word, idx) {
                                let className = 'word'+idx;
                                return (
                                    <h2 className={className}>{word}</h2>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Results;