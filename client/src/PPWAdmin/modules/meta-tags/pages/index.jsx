import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import MetaTags from "./MetaTags";
import EditMetaTags from "./EditMetaTags";

export default class MetaTagsModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/meta-tags">
                <Switch>
                    <Route path="/edit/:title" component={EditMetaTags} />
                    <Route exact path="/" component={MetaTags} />
                </Switch>
            </BrowserRouter>
        )
    }
}