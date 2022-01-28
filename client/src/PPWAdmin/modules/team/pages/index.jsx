import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import TeamMembers from "./TeamMembers";

export default class TeamModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/team">
                <Switch>
                    <Route exact path="/" component={TeamMembers} />
                </Switch>
            </BrowserRouter>
        )
    }
}