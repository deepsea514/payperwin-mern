import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ActiveUsers from "./ActiveUsers";

export default class ActiveUsersModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/active-users">
                <Switch>
                    <Route exact path="/" component={ActiveUsers} />
                </Switch>
            </BrowserRouter>
        )
    }
}