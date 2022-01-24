import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Favicon from 'react-favicon';
import Login from "./pages/Login";
import App from "./pages/App";
import AdminAPI from './redux/adminAPI';
import { LayoutSplashScreen, MaterialThemeProvider } from "./_metronic/layout";

import './index.scss';
import {
    MetronicLayoutProvider,
    MetronicSplashScreenProvider,
    MetronicSubheaderProvider
} from "./_metronic/layout";
import "./_metronic/_assets/plugins/flaticon/flaticon.css";
import "./_metronic/_assets/plugins/flaticon2/flaticon.css";
import "./_metronic/_assets/plugins/keenthemes-icons/font/ki.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import * as _redux from "./redux";

_redux.setupAxios(AdminAPI);

const MTheme = React.lazy(() => import('./theme'));

export default class AdminWrap extends Component {
    render() {
        return (
            <MetronicLayoutProvider>
                <MetronicSubheaderProvider>
                    <MetronicSplashScreenProvider>
                        <React.Suspense fallback={<LayoutSplashScreen />}>
                            <Favicon url={'/images/favicon.png'} />
                            <MTheme />
                            <MaterialThemeProvider>
                                <BrowserRouter basename={"RP1021"}>
                                    <Switch>
                                        <Route path={`/login`} component={Login} />
                                        <Route path="/" component={App} />
                                    </Switch>
                                </BrowserRouter>
                            </MaterialThemeProvider>
                        </React.Suspense>
                    </MetronicSplashScreenProvider>
                </MetronicSubheaderProvider>
            </MetronicLayoutProvider>
        );
    }
}
