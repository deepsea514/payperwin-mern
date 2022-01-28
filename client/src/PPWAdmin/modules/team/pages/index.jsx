import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import TeamMembers from "./TeamMembers";
import TeamMemberForm from "./TeamMemberForm";

export default class TeamModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/team">
                <Switch>
                    <Route path="/create" component={TeamMemberForm} />
                    <Route path="/edit/:id" component={TeamMemberForm} />
                    <Route exact path="/" component={TeamMembers} />
                </Switch>
            </BrowserRouter>
        )
    }
}