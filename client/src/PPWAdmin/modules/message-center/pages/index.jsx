import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MessageCenter from "./MessageCenter";
import CreateMessage from "./CreateMessage";

export default class MessageCenterModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/message-center">
                <Switch>
                    <Route path="/create" component={CreateMessage} />
                    <Route exact path="/" component={MessageCenter} />
                </Switch>
            </BrowserRouter>
        )
    }
}