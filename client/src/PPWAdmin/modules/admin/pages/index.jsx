import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Admins from './Admins';
import CreateAdmin from "./CreateAdmin";
import EditAdmin from './EditAdmin';

export default class AdminModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/admin">
                <Switch>
                    <Route path="/create" component={CreateAdmin} />
                    <Route path="/edit/:id" component={EditAdmin} />
                    <Route exact path="/" component={Admins} />
                </Switch>
            </BrowserRouter>
        )
    }
}