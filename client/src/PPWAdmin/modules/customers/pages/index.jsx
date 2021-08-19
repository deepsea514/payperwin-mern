import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Customers from "./Customers";
import CustomerDetail from "./CustomerDetail";
import CustomerEdit from "./CustomerEdit";
import CUstomerProfile from "./CustomerProfile";

export default class CustomerModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/customers">
                <Switch>
                    <Route exact path="/" component={Customers} />
                    {/* <Route path="/:id/edit" component={CustomerEdit} /> */}
                    <Route path="/:id/detail" component={CustomerDetail} />
                    <Route path="/:id/profile" component={CUstomerProfile} />
                </Switch>
            </BrowserRouter>
        )
    }
}