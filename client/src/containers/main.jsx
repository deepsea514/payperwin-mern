import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import App from './app';
import AdminWrap from "../PPWAdmin/AdminWrap";
import AffiliateWrap from "../Affiliate/AffiliateWrap";
import Maintenance from "./Maintenance";
import { I18nProvider, MetronicI18nProvider, setLanguage } from "../PPWAdmin/_metronic/i18n";
import store, { persistor } from "../PPWAdmin/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { getMaintenanceMode } from '../redux/services';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            maintenance: false
        };
    }

    componentDidMount() {
        this.setState({ loading: true })
        getMaintenanceMode()
            .then(({ data }) => {
                if (data)
                    this.setState({
                        loading: false,
                        maintenance: data ? data.value.maintenance : false
                    })
            })
            .catch(() => {
                this.setState({ loading: false, maintenance: false })
            })
    }

    render() {
        const { maintenance } = this.state;
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <MetronicI18nProvider>
                        <I18nProvider>
                            <BrowserRouter basename="">
                                <Switch>
                                    <Route path="/RP1021" render={(props) => <AdminWrap {...props} />} />
                                    <Route path="/affiliate" render={(props) => <AffiliateWrap {...props} />} />
                                    <Route path="/maintenance" render={(props) => <Maintenance maintenance={maintenance} {...props} />} />
                                    {maintenance ? <Redirect to="/maintenance" /> : <Route path="/" render={(props) => <App {...props} />} />}
                                </Switch>
                            </BrowserRouter>
                        </I18nProvider>
                    </MetronicI18nProvider>
                </PersistGate>
            </Provider>
        );
    }
}