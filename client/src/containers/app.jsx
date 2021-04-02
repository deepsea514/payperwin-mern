import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import Favicon from 'react-favicon';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Registration from '../pages/registration';
import Login from '../pages/login';
import UsernameRecovery from '../pages/usernameRecovery';
import PasswordRecovery from '../pages/passwordRecovery';
import UsernameChange from '../pages/usernameChange';
import Sports from '../pages/sports';
import Sport from '../components/sport';
import Lines from '../pages/lines';
import BetForward from '../pages/betForward';
import Highlights from '../components/highlights';
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
import ETransfer from "../pages/etransfer";
import OpenBetsSportsBook from "../pages/openbetsSportsbook";
import { FormattedMessage, injectIntl } from "react-intl";

import '../style/all.css';
import '../style/bootstrap.min.css';
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
        window.addEventListener("scroll", this.updateScrollStatus);
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


    addBet(name, type, league, odds, pick, home, away, sportName, lineId, lineQuery, pickName, index) {
        const newBet = { name, type, league, odds, pick, stake: 0, win: 0, home, away, sportName, lineId, lineQuery, pickName, index, };
        const { betSlip } = this.state;
        this.setState({
            betSlip: update(betSlip, {
                $push: [
                    newBet
                ]
            })
        });
    }

    removeBet(lineId, pick, all = false, index) {
        const { betSlip } = this.state;
        if (all) {
            this.setState({
                betSlip: update(betSlip, {
                    $set: [],
                })
            });
        } else {
            const indexOfBet = betSlip.findIndex((b) => b.lineId === lineId && b.pick === pick && (typeof index === 'number' ? b.index === index : true));
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
        const { user, getUser, history, updateUser, location } = this.props;
        const wallet = resObjPath(user, 'balance') ? resObjPath(user, 'balance').toFixed(2) : '0.00';
        const { pathname } = location;
        const sidebarShowAccountLinks = [
            '/bets',
            '/bets-sportsbook',
            '/deposit',
            '/announcements',
            '/deactivation',
            '/details',
            '/history',
            '/history-sportsbook',
            '/inbox',
            '/payment-options',
            '/personal-details',
            '/preferences',
            '/security',
            '/self-exclusion',
            '/transaction-history',
            '/withdraw',
            '/account',
        ].includes(pathname);

        return (
            <div className={`background dark-theme ${scrolledTop ? 'scrolled-top' : ''}`}>
                <Favicon url={'/images/favicon-2.ico'} />
                <Header toggleField={this.toggleField} user={user} getUser={getUser} history={history} location={location} />
                {menuOpen ? <Menu user={user} location={location} toggleField={this.toggleField} /> : null}
                <section className="main-section">
                    <div className="container">
                        <Switch>
                            {user && <Route path="/sportsbook" component={SportsBook} />}
                            <Route path="/signup" render={(props) =>
                                <Registration getUser={getUser} {...props} />} />
                            <Route path="/">
                                {() => {
                                    return <div className="row">
                                        <SidebarAccount
                                            toggleField={this.toggleField}
                                            sidebarShowAccountLinks={sidebarShowAccountLinks}
                                            accountMenuMobileOpen={accountMenuMobileOpen} />
                                        <SidebarSports
                                            toggleField={this.toggleField}
                                            sportsMenuMobileOpen={sportsMenuMobileOpen}
                                            sidebarShowAccountLinks={sidebarShowAccountLinks}
                                        />
                                        <div className="col-md-7 p-0">
                                            <Switch>
                                                <Route path="/newPasswordFromToken" component={NewPasswordFromToken} />
                                                <Route path="/usernameRecovery" component={UsernameRecovery} />
                                                <Route path="/usernameChange" render={(props) =>
                                                    <UsernameChange getUser={getUser} {...props} />} />
                                                <Route path="/passwordRecovery" component={PasswordRecovery} />
                                                <Route path="/login" component={Login} />
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
                                                <Route path="/bets-sportsbook" render={(props) =>
                                                    <OpenBetsSportsBook openBets={true} {...props} />
                                                } />
                                                <Route path="/history-sportsbook" render={(props) =>
                                                    <OpenBetsSportsBook settledBets={true} {...props} />
                                                } />
                                                <Route path="/how-it-works" component={HowTo} />
                                                <Route path="/sports" component={Sports} />
                                                <Route path="/sport/:name" render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <React.Fragment>
                                                            <h1>{name}</h1>
                                                            <Sport addBet={this.addBet} betSlip={betSlip}
                                                                removeBet={this.removeBet} sportName={name} />
                                                        </React.Fragment>
                                                    );
                                                }} />
                                                <Route path="/lines/:sportName/:leagueId/:eventId"
                                                    render={(props) => <Lines addBet={this.addBet} betSlip={betSlip}
                                                        removeBet={this.removeBet} {...props} />}
                                                />
                                                <Route path="/betforward/:betId" component={BetForward} />
                                                <Route path="/announcements" component={Announcements} />
                                                <Route path="/preferences" component={Preferences} />
                                                <Route path="/faq" component={Faq} />
                                                <Route path="/inbox" component={Inbox} />
                                                <Route path="/payment-options" component={PaymentOptions} />
                                                <Route path="/transaction-history" render={(props) => <TransactionHistory {...props} user={user} />} />
                                                <Route path="/security" component={Security} />
                                                <Route path="/account" component={Profile} />
                                                <Route path="/self-exclusion" component={SelfExcusion} />
                                                <Route path="/deactivation" component={Deactivation} />
                                                <Route path="/privacy-policy" component={PrivacyPolicy} />
                                                <Route path="/terms-and-conditions" component={TermsAndConditions} />
                                                <Route path="/betting-rules" component={BettingRules} />
                                                <Route path="/etransfer" render={(props) => <ETransfer {...props} user={user} />} />
                                                <Route path="/">
                                                    {
                                                        () => {
                                                            setTitle({ pageTitle: '' });
                                                            return (
                                                                <React.Fragment>
                                                                    <Carousel autoPlay={8000} animationSpeed={1800} infinite
                                                                        stopAutoPlayOnHover={true}>
                                                                        <Link to={{ pathname: '/signup' }}>
                                                                            <img src="/images/Banner 1.png" />
                                                                        </Link>
                                                                        <Link to={{ pathname: '/how-it-works' }}>
                                                                            <img src="/images/Banner 2.png" />
                                                                        </Link>
                                                                    </Carousel>
                                                                    <Highlights addBet={this.addBet} betSlip={betSlip}
                                                                        removeBet={this.removeBet} />
                                                                </React.Fragment>
                                                            );
                                                        }
                                                    }
                                                </Route>
                                            </Switch>
                                        </div>
                                        <div className="col-sm-3 side-bar">
                                            <BetSlip betSlip={betSlip} openBetSlipMenu={openBetSlipMenu} toggleField={this.toggleField}
                                                removeBet={this.removeBet} updateBet={this.updateBet} user={user} updateUser={updateUser}
                                                history={history} />
                                        </div>
                                    </div>
                                }}
                            </Route>
                        </Switch>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }
}

export default withRouter(App);

App.propTypes = {
    // match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

