import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Affiliates from "./Affiliates";
import AffiliateForm from './AffiliateForm';

export default class AffiliatesModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/affiliates">
                <Switch>
                    <Route exact path="/" component={Affiliates} />
                    <Route exact path="/create" component={AffiliateForm} />
                    <Route exact path="/:id/edit" component={AffiliateForm} />
                </Switch>
            </BrowserRouter>
        )
    }
}