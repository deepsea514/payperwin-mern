import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Events from "./Events";
import SettleEvent from "./SettleEvent";

export default class EventModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/custom-events">
                <Switch>
                    <Route path="/settle/:id" component={SettleEvent} />
                    <Route path="/" component={Events} />
                </Switch>
            </BrowserRouter>
        )
    }
}