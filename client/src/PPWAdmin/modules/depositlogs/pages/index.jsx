import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import DepositLog from "./DepositLog";
import AddDeposit from "./AddDeposit";

export default class DepositLogModule extends Component {
    render() {
        const { history } = this.props;
        return (
            <BrowserRouter basename="/PPWAdmin/deposit-log">
                <Switch>
                    <Route exact path="/" render={(props) => <DepositLog {...props} topHistory={history} />} />
                    <Route path="/add" component={AddDeposit} />
                </Switch>
            </BrowserRouter>
        )
    }
}