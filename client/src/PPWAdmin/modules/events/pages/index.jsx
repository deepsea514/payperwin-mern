import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Events from "./Events";

export default class EventModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/events">
                <Switch>
                    <Route path="/" component={Events} />
                </Switch>
            </BrowserRouter>
        )
    }
}