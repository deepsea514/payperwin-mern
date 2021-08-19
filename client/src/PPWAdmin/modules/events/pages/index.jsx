import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import SettleEvent from "./SettleEvent";
import EditEvent from "./EditEvent";

export default class EventModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/events">
                <Switch>
                    <Route path="/add" component={CreateEvent} />
                    <Route path="/edit/:id" component={EditEvent} />
                    <Route path="/settle/:id" component={SettleEvent} />
                    <Route path="/" component={Events} />
                </Switch>
            </BrowserRouter>
        )
    }
}