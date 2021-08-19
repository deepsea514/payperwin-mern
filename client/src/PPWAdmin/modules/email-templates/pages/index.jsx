import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import EmailTemplates from "./EmailTemplates";
import EditEmailTemplate from "./EditEmailTemplate";
import CreateEmailTemplate from "./CreateEmailTemplate";

export default class EmailTemplatesModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/email-templates">
                <Switch>
                    <Route path="/edit/:title" component={EditEmailTemplate} />
                    <Route path="/create" component={CreateEmailTemplate} />
                    <Route exact path="/" component={EmailTemplates} />
                </Switch>
            </BrowserRouter>
        )
    }
}