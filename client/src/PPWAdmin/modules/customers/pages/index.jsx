import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Customers from "./Customers";
import CustomerDetail from "./CustomerDetail";
import CustomerEdit from "./CustomerEdit";
import CUstomerProfile from "./CustomerProfile";
import BetDetail from "../../bet_activities/pages/BetDetail";

export default class CustomerModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021">
                <Switch>
                    <Route exact path="/users" component={Customers} />
                    {/* <Route path="/:id/edit" component={CustomerEdit} /> */}
                    {/* <Route path="/:id/detail" component={CustomerDetail} /> */}
                    <Route path="/users/:id/profile" component={CUstomerProfile} />
                    <Route path="/bet-activities/:id/detail" component={BetDetail} />

                </Switch>
            </BrowserRouter>
        )
    }
}