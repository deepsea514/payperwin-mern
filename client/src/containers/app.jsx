import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import Favicon from 'react-favicon';
import Registration from '../pages/registration';
import PasswordRecovery from '../pages/passwordRecovery';
import Sports from '../pages/sports';
import Sport from '../components/sport';
import Lines from '../pages/lines';
import Header from '../components/header';
import Footer from '../components/footer';
import OpenBets from '../pages/openbets';
import Deposit from '../pages/deposit';
import Withdrawal from '../pages/withdrawal';
import HowTo from '../pages/howto';
import BetSlip from '../components/betSlip';
import resObjPath from '../libs/resObjPath';
import { setTitle } from '../libs/documentTitleBuilder';
import Profile from "../pages/profile";
import Menu from "../components/menu";
import SidebarAccount from "../components/sidebaraccount";
import SidebarSports from "../components/sidebarsports";
import NewPasswordFromToken from "../pages/newPasswordFromToken";
import Preferences from "../pages/preferences";
import Faq from "../pages/faq";
import Inbox from "../pages/inbox";
import PaymentOptions from "../pages/paymentoptions";
import TransactionHistory from "../pages/transactionhistory";
import Security from "../pages/security";
import SelfExcusion from "../pages/selfexcusion";
import Deactivation from "../pages/deactivation";
import PrivacyPolicy from "../pages/privacyPolicy";
import TermsAndConditions from "../pages/termsAndConditions";
import BettingRules from "../pages/bettingRules";
import DepositETransfer from "../pages/depositEtransfer";
import DepositTripleA from "../pages/depositTripleA";
import WithdrawETransfer from "../pages/withdrawEtransfer";
import WithdrawTripleA from "../pages/withdrawTripleA";
import Dashboard from "../pages/dashboard";
import Verification from "../pages/verification";
import VerificationNotify from "../components/verificationNotify";
import VerificationProof from "../components/verificationProof";
import ContactUs from "../pages/contactUs";
import GoToTop from "../components/gotoTop";
import TfaModal from "../components/tfamodal";
import Others from "../components/others";
import BetStatus from "../components/betStatus";
import Articles from "../pages/articles";
import PhoneVerification from "../pages/phoneVerification";
import Cashback from "../pages/cashback";
import CashbackNames from "../components/cashbackNames";
import SportName from "../pages/sportName";
import CustomBets from '../pages/custombets';
import SportsLeagues from '../pages/sportleagues';
import AutobetSettings from '../pages/AutobetSettings';
import AutobetDashboard from '../pages/AutobetDashboard';
import Prize from '../pages/prize';
import Loyalty from '../pages/loyalty';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { FormattedMessage, injectIntl } from "react-intl";
import ErrorBoundary from '../libs/ErrorBoundary';
import Search from '../pages/search';
import SportsBreadcrumb from '../components/sportsbreadcrumb';

import '../style/all.css';
import '../style/all.min.css';
import '../style/bootstrap.min.css';
import '../style/dark.css';
import '../style/style2.css';
import '../style/style3.css';
import '../style/responsive.css';

const ShowAccountLinks = [
    '/bets',
    '/deposit',
    '/announcements',
    '/deactivation',
    '/details',
    '/history',
    '/inbox',
    '/payment-options',
    '/personal-details',
    '/preferences',
    '/security',
    '/self-exclusion',
    '/transaction-history',
    '/withdraw',
    '/account',
    '/deposit-etransfer',
    '/withdraw-etransfer',
    '/deposit-bitcoin',
    '/deposit-ethereum',
    '/deposit-tether',
    '/withdraw-bitcoin',
    '/withdraw-ethereum',
    '/withdraw-tether',
    '/verification',
    '/phone-verification',
    '/cashback',
    '/custom-bets',
    '/autobet-dashboard',
    '/autobet-settings',
    '/loyalty',
    '/support',
];

const exceptDarkLinks = [
    '/articles',
    '/signup',
    '/bets',
    '/deposit',
    '/announcements',
    '/deactivation',
    '/details',
    '/history',
    '/inbox',
    '/payment-options',
    '/personal-details',
    '/preferences',
    '/security',
    '/self-exclusion',
    '/transaction-history',
    '/withdraw',
    '/account',
    '/deposit-etransfer',
    '/withdraw-etransfer',
    '/deposit-bitcoin',
    '/deposit-ethereum',
    '/deposit-tether',
    '/withdraw-bitcoin',
    '/withdraw-ethereum',
    '/withdraw-tether',
    '/verification',
    '/phone-verification',
    '/cashback',
    '/support',
    '/custom-bets',
    '/autobet-dashboard',
    '/autobet-settings',
    '/loyalty',
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolledTop: true,
            menuOpen: false,
            sportsMenuMobileOpen: false,
            accountMenuMobileOpen: false,
            openBetSlipMenu: false,
            betSlip: [],
        };
        setTitle({ siteName: 'PAYPER WIN', tagline: 'Risk Less, Win More', delimiter: '|' });
    }

    componentDidMount() {
        const { setDisplayModeBasedOnSystem, getUser } = this.props;
        window.addEventListener("scroll", this.updateScrollStatus);
        setInterval(() => setDisplayModeBasedOnSystem(), 1000);
        setDisplayModeBasedOnSystem();

        getUser(this.redirectToDashboard);
    }

    redirectToDashboard = (user) => {
        const { history, location } = this.props;
        const { pathname } = location;
        if (user == false) {
            if (ShowAccountLinks.includes(pathname)) {
                history.push('/');
            }
        }
    }

    updateScrollStatus = () => {
        const { scrollY } = window;
        this.scrollTop = scrollY;
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                const { scrolledTop, displayStartIndex, displayEndIndex } = this.state;
                const scrolledTopNow = this.scrollTop < 50;
                const scrolledTopChanged = scrolledTop !== scrolledTopNow;
                this.ticking = false;
                if (scrolledTopChanged) {
                    this.setState({
                        scrolledTop: scrolledTopNow,
                    });
                }
            });
        }
        this.ticking = true;
    }

    toggleField = (fieldName, forceState) => {
        if (typeof this.state[fieldName] !== 'undefined') {
            this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }

    addBet = (bet) => {
        const { name, type, league, odds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin, subtype, sportsbook = false } = bet;
        const newBet = { name, type, subtype, league, odds, pick, stake: 0, win: 0, home, away, sportName, lineId, lineQuery, pickName, index, origin, sportsbook };
        let { betSlip } = this.state;
        betSlip = betSlip.filter(bet => {
            const exists = bet.lineId === lineQuery.lineId &&
                bet.type === lineQuery.type &&
                bet.index === lineQuery.index &&
                bet.subtype == lineQuery.subtype;
            return !exists;
        });
        this.setState({
            betSlip: update(betSlip, {
                $push: [newBet]
            })
        });
    }

    removeBet = (lineId, type, pick, index, subtype = null, all = false) => {
        const { betSlip } = this.state;
        if (all) {
            this.setState({
                betSlip: update(betSlip, {
                    $set: [],
                })
            });
        } else {
            const indexOfBet = betSlip.findIndex((b) => b.lineId === lineId && b.pick === pick && b.type == type && (typeof index === 'number' ? b.index === index : true) && b.subtype == subtype);
            if (typeof indexOfBet === 'number') {
                this.setState({
                    betSlip: update(betSlip, {
                        $splice: [[indexOfBet, 1]]
                    })
                });
            }
        }
    }

    updateBet = (lineQuery, pick, propUpdates, index) => {
        const { betSlip } = this.state;
        const indexOfBet = betSlip.findIndex((b) =>
            b.lineQuery.eventId === lineQuery.eventId &&
            b.lineQuery.type === lineQuery.type &&
            b.lineQuery.subtype === lineQuery.subtype &&
            b.pick === pick &&
            (typeof index === 'number' ? b.index === index : true));
        if (typeof indexOfBet === 'number') {
            this.setState({
                betSlip: update(betSlip, {
                    [indexOfBet]: propUpdates,
                })
            });
        }
    }

    render() {
        const {
            menuOpen,
            sportsMenuMobileOpen,
            accountMenuMobileOpen,
            betSlip,
            openBetSlipMenu,
            scrolledTop,
        } = this.state;
        const { user,
            getUser,
            history,
            location,
            require_2fa,
            dark_light,
            showLoginModalAction
        } = this.props;
        const { pathname } = location;
        let sidebarShowAccountLinks = ShowAccountLinks.includes(pathname);
        const exceptDark = exceptDarkLinks.filter(path => {
            if (pathname.startsWith(path)) return true;
            else return false;
        }).length;
        const fullWidth = [
            '/loyalty',
            '/autobet-dashboard'
        ].includes(pathname);

        sidebarShowAccountLinks = sidebarShowAccountLinks ? sidebarShowAccountLinks : (pathname.search('/inbox') != -1);
        const verified = user && user.roles.verified;

        return (
            <div className={`background dark-theme ${scrolledTop ? 'scrolled-top' : ''}`}>
                <Favicon url={'/images/favicon-2.ico'} />
                <Header
                    toggleField={this.toggleField}
                    user={user}
                    getUser={getUser}
                    history={history}
                    location={location}
                />
                {menuOpen ? <Menu user={user} location={location} toggleField={this.toggleField} /> : null}
                <section className={`main-section ${dark_light == 'dark' && !exceptDark ? 'dark' : ''}`}>
                    {require_2fa && <TfaModal getUser={getUser} />}
                    <div className="container">
                        <Switch>
                            <Route path="/signup" render={(props) =>
                                <ErrorBoundary><Registration getUser={getUser} {...props} /></ErrorBoundary>} />
                            <Route path="/faq" render={(props) => <ErrorBoundary><Faq {...props} /></ErrorBoundary>} />
                            <Route path="/articles" render={(props) => <ErrorBoundary><Articles {...props} /></ErrorBoundary>} />
                            <Route path="/">
                                {() => {
                                    return <div className="row">
                                        <ErrorBoundary>
                                            <SidebarAccount
                                                toggleField={this.toggleField}
                                                sidebarShowAccountLinks={sidebarShowAccountLinks}
                                                accountMenuMobileOpen={accountMenuMobileOpen}
                                                user={user}
                                            />
                                        </ErrorBoundary>
                                        <ErrorBoundary>
                                            <SidebarSports
                                                toggleField={this.toggleField}
                                                sportsMenuMobileOpen={sportsMenuMobileOpen}
                                                sidebarShowAccountLinks={sidebarShowAccountLinks}
                                                showLoginModal={() => showLoginModalAction(true)}
                                                user={user}
                                                getUser={getUser}
                                            />
                                        </ErrorBoundary>
                                        <div className={`${fullWidth ? 'col-md-10' : 'col-md-7'} p-0`}>
                                            <Switch>
                                                <Route path="/newPasswordFromToken" render={(props) =>
                                                    <ErrorBoundary><NewPasswordFromToken {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/passwordRecovery" render={(props) =>
                                                    <ErrorBoundary><PasswordRecovery {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/deposit" render={(props) =>
                                                    <ErrorBoundary><Deposit {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/withdraw" render={(props) =>
                                                    <ErrorBoundary><Withdrawal {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/bets" render={(props) =>
                                                    <ErrorBoundary><OpenBets openBets={true} {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/history" render={(props) =>
                                                    <ErrorBoundary><OpenBets settledBets={true} {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/how-it-works" render={(props) =>
                                                    <ErrorBoundary><HowTo {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/sports" render={(props) =>
                                                    <ErrorBoundary><Sports {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/sport/:sportName/league/:leagueId/event/:eventId" render={(props) =>
                                                    <ErrorBoundary><Lines addBet={this.addBet} betSlip={betSlip}
                                                        removeBet={this.removeBet} {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />
                                                <Route path="/sport/:name/league/:league" render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    const league = resObjPath(match, 'params.league');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <Sport addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet} sportName={name}
                                                                    league={league} user={user} getUser={getUser}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/sport/:name/team/:team" render={(props) => {
                                                    const { match } = props;
                                                    const sportName = resObjPath(match, 'params.name');
                                                    const team = resObjPath(match, 'params.team');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <Sport addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet} sportName={sportName}
                                                                    user={user} getUser={getUser} team={team}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/sport/:name/league" render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <SportsBreadcrumb sportName={name} user={user} />
                                                                <SportsLeagues sportName={name} user={user} getUser={getUser} />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/sport/:name" render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <ErrorBoundary>
                                                            <SportName addBet={this.addBet} betSlip={betSlip}
                                                                removeBet={this.removeBet} sportName={name} />
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/others/:id" render={(props) => {
                                                    const { match } = props;
                                                    const id = resObjPath(match, 'params.id');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <h1>Custom Event</h1>
                                                                <Others {...props} addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet} id={id}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/others" render={(props) => {
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <h1>Custom Events</h1>
                                                                <Others {...props} addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/preferences" render={(props) =>
                                                    <ErrorBoundary><Preferences {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/inbox" render={(props) =>
                                                    <ErrorBoundary><Inbox {...props} getUser={getUser} /></ErrorBoundary>
                                                } />
                                                <Route path="/payment-options" render={(props) =>
                                                    <ErrorBoundary><PaymentOptions {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/transaction-history" render={(props) =>
                                                    <ErrorBoundary><TransactionHistory {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/security" render={(props) =>
                                                    <ErrorBoundary><Security {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />
                                                <Route path="/account" render={(props) =>
                                                    <ErrorBoundary><Profile {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/self-exclusion" render={(props) =>
                                                    <ErrorBoundary><SelfExcusion {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />
                                                <Route path="/deactivation" render={(props) =>
                                                    <ErrorBoundary><Deactivation {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/privacy-policy" render={(props) =>
                                                    <ErrorBoundary><PrivacyPolicy {...props} /> </ErrorBoundary>
                                                } />
                                                <Route path="/terms-and-conditions" render={(props) =>
                                                    <ErrorBoundary><TermsAndConditions {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/betting-rules" render={(props) =>
                                                    <ErrorBoundary><BettingRules {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/deposit-etransfer" render={(props) =>
                                                    <ErrorBoundary><DepositETransfer {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/deposit-bitcoin" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="Bitcoin" /></ErrorBoundary>
                                                } />
                                                <Route path="/deposit-ethereum" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="Ethereum" /></ErrorBoundary>
                                                } />
                                                <Route path="/deposit-tether" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="Tether" /></ErrorBoundary>
                                                } />
                                                <Route path="/withdraw-etransfer" render={(props) =>
                                                    <ErrorBoundary><WithdrawETransfer {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />
                                                <Route path="/withdraw-bitcoin" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="Bitcoin" /></ErrorBoundary>
                                                } />
                                                <Route path="/withdraw-ethereum" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="Ethereum" /></ErrorBoundary>
                                                } />
                                                <Route path="/withdraw-tether" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="Tether" /></ErrorBoundary>
                                                } />
                                                <Route path="/verification" render={(props) =>
                                                    <ErrorBoundary><Verification {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/phone-verification" render={(props) =>
                                                    <ErrorBoundary><PhoneVerification {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />
                                                <Route path="/cashback" render={(props) =>
                                                    <ErrorBoundary><Cashback {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/custom-bets" render={(props) =>
                                                    <ErrorBoundary><CustomBets {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/support" render={(props) =>
                                                    <ErrorBoundary><ContactUs {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/autobet-dashboard" render={(props) =>
                                                    <ErrorBoundary><AutobetDashboard {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/autobet-settings" render={(props) =>
                                                    <ErrorBoundary><AutobetSettings {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/prize" render={(props) =>
                                                    <ErrorBoundary><Prize {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/loyalty" render={(props) =>
                                                    <ErrorBoundary><Loyalty {...props} user={user} /></ErrorBoundary>
                                                } />
                                                <Route path="/search/:param" render={(props) =>
                                                    <ErrorBoundary><Search {...props} /></ErrorBoundary>
                                                } />
                                                <Route exact path="/" render={(props) =>
                                                    <ErrorBoundary>
                                                        <Dashboard
                                                            addBet={this.addBet}
                                                            betSlip={betSlip}
                                                            removeBet={this.removeBet}
                                                        />
                                                    </ErrorBoundary>
                                                } />
                                                <Redirect to="/" from="*" />
                                            </Switch>
                                        </div>
                                        <div className="col-md-3 side-bar">
                                            <ErrorBoundary>
                                                {!sidebarShowAccountLinks &&
                                                    <BetSlip
                                                        betSlip={betSlip}
                                                        className="hide-mobile"
                                                        openBetSlipMenu={openBetSlipMenu}
                                                        toggleField={this.toggleField}
                                                        removeBet={this.removeBet}
                                                        updateBet={this.updateBet}
                                                        user={user}
                                                        history={history}
                                                    />}
                                                {!verified && pathname.indexOf('/withdraw') == 0 && <VerificationNotify />}
                                                {!verified && pathname == '/verification' && <VerificationProof />}
                                                {['/bets', '/history'].includes(pathname) && <BetStatus />}
                                                {pathname == '/cashback' && <CashbackNames />}
                                            </ErrorBoundary>
                                        </div>
                                    </div>
                                }}
                            </Route>
                        </Switch>
                        <GoToTop />
                    </div>
                </section>
                <Footer user={user} display_mode={dark_light} />
                {!sidebarShowAccountLinks &&
                    <BetSlip
                        betSlip={betSlip}
                        className="show-mobile"
                        openBetSlipMenu={openBetSlipMenu}
                        toggleField={this.toggleField}
                        removeBet={this.removeBet}
                        updateBet={this.updateBet}
                        user={user}
                        history={history}
                    />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    require_2fa: state.frontend.require_2fa,
    dark_light: state.frontend.dark_light,
    user: state.frontend.user
});

export default connect(mapStateToProps, frontend.actions)(withRouter(App))


App.propTypes = {
    // match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

