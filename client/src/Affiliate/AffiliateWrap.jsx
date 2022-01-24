import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Favicon from 'react-favicon';
import AffiliateAPI from './redux/affiliateAPI';
import * as _redux from "../PPWAdmin/redux";
import App from './App';

_redux.setupAxios(AffiliateAPI, "affiliate-token");

export default class AffiliateWrap extends Component {
    render() {
        return (
            <>
                <Favicon url={'/images/favicon.png'} />
                <BrowserRouter basename={"affiliate"}>
                    <App />
                </BrowserRouter>
            </>
        );
    }
}
