import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthWrap from "./authWrap";
import AdminWrap from "../PPWAdmin/AdminWrap";

export default class Main extends Component {
    render() {
        return (
            <BrowserRouter basename="">
                <Switch>
                    <Route path="/PPWAdmin" component={AdminWrap} />
                    <Route component={AuthWrap} />
                </Switch>
            </BrowserRouter>
        );
    }
}