import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import Favicon from 'react-favicon';
import Registration from '../pages/registration';
import Login from '../pages/login';
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
import Announcements from "../pages/announcements";
import NewPasswordFromToken from "../pages/newPasswordFromToken";
import Preferences from "../pages/preferences";
import Faq from "../pages/faq";
import Inbox from "../pages/inbox";
import PaymentOptions from "../pages/paymentoptions";
import TransactionHistory from "../pages/transactionhistory";
import Security from "../pages/security";
import SelfExcusion from "../pages/selfexcusion";
import Deactivation from "../pages/deactivation";
import SportsBook from "../pages/sportsbook";
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

import '../style/all.css';
import '../style/bootstrap.min.css';
import '../style/dark.css';
import '../style/style2.css';
import '../style/style3.css';
import '../style/responsive.css';

class App extends PureComponent {
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
        this.toggleField = this.toggleField.bind(this);
        this.addBet = this.addBet.bind(this);
        this.removeBet = this.removeBet.bind(this);
        this.updateBet = this.updateBet.bind(this);
        this.updateScrollStatus = this.updateScrollStatus.bind(this);
    }

    componentDidMount() {
        const { setDisplayModeBasedOnSystem } = this.props;
        window.addEventListener("scroll", this.updateScrollStatus);
        setInterval(() => setDisplayModeBasedOnSystem(), 1000);
        setDisplayModeBasedOnSystem();
    }

    updateScrollStatus() {
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

    toggleField(fieldName, forceState) {
        if (typeof this.state[fieldName] !== 'undefined') {
            this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }


    addBet(name, type, league, odds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin) {
        const newBet = { name, type, league, odds, pick, stake: 0, win: 0, home, away, sportName, lineId, lineQuery, pickName, index, origin };
        const { betSlip } = this.state;
        this.setState({
            betSlip: update(betSlip, {
                $push: [
                    newBet
                ]
            })
        });
    }

    removeBet(lineId, type, pick, index, all = false) {
        const { betSlip } = this.state;
        if (all) {
            this.setState({
                betSlip: update(betSlip, {
                    $set: [],
                })
            });
        } else {
            const indexOfBet = betSlip.findIndex((b) => b.lineId === lineId && b.pick === pick && b.type == type && (typeof index === 'number' ? b.index === index : true));
            // console.log(indexOfBet);
            if (typeof indexOfBet === 'number') {
                this.setState({
                    betSlip: update(betSlip, {
                        $splice: [[indexOfBet, 1]]
                    })
                });
            }
        }
    }

    updateBet(lineId, pick, propUpdates, index) {
        const { betSlip } = this.state;
        const indexOfBet = betSlip.findIndex((b) => b.lineId === lineId && b.pick === pick && (typeof index === 'number' ? b.index === index : true));
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
            updateUser,
            location,
            require_2fa,
            display_mode,
        } = this.props;
        const { pathname } = location;
        let sidebarShowAccountLinks = [
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
        ].includes(pathname);
        const exceptDark = [
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
        ].filter(path => {
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
                <section className={`main-section ${display_mode == 'dark' && !exceptDark ? 'dark' : ''}`}>
                    {require_2fa && <TfaModal getUser={getUser} />}
                    <div className="container">
                        <Switch>
                            <Route path="/sportsbook" render={(props) =>
                                <SportsBook {...props} user={user} />} />
                            <Route path="/signup" render={(props) =>
                                <Registration getUser={getUser} {...props} />} />
                            <Route path="/faq" component={Faq} />
                            <Route path="/articles" component={Articles} />
                            <Route path="/">
                                {() => {
                                    return <div className="row">
                                        <SidebarAccount
                                            toggleField={this.toggleField}
                                            sidebarShowAccountLinks={sidebarShowAccountLinks}
                                            accountMenuMobileOpen={accountMenuMobileOpen}
                                            user={user}
                                        />
                                        <SidebarSports
                                            toggleField={this.toggleField}
                                            sportsMenuMobileOpen={sportsMenuMobileOpen}
                                            sidebarShowAccountLinks={sidebarShowAccountLinks}
                                        />
                                        <div className={`${fullWidth ? 'col-md-10' : 'col-md-7'} p-0`}>
                                            <Switch>
                                                <Route path="/newPasswordFromToken" component={NewPasswordFromToken} />
                                                {/* <Route path="/usernameRecovery" component={UsernameRecovery} /> */}
                                                <Route path="/passwordRecovery" component={PasswordRecovery} />
                                                {/* <Route path="/login" component={Login} /> */}
                                                <Route path="/deposit" render={(props) =>
                                                    <Deposit updateUser={updateUser} {...props} />} />
                                                <Route path="/withdraw" render={(props) =>
                                                    <Withdrawal updateUser={updateUser} {...props} />} />
                                                <Route path="/bets" render={(props) =>
                                                    <OpenBets openBets={true} {...props} />
                                                } />
                                                <Route path="/history" render={(props) =>
                                                    <OpenBets settledBets={true} {...props} />
                                                } />
                                                <Route path="/how-it-works" component={HowTo} />
                                                <Route path="/sports" component={Sports} />
                                                <Route path="/sport/:sportName/league/:leagueId/event/:eventId"
                                                    render={(props) => <Lines addBet={this.addBet} betSlip={betSlip}
                                                        removeBet={this.removeBet} {...props} />}
                                                />
                                                <Route path="/sport/:name/league/:league" render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    const league = resObjPath(match, 'params.league');
                                                    return (
                                                        <React.Fragment>
                                                            <Sport addBet={this.addBet} betSlip={betSlip}
                                                                removeBet={this.removeBet} sportName={name}
                                                                league={league}
                                                            />
                                                        </React.Fragment>
                                                    );
                                                }} />
                                                <Route path="/sport/:name/league" render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <React.Fragment>
                                                            <SportsLeagues sportName={name} />
                                                        </React.Fragment>
                                                    );
                                                }} />
                                                <Route path="/sport/:name" render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <SportName addBet={this.addBet} betSlip={betSlip}
                                                            removeBet={this.removeBet} sportName={name} />
                                                    );
                                                }} />
                                                <Route path="/others/:id" render={(props) => {
                                                    const { match } = props;
                                                    const id = resObjPath(match, 'params.id');
                                                    return (
                                                        <React.Fragment>
                                                            <h1>Custom Event</h1>
                                                            <Others {...props} addBet={this.addBet} betSlip={betSlip}
                                                                removeBet={this.removeBet} id={id}
                                                            />
                                                        </React.Fragment>
                                                    );
                                                }} />
                                                <Route path="/others" render={(props) => {
                                                    return (
                                                        <React.Fragment>
                                                            <h1>Custom Events</h1>
                                                            <Others {...props} addBet={this.addBet} betSlip={betSlip}
                                                                removeBet={this.removeBet}
                                                            />
                                                        </React.Fragment>
                                                    );
                                                }} />
                                                {/* <Route path="/announcements" component={Announcements} /> */}
                                                <Route path="/preferences" render={(props) => <Preferences {...props} user={user} />} />
                                                <Route path="/inbox" render={(props) => <Inbox {...props} getUser={getUser} />} />
                                                <Route path="/payment-options" component={PaymentOptions} />
                                                <Route path="/transaction-history" render={(props) => <TransactionHistory {...props} user={user} />} />
                                                <Route path="/security" render={(props) => <Security {...props} user={user} getUser={getUser} />} />
                                                <Route path="/account" component={Profile} />
                                                <Route path="/self-exclusion" render={(props) => <SelfExcusion {...props} user={user} getUser={getUser} />} />
                                                <Route path="/deactivation" component={Deactivation} />
                                                <Route path="/privacy-policy" component={PrivacyPolicy} />
                                                <Route path="/terms-and-conditions" component={TermsAndConditions} />
                                                <Route path="/betting-rules" component={BettingRules} />
                                                <Route path="/deposit-etransfer" render={(props) => <DepositETransfer {...props} user={user} />} />
                                                <Route path="/deposit-bitcoin" render={(props) => <DepositTripleA {...props} user={user} method="Bitcoin" />} />
                                                <Route path="/deposit-ethereum" render={(props) => <DepositTripleA {...props} user={user} method="Ethereum" />} />
                                                <Route path="/deposit-tether" render={(props) => <DepositTripleA {...props} user={user} method="Tether" />} />
                                                <Route path="/withdraw-etransfer" render={(props) => <WithdrawETransfer {...props} user={user} getUser={getUser} />} />
                                                <Route path="/withdraw-bitcoin" render={(props) => <WithdrawTripleA {...props} user={user} getUser={getUser} method="Bitcoin" />} />
                                                <Route path="/withdraw-ethereum" render={(props) => <WithdrawTripleA {...props} user={user} getUser={getUser} method="Ethereum" />} />
                                                <Route path="/withdraw-tether" render={(props) => <WithdrawTripleA {...props} user={user} getUser={getUser} method="Tether" />} />
                                                <Route path="/verification" render={(props) => <Verification {...props} user={user} />} />
                                                <Route path="/phone-verification" render={(props) => <PhoneVerification {...props} user={user} getUser={getUser} />} />
                                                <Route path="/cashback" render={(props) => <Cashback {...props} user={user} />} />
                                                <Route path="/custom-bets" render={(props) => <CustomBets {...props} user={user} />} />
                                                <Route path="/support" component={ContactUs} />
                                                <Route path="/autobet-dashboard" render={(props) => <AutobetDashboard {...props} user={user} />} />
                                                <Route path="/autobet-settings" render={(props) => <AutobetSettings {...props} user={user} />} />
                                                <Route path="/prize" render={(props) => <Prize {...props} user={user} />} />
                                                <Route path="/loyalty" render={(props) => <Loyalty {...props} user={user} />} />
                                                <Route exact path="/" render={(props) =>
                                                    <Dashboard
                                                        addBet={this.addBet}
                                                        betSlip={betSlip}
                                                        removeBet={this.removeBet}
                                                    />}
                                                />
                                                <Redirect to="/" from="*" />
                                            </Switch>
                                        </div>
                                        <div className="col-md-3 side-bar">
                                            {!sidebarShowAccountLinks &&
                                                <BetSlip
                                                    betSlip={betSlip}
                                                    className="hide-mobile"
                                                    openBetSlipMenu={openBetSlipMenu}
                                                    toggleField={this.toggleField}
                                                    removeBet={this.removeBet}
                                                    updateBet={this.updateBet}
                                                    user={user}
                                                    updateUser={updateUser}
                                                    history={history}
                                                />}
                                            {!verified && pathname.indexOf('/withdraw') == 0 && <VerificationNotify />}
                                            {!verified && pathname == '/verification' && <VerificationProof />}
                                            {['/bets', '/history'].includes(pathname) && <BetStatus />}
                                            {pathname == '/cashback' && <CashbackNames />}
                                        </div>
                                    </div>
                                }}
                            </Route>
                        </Switch>
                        <GoToTop />
                    </div>
                </section>
                <Footer user={user} display_mode={display_mode} />
                {!sidebarShowAccountLinks &&
                    <BetSlip
                        betSlip={betSlip}
                        className="show-mobile"
                        openBetSlipMenu={openBetSlipMenu}
                        toggleField={this.toggleField}
                        removeBet={this.removeBet}
                        updateBet={this.updateBet}
                        user={user}
                        updateUser={updateUser}
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
    display_mode: state.frontend.display_mode,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(App))


App.propTypes = {
    // match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

