import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import WagerFeeds from "./WagerFeeds";
import WagerFeedDetail from "./WagerFeedDetail";

export default class WagerFeedsModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/wager-feeds">
                <Switch>
                    <Route exact path="/" component={WagerFeeds} />
                    <Route path="/:id/detail" component={WagerFeedDetail} />
                </Switch>
            </BrowserRouter>
        )
    }
}