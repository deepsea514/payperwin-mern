import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from "./pages/Login";
import App from "./pages/App";
import axios from 'axios';
import update from 'immutability-helper';
const config = require('../../../config.json');
const serverUrl = config.appAdminUrl;

import "./assets/css/themes/layout/header/base/light.css";
import "./assets/css/themes/layout/header/menu/light.css";
import "./assets/css/themes/layout/brand/dark.css";
import "./assets/css/themes/layout/aside/dark.css";

import { I18nProvider } from "./_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "./_metronic/layout";

import {
    MetronicLayoutProvider,
    MetronicSplashScreenProvider,
    MetronicSubheaderProvider
} from "./_metronic/layout";
import { MetronicI18nProvider } from "./_metronic/i18n";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./_metronic/_assets/plugins/flaticon/flaticon.css";
import "./_metronic/_assets/plugins/flaticon2/flaticon.css";
import "./_metronic/_assets/plugins/keenthemes-icons/font/ki.css";
import * as _redux from "./redux";

_redux.setupAxios(axios);

const MTheme = React.lazy(() => import('./theme'));

export default class AdminWrap extends Component {
    render() {
        // const { user, getUser } = this.state;
        return (
            <MetronicI18nProvider>
                <MetronicLayoutProvider>
                    <MetronicSubheaderProvider>
                        <MetronicSplashScreenProvider>
                            <Provider store={store}>
                                <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
                                    <React.Suspense fallback={<LayoutSplashScreen />}>
                                        <MTheme />
                                        <MaterialThemeProvider>
                                            <I18nProvider>
                                                <BrowserRouter basename={"PPWAdmin"}>
                                                    <Switch>
                                                        <Route path={`/login`} component={Login} />
                                                        <Route path="/" component={App} />
                                                    </Switch>
                                                </BrowserRouter>
                                            </I18nProvider>
                                        </MaterialThemeProvider>
                                    </React.Suspense>
                                </PersistGate>
                            </Provider>
                        </MetronicSplashScreenProvider>
                    </MetronicSubheaderProvider>
                </MetronicLayoutProvider>
            </MetronicI18nProvider>
        );
    }
}
