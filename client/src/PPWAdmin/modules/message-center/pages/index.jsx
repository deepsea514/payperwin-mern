import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MessageCenter from "./MessageCenter";
import CreateMessage from "./CreateMessage";
import EditMessage from "./EditMessage";

export default class MessageCenterModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/message-center">
                <Switch>
                    <Route path="/edit/:id" component={EditMessage} />
                    <Route path="/create" component={CreateMessage} />
                    <Route exact path="/" component={MessageCenter} />
                </Switch>
            </BrowserRouter>
        )
    }
}