import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthWrap from "./authWrap";
import AdminWrap from "../PPWAdmin/AdminWrap";
import { I18nProvider, MetronicI18nProvider, setLanguage } from "../PPWAdmin/_metronic/i18n";
import store, { persistor } from "../PPWAdmin/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default class Main extends Component {
    // componentDidMount() {
    //     setLanguage('ch');
    // }
    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <MetronicI18nProvider>
                        <I18nProvider>
                            <BrowserRouter basename="">
                                <Switch>
                                    <Route path="/PPWAdmin" component={AdminWrap} />
                                    <Route component={AuthWrap} />
                                </Switch>
                            </BrowserRouter>
                        </I18nProvider>
                    </MetronicI18nProvider>
                </PersistGate>
            </Provider>
        );
    }
}