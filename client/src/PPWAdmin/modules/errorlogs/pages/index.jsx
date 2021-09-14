import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ErrorLogs from "./ErrorLogs";

export default class ErrorLogsModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/errorlogs">
                <Switch>
                    <Route exact path="/" component={ErrorLogs} />
                </Switch>
            </BrowserRouter>
        )
    }
}