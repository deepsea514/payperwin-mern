import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Promotions from "./Promotions";
import PromotionDetail from "./PromotionDetail";

export default class PromotionModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/PPWAdmin/promotions">
                <Switch>
                    <Route path="/:id/detail" component={PromotionDetail} />
                    <Route exact path="/" component={Promotions} />
                </Switch>
            </BrowserRouter>
        )
    }
}