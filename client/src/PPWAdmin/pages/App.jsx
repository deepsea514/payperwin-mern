import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import * as currentUser from "../redux/reducers";
const config = require('../../../../config.json');
const serverUrl = config.serverHostToClientHost[window.location.host].appAdminUrl;
const AdminRoles = config.AdminRoles;
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
import CashbackModule from "../modules/cashback/pages";

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

    isAvailable = (module) => {
        const { currentUser } = this.props;
        if (currentUser) {
            if (AdminRoles[currentUser.role] && AdminRoles[currentUser.role][module])
                return true;
            return false;
        }
        return true;
    }

    render() {
        const { history, currentUser } = this.props;
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
                    {this.isAvailable('admins') && <Route path="/admin" component={AdminModule} />}

                    {/* customers */}
                    {this.isAvailable('customers') && <Route path="/customers" component={CustomerModule} />}

                    {/* bet activities */}
                    {this.isAvailable('bet_activities') && <Route path="/bet-activities" component={BetActivityModule} />}

                    {/* withdraw */}
                    {this.isAvailable('withdraw_logs') && <Route path="/withdraw-log" component={WithdrawLogModule} />}

                    {/* deposit */}
                    {this.isAvailable('deposit_logs') && <Route path="/deposit-log" component={DepositLogModule} />}

                    {/* events */}
                    {this.isAvailable('events') && <Route path="/events" component={EventModule} />}

                    {/* autobet */}
                    {this.isAvailable('autobet') && <Route path="/autobet" component={AutoBet} />}

                    {/* email templates */}
                    {this.isAvailable('email_templates') && <Route path="/email-templates" component={EmailTemplatesModule} />}

                    {/* promotions */}
                    {this.isAvailable('promotions') && <Route path="/promotions" component={PromotionModule} />}

                    {/* KYC(Know Your Customers) */}
                    {this.isAvailable('kyc') && <Route path="/kyc" component={KYC} />}

                    {/* Support Ticket Module */}
                    {this.isAvailable('tickets') && <Route path="/tickets" component={TicketsModule} />}

                    {/* Support FAQ Module */}
                    {this.isAvailable('faq') && <Route path="/faq" component={FAQModule} />}

                    {/* Message Center Module */}
                    {this.isAvailable('messages') && <Route path="/message-center" component={MessageCenterModule} />}

                    {/* meta tags */}
                    {this.isAvailable('meta_tags') && <Route path="/meta-tags" component={MetaTagsModule} />}

                    {/* Addons */}
                    {this.isAvailable('addons') && <Route path="/addons" component={Addons} />}

                    {/* Reports */}
                    {this.isAvailable('reports') && <Route path="/reports" component={ReportsModule} />}

                    {/* Articles */}
                    {this.isAvailable('articles') && <Route path="/articles" component={ArticlesModule} />}

                    {/* Frontend */}
                    {this.isAvailable('frontend') && <Route path="/frontend" component={FrontendManageModule} />}

                    {/* Cashback */}
                    {this.isAvailable('cashback') && <Route path="/cashback" component={CashbackModule} />}

                    <Redirect exact from="/" to="/dashboard" />

                    <Redirect to="/dashboard" />
                </Switch>
                {/* </BrowserRouter> */}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.currentUser.currentUser,
});


export default connect(mapStateToProps, currentUser.actions)(App)