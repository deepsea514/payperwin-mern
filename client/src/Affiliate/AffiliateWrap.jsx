import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Favicon from 'react-favicon';
import AffiliateAPI from './redux/affiliateAPI';
import { LayoutSplashScreen, MaterialThemeProvider } from "../PPWAdmin/_metronic/layout";
import {
    MetronicLayoutProvider,
    MetronicSplashScreenProvider,
    MetronicSubheaderProvider
} from "../PPWAdmin/_metronic/layout";
import * as _redux from "../PPWAdmin/redux";
import App from './App';

_redux.setupAxios(AffiliateAPI, "affiliate-token");

const MTheme = React.lazy(() => import('../PPWAdmin/theme'));

export default class AffiliateWrap extends Component {
    render() {
        return (
            <MetronicLayoutProvider>
                <MetronicSubheaderProvider>
                    <MetronicSplashScreenProvider>
                        <React.Suspense fallback={<LayoutSplashScreen />}>
                            <Favicon url={'/images/favicon.png'} />
                            <MTheme />
                            <MaterialThemeProvider>
                                <BrowserRouter basename={"affiliate"}>
                                    <App />
                                </BrowserRouter>
                            </MaterialThemeProvider>
                        </React.Suspense>
                    </MetronicSplashScreenProvider>
                </MetronicSubheaderProvider>
            </MetronicLayoutProvider>
        );
    }
}
