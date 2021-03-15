import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import EmailTemplates from "./EmailTemplates";
import EditEmailTemplate from "./EditEmailTemplate";

export default class EmailTemplatesModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/email-templates">
                <Switch>
                    <Route path="/edit/:title" component={EditEmailTemplate} />
                    <Route exact path="/" component={EmailTemplates} />
                </Switch>
            </BrowserRouter>
        )
    }
}