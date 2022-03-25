import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import EventDetail from './EventDetail';
import Events from "./Events";

export default class EventModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/custom-events">
                <Switch>
                    <Route path="/detail/:id" component={EventDetail} />
                    <Route path="/" component={Events} />
                </Switch>
            </BrowserRouter>
        )
    }
}