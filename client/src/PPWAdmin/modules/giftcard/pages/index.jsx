import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import GiftCards from "./GiftCards";

export default class GiftCardsModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/gift-cards">
                <Switch>
                    <Route exact path="/" component={GiftCards} />
                </Switch>
            </BrowserRouter>
        )
    }
}