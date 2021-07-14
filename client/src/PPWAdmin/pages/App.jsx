import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import * as currentUser from "../redux/reducers";
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
import FAQModule from "../modules/faq/pages";
import GenerateToken from "./GenrateToken";
import MessageCenterModule from "../modules/message-center/pages";
import ActiveUsersModule from "../modules/active_users/pages";
import MetaTagsModule from "../modules/meta-tags/pages";
import Addons from "../modules/addons/pages/Addons";
import ReportsModule from "../modules/reports";
import ArticlesModule from "../modules/articles/pages";
import FrontendManageModule from "../modules/frontend/pages";
import ChangePassword from './ChangePassword';
import AdminModule from "../modules/admin/pages";

class App extends Component {
    constructor(props) {
        super(props);

        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
        this.checkUser();
    }

    checkUser = () => {
        const { setCurrentUserAction } = this.props;
        const url = `${serverUrl}/user`;
        axios.get(url, {
            withCredentials: true,
            cache: {
                exclude: {
                    filter: () => true,
                },
            },
        }).then(({ data: user }) => {
            this._Mounted && setCurrentUserAction(user);
        }).catch(err => {
            this._Mounted && setCurrentUserAction(null);
            this.props.history.push("/login");
        })
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    render() {
        const { history } = this.props;
        return (
            <Layout history={history}>
                <Switch>
                    {/* <BrowserRouter basename="PPWAdmin"> */}

                    {/* change password */}
                    <Route path="/change-password" component={ChangePassword} />

                    {/* token */}
                    <Route path="/token" component={GenerateToken} />

                    {/* dashboard */}
                    <Route path="/dashboard" component={AdminDashboard} />

                    {/* Admin */}
                    <Route path="/admin" component={AdminModule} />

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

                    {/* Support FAQ Module */}
                    <Route path="/faq" component={FAQModule} />

                    {/* Message Center Module */}
                    <Route path="/message-center" component={MessageCenterModule} />

                    {/* Active Users */}
                    <Route path="/active-users" component={ActiveUsersModule} />

                    {/* meta tags */}
                    <Route path="/meta-tags" component={MetaTagsModule} />

                    {/* Addons */}
                    <Route path="/addons" component={Addons} />

                    {/* Reports */}
                    <Route path="/reports" component={ReportsModule} />

                    {/* Articles */}
                    <Route path="/articles" component={ArticlesModule} />

                    {/* Frontend */}
                    <Route path="/frontend" component={FrontendManageModule} />

                    <Redirect exact from="/" to="/dashboard" />

                    <Redirect to="/dashboard" />
                </Switch>
                {/* </BrowserRouter> */}
            </Layout>
        );
    }
}

export default connect(null, currentUser.actions)(App)