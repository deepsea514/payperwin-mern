import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import AuthWrap from "./authWrap";
import AdminWrap from "../PPWAdmin/AdminWrap";
import Maintenance from "./Maintenance";
import { I18nProvider, MetronicI18nProvider, setLanguage } from "../PPWAdmin/_metronic/i18n";
import store, { persistor } from "../PPWAdmin/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";

const config = require('../../../config.json');
const serverUrl = config.appUrl;

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            maintenance: false
        };
    }

    componentDidMount() {
        // setLanguage('ch');
        this.setState({ loading: true })
        axios.get(`${serverUrl}/frontend/maintenance_mode`)
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
                                    <Route path="/PPWAdmin" component={AdminWrap} />
                                    {maintenance ? <Route path="/maintenance" component={Maintenance} /> : null}
                                    {maintenance ? <Redirect to="/maintenance" /> : <Route exact path="/" render={(props) => <AuthWrap {...props} maintenance={maintenance} />} />}
                                </Switch>
                            </BrowserRouter>
                        </I18nProvider>
                    </MetronicI18nProvider>
                </PersistGate>
            </Provider>
        );
    }
}