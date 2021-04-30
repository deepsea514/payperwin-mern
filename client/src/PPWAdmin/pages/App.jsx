import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
const config = require('../../../../config.json');
const serverUrl = config.appAdminUrl;
import axios from 'axios';

import { Layout } from "../_metronic/layout";
import AdminDashboard from "../modules/dashboard/pages/AdminDashboard.jsx";
import CustomerModule from "../modules/customers/pages";
import BetActivityModule from "../modules/bet_activities/pages";
import DepositLogModule from "../modules/depositlogs/pages";
import WithdrawLogModule from "../modules/withdrawlogs/pages";
import EventModule from "../modules/events/pages";
import WagerFeedsModule from "../modules/wager-feed/pages";
import AutoBet from "../modules/autobet/pages/AutoBet";
import EmailTemplatesModule from "../modules/email-templates/pages";
import PromotionModule from "../modules/promotions/pages";
import KYC from "../modules/kyc/pages";
import TicketsModule from "../modules/tickets/pages";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkUser();
    }

    checkUser = () => {
        const url = `${serverUrl}/user?compress=false`;
        axios.get(url, {
            withCredentials: true,
            cache: {
                exclude: {
                    filter: () => true,
                },
            },
        }).then(({ data: user }) => {
            // this.props.history.push("/");
        }).catch(err => {
            this.props.history.push("/login");
        })
    }

    render() {
        const { history } = this.props;
        return (
            <Layout history={history}>
                <Switch>
                    {/* <BrowserRouter basename="PPWAdmin"> */}

                    {/* dashboard */}
                    <Route path="/dashboard" component={AdminDashboard} />

                    {/* customers */}
                    <Route path="/customers" component={CustomerModule} />

                    {/* bet activities */}
                    <Route path="/bet-activities" component={BetActivityModule} />

                    {/* withdraw */}
                    <Route path="/withdraw-log" component={WithdrawLogModule} />

                    {/* deposit */}
                    <Route path="/deposit-log" component={DepositLogModule} />

                    {/* events */}
                    <Route path="/events" component={EventModule} />

                    {/* wager feeds */}
                    <Route path="/wager-feeds" component={WagerFeedsModule} />

                    {/* autobet */}
                    <Route path="/autobet" component={AutoBet} />

                    {/* email templates */}
                    <Route path="/email-templates" component={EmailTemplatesModule} />

                    {/* promotions */}
                    <Route path="/promotions" component={PromotionModule} />

                    {/* KYC(Know Your Customers) */}
                    <Route path="/kyc" component={KYC} />

                    {/* Support Ticket Module */}
                    <Route path="/tickets" component={TicketsModule} />

                    <Redirect exact from="/" to="/dashboard" />

                    <Redirect to="/dashboard" />
                </Switch>
                {/* </BrowserRouter> */}
            </Layout>
        );
    }
}