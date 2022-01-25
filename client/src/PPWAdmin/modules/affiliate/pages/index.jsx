import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Affiliates from "./Affiliates";

export default class AffiliatesModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/affiliates">
                <Switch>
                    <Route exact path="/" component={Affiliates} />
                </Switch>
            </BrowserRouter>
        )
    }
}