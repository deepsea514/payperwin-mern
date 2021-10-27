import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import BetActivities from "./BetActivities";
import BetDetail from "./BetDetail";

export default class BetActivityModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/bet-activities">
                <Switch>
                    <Route exact path="/" component={BetActivities} />
                    <Route path="/:id/detail" component={BetDetail} />
                </Switch>
            </BrowserRouter>
        )
    }
}