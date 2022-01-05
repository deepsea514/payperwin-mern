import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Promotions from "./Promotions";
import PromotionDetail from "./PromotionDetail";
import PromotionBanners from './PromotionBanners';

export default class PromotionModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/promotions">
                <Switch>
                    <Route path="/:id/detail" component={PromotionDetail} />
                    <Route path="/banners" component={PromotionBanners} />
                    <Route exact path="/" component={Promotions} />
                </Switch>
            </BrowserRouter>
        )
    }
}