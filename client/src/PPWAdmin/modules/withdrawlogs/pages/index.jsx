import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import WithdrawLog from "./WithdrawLog";
import AddWithdraw from "./AddWithdraw";

export default class WithdrawLogModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/withdraw-log">
                <Switch>
                    <Route exact path="/" component={WithdrawLog} />
                    <Route path="/add" component={AddWithdraw} />
                </Switch>
            </BrowserRouter>
        )
    }
}