import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Cashback from "./Cashback";
import CashbackDetail from "./CashbackDetail";

export default class CashbackModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/cashback">
                <Switch>
                    <Route exact path="/" component={Cashback} />
                    <Route path="/:user/history/:year/:month" component={CashbackDetail} />
                </Switch>
            </BrowserRouter>
        )
    }
}