import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import Favicon from 'react-favicon';
import Registration from '../pages/registration';
import PasswordRecovery from '../pages/passwordRecovery';
import Sport from '../components/sport';
import Lines from '../pages/lines';
import Header from '../components/header';
import Footer from '../components/footer';
import OpenBets from '../pages/openbets';
import Deposit from '../pages/deposit';
import Withdrawal from '../pages/withdrawal';
import HowTo from '../pages/howto';
import BetSlip from '../components/betSlip';
import Banner from '../components/banner';
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
import DepositGiftCard from "../pages/depositGiftCard";
import DepositCreditCard from "../pages/depositCreditCard";
import WithdrawETransfer from "../pages/withdrawEtransfer";
import WithdrawTripleA from "../pages/withdrawTripleA";
import Dashboard from "../pages/dashboard";
import Verification from "../pages/verification";
import VerificationProof from "../components/verificationProof";
import ContactUs from "../pages/contactUs";
import GoToTop from "../components/gotoTop";
import TfaModal from "../components/tfamodal";
import CustomBet from "../components/custombet";
import BetStatus from "../components/betStatus";
import Articles from "../pages/articles";
import PhoneVerification from "../pages/phoneVerification";
import Cashback from "../pages/cashback";
import CashbackNames from "../components/cashbackNames";
import SportName from "../pages/sportName";
import SportTeaser from '../components/sportTeaser';
import CustomBets from '../pages/custombets';
import SportsLeagues from '../pages/sportleagues';
import AutobetSettings from '../pages/AutobetSettings';
import AutobetDashboard from '../pages/AutobetDashboard';
import AboutUs from '../pages/aboutus';
import Loyalty from '../pages/loyalty';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import ErrorBoundary from '../libs/ErrorBoundary';
import Search from '../pages/search';
import SportsBreadcrumb from '../components/sportsbreadcrumb';
import Invite from '../pages/invite';
import PromotionModal from '../components/promotionModal';
import { getBetSlipLastOdds, getMetaTag } from '../redux/services';
import ViewModeModal from '../components/viewmode_modal';
import { ToastContainer } from 'react-toastify';
import Team from '../pages/team';
import PrizeModal from '../components/prizeModal';
import CreateCustomBet from '../pages/createCustombet';

import '../style/all.css';
import '../style/all.min.css';
import '../style/bootstrap.min.css';
import '../style/dark.css';
import '../style/style2.css';
import '../style/style3.css';
import '../style/responsive.css';
import 'react-toastify/dist/ReactToastify.css';

const ShowAccountLinks = [
    '/bets',
    '/deposit',
    '/deactivation',
    '/history',
    '/inbox',
    '/payment-options',
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
    '/deposit-usdc',
    '/deposit-binance',
    '/withdraw-bitcoin',
    '/withdraw-ethereum',
    '/withdraw-tether',
    '/withdraw-usdc',
    '/withdraw-binance',
    '/verification',
    '/phone-verification',
    '/cashback',
    '/side-bets',
    '/side-bets/create',
    '/autobet-dashboard',
    '/autobet-settings',
    '/loyalty',
    '/deposit-giftcard',
    '/deposit-creditcard',
    '/invite'
];

const fullWidthRoutes = [
    '/loyalty',
    '/autobet-dashboard',
    '/invite',
    '/team',
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
            betSlipType: 'single',
            betSlip: [],
            teaserBetSlip: {
                type: null,
                betSlip: []
            },
            betSlipTimer: null,
            betSlipOdds: null,
            showViewModeModal: false,
            showPrizeModal: false,
        };
        this._Mounted = true;
    }

    setBetSlipType = (type) => {
        this.setState({ betSlipType: type });
    }

    componentDidMount() {
        this._Mounted = true;
        const { getUser, getAdminMessageAction, getBetStatusAction } = this.props;
        window.addEventListener("scroll", this.updateScrollStatus);

        getUser(this.redirectToDashboard);
        getAdminMessageAction();
        getBetStatusAction();
        this.setState({ betSlipTimer: setInterval(this.getLatestOdds, 10 * 1000) });

        getMetaTag('Peer to Peer Betting')
            .then(({ data }) => {
                if (data) {
                    setTitle({ pageTitle: data.title });
                } else {
                    setTitle({ siteName: 'PAYPER WIN', tagline: 'Risk Less, Win More', delimiter: '|' });
                }
            })
            .catch(() => {
                setTitle({ siteName: 'PAYPER WIN', tagline: 'Risk Less, Win More', delimiter: '|' });
            })
    }

    componentDidUpdate(prevProps) {
        const { pro_mode } = this.props;
        const { pro_mode: prevProMode } = prevProps;
        if (pro_mode !== prevProMode) {
            this.setState({
                betSlip: [],
                teaserBetSlip: {
                    type: null,
                    betSlip: []
                }
            });
        }
    }

    getLatestOdds = () => {
        const { betSlip } = this.state;
        if (betSlip.length == 0) return;
        getBetSlipLastOdds(betSlip)
            .then(({ data }) => {
                this._Mounted && this.setState({ betSlipOdds: data });
            })
            .catch(() => {
                this._Mounted && this.setState({ betSlipOdds: null });
            })
    }

    componentWillUnmount() {
        this._Mounted = false;
        const { betSlipTimer } = this.state;
        if (betSlipTimer) clearInterval(betSlipTimer);
    }

    redirectToDashboard = (user) => {
        const { history, location } = this.props;
        const { pathname } = location;
        if (!user) {
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
        const { name, type, league, odds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin, subtype, sportsbook = false, live = false, originOdds } = bet;
        const newBet = { name, type, subtype, league, odds, pick, stake: 0, win: 0, home, away, sportName, lineId, lineQuery, pickName, index, origin, sportsbook, live, originOdds };
        let { betSlip } = this.state;
        const { pro_mode } = this.props;
        if (pro_mode) {
            betSlip = betSlip.filter(bet => {
                const exists = bet.lineId === lineQuery.lineId &&
                    bet.type === lineQuery.type &&
                    bet.index === lineQuery.index &&
                    bet.subtype == lineQuery.subtype
                // && bet.pick == pick;
                return !exists;
            });
            this.setState({
                betSlip: update(betSlip, {
                    $push: [newBet]
                })
            });
        } else {
            this.setState({
                betSlip: [newBet]
            });
            this.toggleField('openBetSlipMenu', true)
        }
    }

    removeBet = (lineId, type, pick, index, subtype = null, all = false) => {
        const { betSlip } = this.state;
        const { pro_mode } = this.props;
        if (all) {
            this.setState({
                betSlip: update(betSlip, {
                    $set: [],
                })
            });
        } else {
            const indexOfBet = betSlip.findIndex((b) => {
                return (b.lineId === lineId &&
                    b.pick === pick &&
                    (pro_mode ? b.type == type : true) &&
                    (typeof index === 'number' ? b.index === index : true) &&
                    b.subtype == subtype)
            });
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

    addTeaserBet = (bet) => {
        const { teaserBetSlip } = this.state;
        const { teaserPoint, sportName, lineId, type, pick } = bet;
        const betSlip = teaserBetSlip.betSlip.filter(bet => (bet.lineId != lineId || bet.type != type));
        if (teaserBetSlip.type) {
            if (teaserBetSlip.betSlip.length >= 4) {
                return;
            }
            this.setState({
                teaserBetSlip: {
                    type: teaserBetSlip.type ? teaserBetSlip.type : {
                        teaserPoint: teaserPoint,
                        sportName: sportName
                    },
                    betSlip: [...betSlip, bet]
                }
            })
        } else {
            this.setState({
                teaserBetSlip: {
                    type: {
                        teaserPoint: teaserPoint,
                        sportName: sportName
                    },
                    betSlip: [bet]
                }
            })
        }
    }

    removeTeaserBet = (lineId, type, pick) => {
        const { teaserBetSlip } = this.state;
        if (lineId) {
            const betSlip = teaserBetSlip.betSlip.filter(bet => (bet.lineId != lineId || bet.type != type || bet.pick != pick));
            this.setState({
                teaserBetSlip: {
                    type: betSlip.length ? teaserBetSlip.type : null,
                    betSlip: betSlip
                }
            });
        } else {
            this.setState({ teaserBetSlip: { type: null, betSlip: [] } });
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
            betSlipType,
            teaserBetSlip,
            betSlipOdds,
            showViewModeModal,
            showPrizeModal,
        } = this.state;
        const { user,
            getUser,
            history,
            location,
            require_2fa,
            showLoginModalAction,
            showPromotion,
            showPromotionAction,
            pro_mode
        } = this.props;
        const { pathname } = location;
        let sidebarShowAccountLinks = ShowAccountLinks.includes(pathname);
        const fullWidth = fullWidthRoutes.includes(pathname);

        sidebarShowAccountLinks = sidebarShowAccountLinks ? sidebarShowAccountLinks : (pathname.search('/inbox') != -1);
        const verified = user && user.roles.verified;

        return (
            <div className={`background dark-theme dark ${scrolledTop ? 'scrolled-top' : ''}`}>
                <Favicon url={'/images/favicon.png'} />
                <ToastContainer />
                <Header
                    toggleField={this.toggleField}
                    user={user}
                    getUser={getUser}
                    history={history}
                    location={location}
                />
                {menuOpen && <Menu user={user}
                    location={location}
                    getUser={getUser}
                    history={history}
                    showLoginModalAction={showLoginModalAction}
                    toggleField={this.toggleField} />}
                <section className={`main-section dark`}>
                    {require_2fa && <TfaModal getUser={getUser} />}
                    {showPromotion && <PromotionModal closePromotion={() => showPromotionAction(false)} />}
                    {showViewModeModal && <ViewModeModal onClose={() => this.toggleField('showViewModeModal', false)} pro_mode={pro_mode} />}
                    {showPrizeModal && <PrizeModal onClose={() => this.toggleField('showPrizeModal')}
                        showLoginModalAction={() => showLoginModalAction(true)}
                        user={user} />}
                    <div className="container">
                        <Switch>
                            <Route path="/signup" render={(props) =>
                                <ErrorBoundary><Registration getUser={getUser} {...props} /></ErrorBoundary>} />
                            <Route path="/faq" render={(props) => <ErrorBoundary><Faq {...props} /></ErrorBoundary>} />
                            <Route path="/articles" render={(props) => <ErrorBoundary><Articles {...props} /></ErrorBoundary>} />
                            <Route path="/team" component={Team} />
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
                                                showLoginModalAction={() => showLoginModalAction(true)}
                                                user={user}
                                                getUser={getUser}
                                            />
                                        </ErrorBoundary>
                                        <div className={`${fullWidth ? 'col-lg-10 col-sm-12' : 'col-lg-7 col-sm-12'} p-0`}>
                                            <Switch>
                                                <Route path="/newPasswordFromToken" render={(props) =>
                                                    <ErrorBoundary><NewPasswordFromToken {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/passwordRecovery" render={(props) =>
                                                    <ErrorBoundary><PasswordRecovery {...props} /></ErrorBoundary>
                                                } />
                                                {user && <Route path="/deposit" render={(props) =>
                                                    <ErrorBoundary><Deposit {...props} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/withdraw" render={(props) =>
                                                    <ErrorBoundary><Withdrawal {...props} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/bets" render={(props) =>
                                                    <ErrorBoundary><OpenBets openBets={true} getUser={getUser} {...props} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/history" render={(props) =>
                                                    <ErrorBoundary><OpenBets settledBets={true} {...props} /></ErrorBoundary>
                                                } />}
                                                <Route path="/how-it-works" render={(props) =>
                                                    <ErrorBoundary><HowTo {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/sport/:shortName/league/:leagueId/event/:eventId/live" exact render={(props) =>
                                                    <ErrorBoundary><Lines addBet={this.addBet} betSlip={betSlip}
                                                        removeBet={this.removeBet} {...props} user={user} getUser={getUser} live={true} /></ErrorBoundary>
                                                } />
                                                <Route path="/sport/:shortName/league/:leagueId/event/:eventId" exact render={(props) =>
                                                    <ErrorBoundary><Lines addBet={this.addBet} betSlip={betSlip}
                                                        removeBet={this.removeBet} {...props} user={user} getUser={getUser} live={false} /></ErrorBoundary>
                                                } />
                                                <Route path="/sport/:name/league/:league" exact render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    const league = resObjPath(match, 'params.league');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <Sport addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet} shortName={name}
                                                                    league={league} user={user} getUser={getUser}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/sport/:name/team/:team" exact render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    const team = resObjPath(match, 'params.team');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <Sport addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet} shortName={name}
                                                                    user={user} getUser={getUser} team={team}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/sport/:name/league" exact render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <SportsBreadcrumb shortName={name} user={user} active='league' />
                                                                <SportsLeagues shortName={name} user={user} getUser={getUser} />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/sport/:name/teaser" exact render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <ErrorBoundary>
                                                            <SportTeaser addBet={this.addTeaserBet}
                                                                setBetSlipType={this.setBetSlipType}
                                                                teaserBetSlip={teaserBetSlip}
                                                                removeBet={this.removeTeaserBet}
                                                                shortName={name} />
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/sport/:name" exact render={(props) => {
                                                    const { match } = props;
                                                    const name = resObjPath(match, 'params.name');
                                                    return (
                                                        <ErrorBoundary>
                                                            <SportName addBet={this.addBet} betSlip={betSlip}
                                                                removeBet={this.removeBet} shortName={name} />
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/side-bet/:id" exact render={(props) => {
                                                    const { match } = props;
                                                    const id = resObjPath(match, 'params.id');
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <h1 className='text-white'>Custom Event</h1>
                                                                <CustomBet {...props} addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet} id={id}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                <Route path="/side-bet" render={(props) => {
                                                    return (
                                                        <ErrorBoundary>
                                                            <React.Fragment>
                                                                <h1 className='text-white'>Custom Events</h1>
                                                                <CustomBet {...props} addBet={this.addBet} betSlip={betSlip}
                                                                    removeBet={this.removeBet}
                                                                />
                                                            </React.Fragment>
                                                        </ErrorBoundary>
                                                    );
                                                }} />
                                                {user && <Route path="/preferences" render={(props) =>
                                                    <ErrorBoundary><Preferences {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/inbox" render={(props) =>
                                                    <ErrorBoundary><Inbox {...props} getUser={getUser} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/payment-options" render={(props) =>
                                                    <ErrorBoundary><PaymentOptions {...props} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/transaction-history" render={(props) =>
                                                    <ErrorBoundary><TransactionHistory {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/security" render={(props) =>
                                                    <ErrorBoundary><Security {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/account" render={(props) =>
                                                    <ErrorBoundary><Profile {...props} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/self-exclusion" render={(props) =>
                                                    <ErrorBoundary><SelfExcusion {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/deactivation" render={(props) =>
                                                    <ErrorBoundary><Deactivation {...props} /></ErrorBoundary>
                                                } />}
                                                <Route path="/privacy-policy" render={(props) =>
                                                    <ErrorBoundary><PrivacyPolicy {...props} /> </ErrorBoundary>
                                                } />
                                                <Route path="/terms-and-conditions" render={(props) =>
                                                    <ErrorBoundary><TermsAndConditions {...props} /></ErrorBoundary>
                                                } />
                                                <Route path="/about-us" render={(props) => (
                                                    <ErrorBoundary><AboutUs {...props} /></ErrorBoundary>
                                                )} />
                                                <Route path="/betting-rules" render={(props) =>
                                                    <ErrorBoundary><BettingRules {...props} /></ErrorBoundary>
                                                } />
                                                {user && <Route path="/deposit-etransfer" render={(props) =>
                                                    <ErrorBoundary><DepositETransfer {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/deposit-bitcoin" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="Bitcoin" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/deposit-ethereum" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="Ethereum" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/deposit-tether" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="Tether" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/deposit-usdc" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="USDC" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/deposit-binance" render={(props) =>
                                                    <ErrorBoundary><DepositTripleA {...props} user={user} method="Binance" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path='/deposit-giftcard' render={(props) =>
                                                    <ErrorBoundary><DepositGiftCard {...props} user={user} getUser={getUser} /></ErrorBoundary>} />}
                                                {/* {user && <Route path='/deposit-creditcard' render={(props) =>
                                                    <ErrorBoundary><DepositCreditCard {...props} user={user} getUser={getUser} /></ErrorBoundary>} />} */}
                                                {user && <Route path="/withdraw-etransfer" render={(props) =>
                                                    <ErrorBoundary><WithdrawETransfer {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/withdraw-bitcoin" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="Bitcoin" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/withdraw-ethereum" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="Ethereum" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/withdraw-tether" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="Tether" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/withdraw-usdc" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="USDC" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/withdraw-binance" render={(props) =>
                                                    <ErrorBoundary><WithdrawTripleA {...props} user={user} getUser={getUser} method="Binance" /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/verification" render={(props) =>
                                                    <ErrorBoundary><Verification {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/phone-verification" render={(props) =>
                                                    <ErrorBoundary><PhoneVerification {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/cashback" render={(props) =>
                                                    <ErrorBoundary><Cashback {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/side-bets/create" render={(props) =>
                                                    <ErrorBoundary><CreateCustomBet {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/side-bets" render={(props) =>
                                                    <ErrorBoundary><CustomBets {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                <Route path="/support" render={(props) =>
                                                    <ErrorBoundary><ContactUs {...props} /></ErrorBoundary>
                                                } />
                                                {user && <Route path="/autobet-dashboard" render={(props) =>
                                                    <ErrorBoundary><AutobetDashboard {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/autobet-settings" render={(props) =>
                                                    <ErrorBoundary><AutobetSettings {...props} user={user} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/loyalty" render={(props) =>
                                                    <ErrorBoundary><Loyalty {...props} user={user} getUser={getUser} /></ErrorBoundary>
                                                } />}
                                                {user && <Route path="/invite" render={(props) => (
                                                    <ErrorBoundary><Invite {...props} user={user} /></ErrorBoundary>
                                                )} />}
                                                <Route path="/search/:param" render={(props) =>
                                                    <ErrorBoundary><Search {...props} /></ErrorBoundary>
                                                } />
                                                <Route exact path="/" render={(props) =>
                                                    <ErrorBoundary>
                                                        <Dashboard
                                                            addBet={this.addBet}
                                                            betSlip={betSlip}
                                                            removeBet={this.removeBet}
                                                            toggleField={this.toggleField}
                                                        />
                                                    </ErrorBoundary>
                                                } />
                                                <Redirect to="/" from="*" />
                                            </Switch>
                                        </div>
                                        <div className="col-lg-3 col-sm-12 mt-lg-0 mt-sm-2 px-lg-2 p-sm-0 side-bar">
                                            <ErrorBoundary>
                                                {!sidebarShowAccountLinks &&
                                                    <BetSlip
                                                        betSlip={betSlip}
                                                        betSlipType={pro_mode ? betSlipType : 'single'}
                                                        teaserBetSlip={teaserBetSlip}
                                                        setBetSlipType={this.setBetSlipType}
                                                        className="hide-mobile"
                                                        openBetSlipMenu={openBetSlipMenu}
                                                        toggleField={this.toggleField}
                                                        removeBet={this.removeBet}
                                                        updateBet={this.updateBet}
                                                        removeTeaserBet={this.removeTeaserBet}
                                                        user={user}
                                                        history={history}
                                                        betSlipOdds={betSlipOdds}
                                                    />}
                                                    
                                                {!verified && pathname.indexOf('/withdraw') == 0 && <Redirect to="/verification" from="*" />}
                                                {!verified && pathname == '/verification' && <VerificationProof />}
                                                {['/bets', '/history'].includes(pathname) && <BetStatus />}
                                                {pathname == '/cashback' && <CashbackNames />}
                                            </ErrorBoundary>
                                            {!sidebarShowAccountLinks && <ErrorBoundary>
                                                <Banner/>
                                            </ErrorBoundary>}
                                        </div>
                                    </div>
                                }}
                            </Route>
                        </Switch>
                        <GoToTop />
                    </div>
                </section>
                <Footer user={user} />
                {!sidebarShowAccountLinks &&
                    <BetSlip
                        betSlip={betSlip}
                        betSlipType={pro_mode ? betSlipType : 'single'}
                        teaserBetSlip={teaserBetSlip}
                        setBetSlipType={this.setBetSlipType}
                        className="show-mobile"
                        openBetSlipMenu={openBetSlipMenu}
                        toggleField={this.toggleField}
                        removeBet={this.removeBet}
                        updateBet={this.updateBet}
                        removeTeaserBet={this.removeTeaserBet}
                        user={user}
                        history={history}
                        betSlipOdds={betSlipOdds}
                    />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    pro_mode: state.frontend.pro_mode,
    oddsFormat: state.frontend.oddsFormat,
    require_2fa: state.frontend.require_2fa,
    user: state.frontend.user,
    betEnabled: state.frontend.betEnabled,
    showPromotion: state.frontend.showPromotion,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(App))


App.propTypes = {
    // match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

