import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import * as adminUser from "../redux/reducers";
import config from '../../../../config.json';
const AdminRoles = config.AdminRoles;

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
import ReportsModule from "../modules/reports/pages";
import ArticlesModule from "../modules/articles/pages";
import FrontendManageModule from "../modules/frontend/pages";
import ChangePassword from './ChangePassword';
import AdminModule from "../modules/admin/pages";
import CashbackModule from "../modules/cashback/pages";
import ErrorLogsModule from "../modules/errorlogs/pages";
import PlaceBet from "../modules/placebet/pages/PlaceBet";
import ErrorBoundary from '../../libs/ErrorBoundary';
import CreditsModule from '../modules/credit/pages';
import Prediction from '../modules/prediction/pages';
import GiftCardsModule from '../modules/giftcard/pages';
import MismatchScoresModule from '../modules/mismatchscores/pages';
import TeamModule from "../modules/team/pages";
import AffiliatesModule from "../modules/affiliate/pages";
import { getUser } from '../redux/services';

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
        const { setAdminUserAction } = this.props;
        getUser()
            .then(({ data: user }) => {
                this._Mounted && setAdminUserAction(user);
            })
            .catch(err => {
                this._Mounted && setAdminUserAction(null);
                this.props.history.push("/login");
            })
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    isAvailable = (module) => {
        const { adminUser } = this.props;
        if (adminUser) {
            if (AdminRoles[adminUser.role] && AdminRoles[adminUser.role][module])
                return true;
            return false;
        }
        return true;
    }

    render() {
        const { history } = this.props;
        return (
            <Layout history={history}>
                {/* <BrowserRouter basename="RP1021"> */}
                <Switch>
                    {/* change password */}
                    <Route path="/change-password" render={(props) =>
                        <ErrorBoundary><ChangePassword {...props} /></ErrorBoundary>
                    } />

                    {/* token */}
                    <Route path="/token" render={(props) =>
                        <ErrorBoundary><GenerateToken {...props} /></ErrorBoundary>
                    } />

                    {/* dashboard */}
                    <Route path="/dashboard" render={(props) =>
                        <ErrorBoundary><AdminDashboard {...props} /></ErrorBoundary>
                    } />

                    {/* Admin */}
                    {this.isAvailable('admins') && <Route path="/admin" render={(props) =>
                        <ErrorBoundary><AdminModule {...props} /></ErrorBoundary>
                    } />}

                    {/* customers */}
                    {this.isAvailable('users') && <Route path="/users" render={(props) =>
                        <ErrorBoundary><CustomerModule {...props} /></ErrorBoundary>
                    } />}

                    {/* bet activities */}
                    {this.isAvailable('bet_activities') && <Route path="/bet-activities" render={(props) =>
                        <ErrorBoundary><BetActivityModule {...props} /></ErrorBoundary>
                    } />}

                    {/* withdraw */}
                    {this.isAvailable('withdraw_logs') && <Route path="/withdraw-log" render={(props) =>
                        <ErrorBoundary><WithdrawLogModule {...props} /></ErrorBoundary>
                    } />}

                    {/* deposit */}
                    {this.isAvailable('deposit_logs') && <Route path="/deposit-log" render={(props) =>
                        <ErrorBoundary><DepositLogModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Gift Cards */}
                    {this.isAvailable('deposit_logs') && <Route path="/gift-cards" render={(props) =>
                        <ErrorBoundary><GiftCardsModule {...props} /></ErrorBoundary>
                    } />}

                    {/* events */}
                    {this.isAvailable('custom-events') && <Route path="/custom-events" render={(props) =>
                        <ErrorBoundary><EventModule {...props} /></ErrorBoundary>
                    } />}

                    {/* autobet */}
                    {this.isAvailable('autobet') && <Route path="/autobet" render={(props) =>
                        <ErrorBoundary><AutoBet {...props} /></ErrorBoundary>
                    } />}

                    {/* Placebet */}
                    {this.isAvailable('placebet') && <Route path="/placebet" component={PlaceBet} />}


                    {/* email templates */}
                    {this.isAvailable('email_templates') && <Route path="/email-templates" render={(props) =>
                        <ErrorBoundary><EmailTemplatesModule {...props} /></ErrorBoundary>
                    } />}

                    {/* promotions */}
                    {this.isAvailable('promotions') && <Route path="/promotions" render={(props) =>
                        <ErrorBoundary><PromotionModule {...props} /></ErrorBoundary>
                    } />}

                    {/* KYC(Know Your Customers) */}
                    {this.isAvailable('kyc') && <Route path="/kyc" render={(props) =>
                        <ErrorBoundary><KYC {...props} /></ErrorBoundary>
                    } />}

                    {/* Support Ticket Module */}
                    {this.isAvailable('support-tickets') && <Route path="/support-tickets" render={(props) =>
                        <ErrorBoundary><TicketsModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Support FAQ Module */}
                    {this.isAvailable('faq') && <Route path="/faq" render={(props) =>
                        <ErrorBoundary><FAQModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Message Center Module */}
                    {this.isAvailable('messages') && <Route path="/message-center" render={(props) =>
                        <ErrorBoundary><MessageCenterModule {...props} /></ErrorBoundary>
                    } />}

                    {/* meta tags */}
                    {this.isAvailable('page-metas') && <Route path="/page-metas" render={(props) =>
                        <ErrorBoundary><MetaTagsModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Addons */}
                    {this.isAvailable('api-settings') && <Route path="/api-settings" render={(props) =>
                        <ErrorBoundary><Addons {...props} /></ErrorBoundary>
                    } />}

                    {/* Reports */}
                    {this.isAvailable('reports') && <Route path="/reports" render={(props) =>
                        <ErrorBoundary><ReportsModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Articles */}
                    {this.isAvailable('articles') && <Route path="/articles" render={(props) =>
                        <ErrorBoundary><ArticlesModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Frontend */}
                    {this.isAvailable('frontend') && <Route path="/frontend" render={(props) =>
                        <ErrorBoundary><FrontendManageModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Cashback */}
                    {this.isAvailable('cashback') && <Route path="/cashback" render={(props) =>
                        <ErrorBoundary><CashbackModule {...props} /></ErrorBoundary>
                    } />}

                    {/* ErrorLogs */}
                    {this.isAvailable('errorlogs') && <Route path="/errorlogs" render={(props) =>
                        <ErrorBoundary><ErrorLogsModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Credits */}
                    {this.isAvailable('credits') && <Route path="/credits" render={(props) =>
                        <ErrorBoundary><CreditsModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Prediction */}
                    {this.isAvailable('predictions') && <Route path="/predictions" render={(props) =>
                        <ErrorBoundary><Prediction {...props} /></ErrorBoundary>
                    } />}

                    {/* Mismatch Scores */}
                    {this.isAvailable('bet_activities') && <Route path="/mismatch-scores" render={(props) =>
                        <ErrorBoundary><MismatchScoresModule {...props} /></ErrorBoundary>
                    } />}

                    {/* Team Module */}
                    <Route path="/team" render={(props) =>
                        <ErrorBoundary><TeamModule {...props} /></ErrorBoundary>
                    } />

                    <Route path="/affiliates" render={(props) =>
                        <ErrorBoundary><AffiliatesModule {...props} /></ErrorBoundary>
                    } />

                    <Redirect exact from="/" to="/dashboard" />
                    <Redirect to="/dashboard" />
                </Switch>
                {/* </BrowserRouter> */}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    adminUser: state.adminUser.adminUser,
});


export default connect(mapStateToProps, adminUser.actions)(App)