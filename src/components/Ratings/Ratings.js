import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import './Ratings.css';

class Ratings extends React.Component {

    constructor() {
        super();

    }

    handleRatingChange = (newValue) => {
        this.props.onSelectRating(newValue);            
    }

    render() {

        return (
            <Box component="fieldset" mb={3} borderColor="transparent">
            <Rating name="customized-10" id = "rating" defaultValue={2.5} max={5} precision={0.5} value = {this.rating} onChange={(event, newValue) => this.handleRatingChange(newValue)}/>
            </Box>
        );
    }
}

export default Ratings;
