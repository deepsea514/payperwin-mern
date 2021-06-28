import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";

export default class EventModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/events">
                <Switch>
                    <Route path="/add" component={CreateEvent} />
                    <Route path="/edit/:id" component={EditEvent} />
                    <Route path="/" component={Events} />
                </Switch>
            </BrowserRouter>
        )
    }
}