import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import './Ratings.css';

class Ratings extends React.Component {
    constructor(props) {
        super(props);
    }

    handleRatingChange(newValue) {
        this.props.onSelectRating(newValue);            
    }

    render() {
        let component = null;

        if(this.props.selectedRating == undefined) component = <Rating style = {{ top: this.props.top, left: this.props.left }} defaultValue={2.5} max={5} precision={0.5} value = {this.rating} onChange={(event, newValue) => this.handleRatingChange(newValue)} />
        else component = <Rating style = {{ top: this.props.top, left: this.props.left }} readOnly = 'true' defaultValue={this.props.selectedRating} max={5} precision={0.5} value = {this.rating} />

        return (
            <Box component="fieldset" mb={3} borderColor="transparent">
                { component }
            </Box>
        );
    }
}

export default Ratings;
