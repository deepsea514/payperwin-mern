import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import FAQ from "./FAQ";
import FAQItems from "./FAQItems";

export default class FAQModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/faq">
                <Switch>
                    <Route path="/:id/items" component={FAQItems} />
                    <Route path="/" component={FAQ} />
                </Switch>
            </BrowserRouter>
        )
    }
}