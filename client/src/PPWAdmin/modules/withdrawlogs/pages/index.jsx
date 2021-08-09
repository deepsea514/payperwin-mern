import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import WithdrawLog from "./WithdrawLog";
import AddWithdraw from "./AddWithdraw";

export default class WithdrawLogModule extends Component {
    render() {
        const { history } = this.props;
        return (
            <BrowserRouter basename="/PPWAdmin/withdraw-log">
                <Switch>
                    <Route exact path="/" render={(props) => <WithdrawLog {...props} topHistory={history} />} />
                    <Route path="/add" component={AddWithdraw} />
                </Switch>
            </BrowserRouter>
        )
    }
}