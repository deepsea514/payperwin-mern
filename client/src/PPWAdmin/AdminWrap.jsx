import React, { Component } from 'react';
// import "react-app-polyfill/ie11";
// import "react-app-polyfill/stable";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from "./pages/Login";
import App from "./pages/App";
import axios from 'axios';
import update from 'immutability-helper';
import Favicon from 'react-favicon';
import _env from '../env.json';
const serverUrl = _env.appUrl;

// import "./assets/css/style.bundle.css";
// import "./assets/css/themes/layout/header/base/light.css";
// import "./assets/css/themes/layout/header/menu/light.css";
// import "./assets/css/themes/layout/brand/dark.css";
// import "./assets/css/themes/layout/aside/dark.css";

import './index.scss';

import { LayoutSplashScreen, MaterialThemeProvider } from "./_metronic/layout";

import {
    MetronicLayoutProvider,
    MetronicSplashScreenProvider,
    MetronicSubheaderProvider
} from "./_metronic/layout";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./_metronic/_assets/plugins/flaticon/flaticon.css";
import "./_metronic/_assets/plugins/flaticon2/flaticon.css";
import "./_metronic/_assets/plugins/keenthemes-icons/font/ki.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import * as _redux from "./redux";

_redux.setupAxios(axios);

const MTheme = React.lazy(() => import('./theme'));

export default class AdminWrap extends Component {
    render() {
        return (
            <MetronicLayoutProvider>
                <MetronicSubheaderProvider>
                    <MetronicSplashScreenProvider>
                        {/* <Provider store={store}>
                            <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}> */}
                        <React.Suspense fallback={<LayoutSplashScreen />}>
                            <Favicon url={'/images/favicon-2.ico'} />
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
                        {/* </PersistGate>
                        </Provider> */}
                    </MetronicSplashScreenProvider>
                </MetronicSubheaderProvider>
            </MetronicLayoutProvider>
        );
    }
}
