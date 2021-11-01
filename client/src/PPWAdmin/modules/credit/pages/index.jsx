import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Credits from "./Credits";
import CreditDetail from "./CreditDetail";

export default class WagerFeedsModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/credits">
                <Switch>
                    <Route exact path="/" component={Credits} />
                    <Route path="/:id/detail" component={CreditDetail} />
                </Switch>
            </BrowserRouter>
        )
    }
}