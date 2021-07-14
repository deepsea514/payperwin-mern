import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Admins from './Admins';
import CreateAdmin from "./CreateAdmin";

export default class AdminModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/admin">
                <Switch>
                    <Route path="/create" component={CreateAdmin} />
                    <Route exact path="/" component={Admins} />
                </Switch>
            </BrowserRouter>
        )
    }
}