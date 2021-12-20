import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MismatchScores from "./MismatchScores";

export default class MismatchScoresModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/mismatch-scores">
                <Switch>
                    <Route exact path="/" component={MismatchScores} />
                </Switch>
            </BrowserRouter>
        )
    }
}