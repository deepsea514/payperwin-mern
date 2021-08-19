import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Tickets from "./Tickets";
import TicketDetail from "./TicketDetail";

export default class TicketsModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/support-tickets">
                <Switch>
                    <Route path="/:id/detail" component={TicketDetail} />
                    <Route exact path="/" component={Tickets} />
                </Switch>
            </BrowserRouter>
        )
    }
}