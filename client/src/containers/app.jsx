import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import update from 'immutability-helper';
import Favicon from 'react-favicon';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Registration from '../components/registration';
import Login from '../components/login';
import UsernameRecovery from '../components/usernameRecovery';
import PasswordRecovery from '../components/passwordRecovery';
import PasswordChange from '../components/passwordChange';
import UsernameChange from '../components/usernameChange';
import Sports from '../components/sports';
import Sport from '../components/sport';
import Lines from '../components/lines';
import BetForward from '../components/betForward';
import SportsList from '../components/sportsList';
import Highlights from '../components/highlights';
import Header from '../components/header';
import Footer from '../components/footer';
import OpenBets from '../components/openbets';
import NewPasswordFromToken from '../components/newPasswordFromToken';
import Deposit from '../components/deposit';
import Withdrawal from '../components/withdrawal';
import HowTo from '../components/howto';
import BetSlip from '../components/betSlip';
import resObjPath from '../libs/resObjPath';
import logout from '../helpers/logout';
import { setTitle } from '../libs/documentTitleBuilder';
import Profile from "../components/profile";

// import '../style/style.css';
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
        ].includes(pathname);

        return (
            <div className={`background dark-theme ${scrolledTop ? 'scrolled-top' : ''}`}>
                <Favicon url={'/images/favicon-2.ico'} />
                <Header toggleField={this.toggleField} user={user} getUser={getUser} history={history} location={location} />
                { menuOpen ? (
                    <React.Fragment>
                        <div className="background-closer" onClick={() => this.toggleField('menuOpen')} />
                        <div className="mobile-menu modal-content">
                            <button type="button" className="close" onClick={() => this.toggleField('menuOpen')}>
                                <i className="fal fa-times" />
                            </button>
                            <Link to={{ pathname: '/' }} className="logo">
                                <img src="/images/logo200.png" />
                            </Link>
                            <ul className="navbar-nav">
                                <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/' }} className="nav-link" onClick={() => this.toggleField('menuOpen')}>
                                        <i className="fas fa-dollar-sign"></i>SPORTS BETTING
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/how-it-works' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/how-it-works' }} className="nav-link" onClick={() =>
                                        this.toggleField('menuOpen')}>
                                        <i className="fas fa-info"></i>HOW IT WORKS
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/faq' }} className="nav-link" onClick={() => this.toggleField('menuOpen')}>
                                        <i className="fas fa-question"></i>FAQ
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/help' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/' }} className="nav-link" onClick={() => this.toggleField('menuOpen')}>
                                        <i className="fa fa-question-circle" aria-hidden="true"></i>Help
                                    </Link>
                                </li>
                            </ul>
                            <ul className="list-fab">
                                <li>Language <select>
                                    <option>English (EN)</option>
                                </select></li>
                                <li>Odds Format<select>
                                    <option>American Odds</option>
                                </select></li>
                                <li>Odds Type<select>
                                    <option>Single Odds</option>
                                </select></li>
                            </ul>
                        </div>
                    </React.Fragment>
                ) : null
                }
                <section className="main-section">
                    <div className="container">
                        <div className="row">
                            <div className={`col-sm-2 responsive-v ${sidebarShowAccountLinks ? '' : 'hide'}`}
                                style={accountMenuMobileOpen ? { display: 'block' } : null} onClick={() =>
                                    this.toggleField('accountMenuMobileOpen', false)}>

                                {/* <h3 className="cat-heading">MESSAGE CENTER</h3>
                                <ul className="left-cat top-cls-sport">
                                    <li>
                                        <Link to={{ pathname: '/inbox' }}><i className="fas fa-envelope"></i>Inbox</Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/announcements' }}><i className="fas fa-bell"></i>Announcements </Link>
                                    </li>
                                </ul> */}

                                <h3 className="cat-heading">MY BETS</h3>
                                <ul className="left-cat top-cls-sport">
                                    <li>
                                        <Link to={{ pathname: '/bets' }}><i className="fas fa-hockey-puck"></i>Open bets</Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/history' }}><i className="fas fa-history"></i>Betting History </Link>
                                    </li>
                                </ul>

                                <h3 className="cat-heading">CASHIER</h3>
                                <ul className="left-cat top-cls-sport">
                                    <li>
                                        <Link to={{ pathname: '/deposit' }}><i className="fas fa-hockey-puck"></i>Deposit </Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/withdraw' }}><i className="fas fa-baseball-ball"></i>Withdraw </Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/transaction-history' }}><i
                                            className="fas fa-money-bill"></i>Transactions history </Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/payment-options' }}><i className="far fa-money-bill-alt"></i>Payment methods </Link>
                                    </li>
                                </ul>
                                <h3 className="cat-heading">MY ACCOUNT</h3>
                                <ul className="left-cat top-cls-sport">
                                    <li>
                                        <Link to={{ pathname: '/account' }}><i className="fas fa-info-circle i-color"></i>Personal details </Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/preferences' }}><i className="fas fa-asterisk"></i>Preferences </Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/security' }}><i className="fas fa-baseball-ball"></i>Password and security </Link>
                                    </li>
                                    {/* <li>
                                        <Link to={{ pathname: '/' }}><i className="fas fa-baseball-ball"></i>Verification</Link>
                                    </li> */}
                                </ul>

                                {/* <h3 className="cat-heading">RESPONSIBLE GAMING</h3>
                                <ul className="left-cat top-cls-sport">
                                    <li>
                                        <Link to={{ pathname: '/self-exclusion' }}><i className="fas fa-hockey-puck"></i>Self exclusion</Link>
                                    </li>
                                    <li>
                                        <Link to={{ pathname: '/deactivation' }}><i className="far fa-user-circle"></i>Account deactivation</Link>
                                    </li>
                                </ul> */}
                            </div>
                            <div className={`col-sm-2 responsive-v ${sidebarShowAccountLinks ? 'hide' : ''}`}
                                style={sportsMenuMobileOpen ? { display: 'block' } : null} onClick={() =>
                                    this.toggleField('sportsMenuMobileOpen', false)}>
                                <div className="fabrt-d">
                                    <h3 className="cat-heading">Favorites</h3>
                                    <div className="fabrte">
                                        <Link to={{ pathname: '/login' }}>Log in</Link> or
                                        <Link to={{ pathname: '/signup' }}>Join</Link> to change your <br />favorites.
                                    </div>
                                </div>
                                <h3 className="cat-heading">TOP SPORTS</h3>
                                <SportsList />
                                <h3 className="cat-heading">A-Z SPORTS</h3>
                                <SportsList showNoEvents={true} />
                            </div>
                            <div className="col-sm-7 pad0">
                                <Switch>
                                    <Route path="/newPasswordFromToken" render={() =>
                                        <newPasswordFromToken />} />
                                    <Route path="/usernameRecovery" render={() =>
                                        <UsernameRecovery />} />
                                    <Route path="/usernameChange" render={() =>
                                        <UsernameChange getUser={getUser} />} />
                                    <Route path="/passwordRecovery" render={() =>
                                        <PasswordRecovery />} />
                                    <Route path="/login">
                                        <Login />
                                    </Route>
                                    <Route path="/signup" render={() =>
                                        <Registration getUser={getUser} />} />
                                    <Route path="/deposit" render={() =>
                                        <Deposit updateUser={updateUser} />} />
                                    <Route path="/withdraw" render={() =>
                                        <Withdrawal updateUser={updateUser} />} />
                                    <Route path="/bets">
                                        <OpenBets openBets={true} />
                                    </Route>
                                    <Route path="/history">
                                        <OpenBets settledBets={true} />
                                    </Route>
                                    <Route path="/how-it-works">
                                        <HowTo />
                                    </Route>
                                    <Route path="/sports">
                                        <Sports />
                                    </Route>
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
                                    }
                                    }
                                    />
                                    <Route path="/lines/:sportName/:leagueId/:eventId">
                                        <Lines addBet={this.addBet} betSlip={betSlip}
                                            removeBet={this.removeBet} />
                                    </Route>
                                    <Route path="/betforward/:betId">
                                        <BetForward />
                                    </Route>
                                    <Route path="/announcements">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Announcements' });
                                                return (
                                                    <React.Fragment>
                                                        <div className="col-in">
                                                            <h1 className="main-heading-in">Announcements</h1>
                                                            <div className="main-cnt text-center">
                                                                <img src="images/announ-img.jpg" />
                                                                <br />
                                                                <strong>There are no messages in your
                                                                        announcements.</strong>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/preferences">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Preferences' });
                                                return (
                                                    <React.Fragment>
                                                        <div className="col-in prfnce">
                                                            <h1 className="main-heading-in">Preferences</h1>
                                                            <div className="main-cnt">
                                                                <form>
                                                                    <h3> DISPLAY PREFERENCES</h3>

                                                                    <div className="form-group">
                                                                        <label>Odds display format</label>
                                                                        <select className="form-control">
                                                                            <option> American Ods</option>
                                                                            <option> Decimal Odds</option>
                                                                        </select>
                                                                        <i className="fa fa-info-circle fl-rit"
                                                                            aria-hidden="true"></i>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label>Default date format</label>
                                                                        <select className="form-control">
                                                                            <option> DD-MM-YYYY</option>
                                                                            <option> DD-MM-YYYY</option>
                                                                            <option> DD-MM-YYYY</option>
                                                                        </select>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label>Default time zone</label>
                                                                        <select className="form-control">
                                                                            <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                                                                            <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                                                                            <option value="-10:00">(GMT -10:00) Hawaii</option>
                                                                            <option value="-09:50">(GMT -9:30) Taiohae</option>
                                                                            <option value="-09:00">(GMT -9:00) Alaska</option>
                                                                            <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                                                                            <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                                                                            <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                                                                            <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                                                            <option value="-04:50">(GMT -4:30) Caracas</option>
                                                                            <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                                                            <option value="-03:50">(GMT -3:30) Newfoundland</option>
                                                                            <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                                                                            <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                                                                            <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                                                                            <option value="+00:00" selected="selected">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                                                                            <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                                                                            <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                                                                            <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                                                                            <option value="+03:50">(GMT +3:30) Tehran</option>
                                                                            <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                                                                            <option value="+04:50">(GMT +4:30) Kabul</option>
                                                                            <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                                                                            <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                                                                            <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                                                                            <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                                                                            <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                                                                            <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                                                                            <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                                                                            <option value="+08:75">(GMT +8:45) Eucla</option>
                                                                            <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                                                                            <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                                                                            <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                                                                            <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                                                                            <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                                                                            <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                                                                            <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                                                                            <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                                                                            <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                                                                            <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                                                                        </select>
                                                                    </div>

                                                                    <div className="form-group mar30">
                                                                        <label>Language</label>
                                                                        <select className="form-control">
                                                                            <option>English</option>
                                                                        </select>
                                                                    </div>

                                                                    {/* <div className="form-group">
                                                                        <h3>BETTING PREFERENCES</h3>
                                                                        <p> <label className="container-checkbox">
                                                                            <input type="checkbox" />
                                                                            <span className="checkmark"></span>
                                                                        </label> Always accept better odds <i
                                                                            className="fa fa-info-circle"
                                                                            aria-hidden="true"></i>
                                                                        </p>

                                                                        <p>
                                                                            <label className="container-checkbox">
                                                                                <input type="checkbox" />
                                                                                <span className="checkmark"></span>
                                                                            </label> Use default stake amount <i
                                                                                className="fa fa-info-circle"
                                                                                aria-hidden="true"></i>
                                                                        </p>

                                                                        <p>
                                                                            <label className="container-checkbox">
                                                                                <input type="checkbox" />
                                                                                <span className="checkmark"></span>
                                                                            </label> Always bet maximum amount <i
                                                                                className="fa fa-info-circle"
                                                                                aria-hidden="true"></i>
                                                                        </p>

                                                                        <p>
                                                                            <label className="container-checkbox">
                                                                                <input type="checkbox" />
                                                                                <span className="checkmark"></span>
                                                                            </label> Enable BetNav predictions for
                                                                                live soccer matchups? <i
                                                                                className="fa fa-info-circle"
                                                                                aria-hidden="true"></i>
                                                                        </p>
                                                                    </div>
                                                                    <br />
                                                                    <div className="form-group">
                                                                        <strong> Default for starting
                                                                                pitchers</strong>
                                                                        <br />
                                                                        <br />
                                                                        <div className="bnt-dsbl">
                                                                            <a className="lsted" href="#">Listed</a>
                                                                            <a className="action"
                                                                                href="#">Action</a>
                                                                            <div className="clear-fix"></div>
                                                                        </div>
                                                                    </div> */}
                                                                    {/* <div className="prifrn redio-sec">
                                                                        <h4 className="h4">MARKETING PREFERENCES
                                                                            </h4>
                                                                        <strong>Choose how you would prefer to be
                                                                        informed about our promotions and our
                                                                                latest news. </strong>
                                                                        <div
                                                                            className="rd-d d-flex justify-content-around">
                                                                            <p>Email</p>
                                                                            <p>
                                                                                <input type="radio" id="test1"
                                                                                    name="radio-group" checked="" />
                                                                                <label for="test1">Yes</label>
                                                                            </p>
                                                                            <p>
                                                                                <input type="radio" id="test2"
                                                                                    name="radio-group" />
                                                                                <label for="test2">no</label>
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            className="rd-d d-flex justify-content-around">
                                                                            <p>Phone</p>
                                                                            <p>
                                                                                <input type="radio" id="test3"
                                                                                    name="radio-group" checked="" />
                                                                                <label for="test3">Yes</label>
                                                                            </p>
                                                                            <p>
                                                                                <input type="radio" id="test4"
                                                                                    name="radio-group" />
                                                                                <label for="test4">no</label>
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            className="rd-d d-flex justify-content-around">
                                                                            <p>Post</p>
                                                                            <p>
                                                                                <input type="radio" id="test3"
                                                                                    name="radio-group"
                                                                                    checked="true" />
                                                                                <label for="test3">Yes</label>
                                                                            </p>
                                                                            <p>
                                                                                <input type="radio" id="test4"
                                                                                    name="radio-group" />
                                                                                <label for="test4">no</label>
                                                                            </p>
                                                                        </div>
                                                                    </div> */}
                                                                    <button type="submit"
                                                                        className="clr-blue btn-smt">save </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/faq">
                                        <div className="col-in faq">
                                            <center>
                                                <h2>Frequently Asked Questions</h2>
                                            </center>
                                            <h2>My Account</h2>
                                            <h5>Username and password</h5>
                                            <p>If you have forgotten your login details, please do the
                                                                following:</p>
                                            <ul>
                                                <li>1. Click the LOGIN button to bring up the “Forgot
                                                                    your username / password?” option.</li>
                                                <li>2. To retrieve your Username, enter the email
                                                address associated with your account and it will be
                                                                    sent to you there.</li>
                                                <li>3. To reset your password, enter your Username and a
                                                link will be sent to the email address associated
                                                with your account. Click on the link in the email to
                                                                    be brought to the password reset page.</li>
                                            </ul>

                                            <p>If your account has been suspended due to multiple failed
                                            login attempts, please contact Customer Service. For the
                                            quickest resolution, please also include your username
                                            and the answer to your security question (ex. Mother's
                                            maiden name, Name of Pet, Favorite city, Favorite team,
                                                                etc.)</p>

                                            <h5>Security Questions</h5>
                                            <p>If you have forgotten your security question or password
                                            or would like to update any of these please go to
                                                                settings and password and security</p>
                                            <h5>Email / Address</h5>
                                            <p>How do I update my email or address, click on my account
                                                                and personal details? </p>

                                            <h2>Deposits or Withdrawals</h2>
                                            <h5>Deposits</h5>
                                            <p>Deposits can be done under my account and deposit
                                            section. Your account will be credited as soon as we
                                            receive the funds. You will receive an email
                                            notification and your mailbox in your PAYPER WIN
                                            account. PAY PER WIN does not charge any fees for credit
                                                                card deposits.</p>
                                            <h5>Withdrawals</h5>
                                            <p>Withdrawals can be made under my account and withdrawal
                                            section. Withdrawal requests for registered accounts
                                            received before 12am ET will be processed the following
                                                                business day.</p>
                                            <p>Withdrawal requests for Registered Accounts that are
                                            received before 12 a.m. Eastern Time will be processed
                                            the following business day (Monday to Friday only, not
                                            including weekends or holidays). For first time
                                            withdrawals this will need to be cleared by our Security
                                            Team. This process can take up to 3 business days. To
                                            cancel a withdrawal, click on the withdrawal and select
                                            cancel, and the money will be refunded back to your
                                                                account.</p>

                                            <h2>Registration</h2>
                                            <p>Our License Agreement requires us to adhere to rules
                                            regarding customer security and identification.
                                            Documentation is required for every account holder. We
                                            request to confirm age, address and deposit and
                                                                withdrawal information.</p>
                                            <h5>Register my account</h5>
                                            <p>The sooner you register your account, the sooner you may
                                                                enjoy higher deposit limits and quicker payouts</p>
                                            <p>For information about account information please email:
                                                                registrations@payperwin.co</p>

                                            <h5>Registration process</h5>
                                            <p>Usually this process takes up to 3 days. Our team will
                                            review the documents and once reviewed a registration
                                            representative will contact you to confirm your account.
                                                            </p>

                                            <h5>Sending registration documents</h5>
                                            <p>
                                                You can upload your documents directly to our website.
                                                Click here to upload your images now, or alternatively
                                                paste the following link:
                                                http://www.payperwin.co/uploadmydocuments You can also
                                                email digital photo of your documents and email them to
                                                us: registrations@payperwin.co Acceptable forms of
                                                documentation are government issued identification.
                                                Please make sure all documents are clear and readable. A
                                                confirmation email will be sent once we have received
                                                and reviewed them.
                                                            </p>
                                            <p>
                                                We are committed to protecting the privacy and security
                                                of your personal information. In this respect we have
                                                invested heavily in world class information management
                                                systems to keep your details encrypted and secure. Click
                                                here to read more about our Privacy Policy. You can also
                                                click here to read about how we keep your personal and
                                                financial information safe.
                                                            </p>
                                            <p>
                                                We take your online security seriously, and know the
                                                safety of your information is important to you. With
                                                this in mind, we may ask you for additional
                                                identification to confirm requests originate with you.
                                                            </p>
                                            <p>
                                                Sports Interaction recognizes that online security is an
                                                area of vital importance to all players. To this end,
                                                players will be asked to provide identification and
                                                proof of address for security purposes to ensure the
                                                validity of any transaction conducted on their account.
                                                A player's registered address should match that
                                                registered with their method of payment, eg. billing
                                                address for credit card payments. Failure to provide
                                                sufficient documentation as requested will result in
                                                that player's account transactions being held or
                                                suspended until such time as identification and proof of
                                                address is received and authenticated.
                                                            </p>
                                            <h2>Managing Bets</h2>
                                            <h5>Bet Minimum</h5>
                                            <ul>
                                                <li>The bet minimum is $1 dollar.</li>
                                                <li>The wallet minimum is $25 dollars.</li>
                                                <li>The minimum balance to maintain an active account is
                                                                    $5 dollars.</li>
                                            </ul>
                                            <h5>Bet Process Time</h5>
                                            <p>
                                                <strong>Pending:</strong> your bet is awaiting
                                                                acceptance from an opposing Bettor. You bet could remain
                                                                in this state up to game start time, if the bet is not
                                                                accepted, your funds will be returned back to you
                                                                immediately and available to bet again with. In some
                                                                cases, a portion of your bet will be accepted and will
                                                                leave a portion as pending. If the pending amount is
                                                                matched at a later time prior to event start time then
                                                                the bet will be accepted. If the no opposing bettor bets
                                                                against you for the remaining pending amount prior to
                                                                the start time of the event, the remainder will be
                                                                cancelled and returned to you.
                                                            </p>
                                            <p>
                                                <strong>Accepted:</strong> Your bet is now accepted;
                                                                this means someone has bet against you. The winner is
                                                                paid once the score or event is finalized.
                                                            </p>
                                            <p>
                                                <strong>Cancelled:</strong> Your bet is cancelled if the
                                                                event is cancelled, if the event is postponed then your
                                                                bet will be rescheduled. Another chance of cancellation
                                                                of your bet is if no opposing bettor bets against you,
                                                                in this case your money will be returned to your
                                                                account.
                                                            </p>
                                            <p>
                                                <strong>Cancelling a Bet:</strong> Bets cannot be
                                                                altered or cancelled. Please ensure that all of your bet
                                                                details are correct, each Bettor may not change or
                                                                cancel a bet. Every user must ensure that all details of
                                                                their bets are correct.
                                                            </p>

                                            <h5>Odds and Prices</h5>
                                            <p>American Odds</p>
                                            <p>
                                                A price listed as +200 means that the bettor will return
                                                $200 profit on every $100 bet, in addition to the
                                                original staked amount. +300 will return $300 profit for
                                                every $100 bet, in addition to the original staked
                                                amount.
                                                            </p>
                                            <p>
                                                A price listed as -200 means that the bettor must bet
                                                $200 in order to have a profit of $100, in addition to
                                                the original staked amount. -300 would mean for every
                                                $300 bet $100 profit would be made, in addition to the
                                                original staked amount.
                                                            </p>
                                            <p>
                                                Decimal
                                                            </p>
                                            <p>
                                                A price listed at 3.00 means that the bet will return
                                                $300 for every $100 bet, including the staked amount. A
                                                price listed at 3.00 means that the bet will return $300
                                                for every $100 bet, including the original staked amount
                                                            </p>
                                            <h5>
                                                Bet Status
                                                            </h5>
                                            <p>
                                                Win: your bet has won
                                                            </p>
                                            <p>
                                                Loss: your bet has loss
                                                            </p>
                                            <p>
                                                Cancelled: your bet is cancelled
                                                            </p>
                                            <h5>
                                                Fees
                                                            </h5>
                                            <p>
                                                To place a bet online is free, only a winner is charged
                                                3% transaction fee for facilitating payment from the
                                                opposing bettor.
                                                            </p>
                                        </div>
                                    </Route>
                                    <Route path="/inbox">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Inbox' });
                                                return (
                                                    <React.Fragment>
                                                        <div className="col-in pad-bt">
                                                            <h1 className="main-heading-in">Inbox</h1>
                                                            <div className="main-cnt">
                                                                <div className="in-text">
                                                                    <a href="#"> fab 04 </a><a href="#">
                                                                        [Basketball] [LIVE NBA] [Game] [Minnesota
                                                                        Timberwolves vs. Sacramento Kings]. The
                                                                            event has been re-graded fro </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/payment-options">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Payment Options' });
                                                return (
                                                    <div className="col-in">
                                                        <h1 className="main-heading-in">Payment methods</h1>
                                                        <div className="main-cnt">
                                                            <p>
                                                                There are numerous payment options available to
                                                                Pinnacle customers.
                                                                They are determined by the currency you chose when
                                                                you open an account.
                                                                </p>

                                                            <div className="tab-container">
                                                                <div className="tab-navigation">
                                                                    <label>Select currency</label>
                                                                    <select id="select-box"
                                                                        className="form-control">
                                                                        <option value="1">Australian Dollars
                                                                            </option>
                                                                        <option value="2">Canadian Dollars</option>
                                                                        <option value="3">Colombian Pesos</option>
                                                                        <option value="4">Czech Koruna</option>
                                                                        <option value="5">Norwegian Krone</option>
                                                                    </select>
                                                                </div>

                                                                <div id="tab-1" className="tab-content">

                                                                    <h4 className="h4">Deposits</h4>
                                                                    <br />
                                                                    <br />
                                                                    <br />


                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/resizeImage.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/idebit.png" />
                                                                        </div>

                                                                        <div className="col-sm-8 ">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500


                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/ecopayz.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/neosurf.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div id="tab-2" className="tab-content" style={{
                                                                    display: 'none'
                                                                }}>
                                                                    <h4 className="h4">Deposits</h4>
                                                                    <br />
                                                                    <br />
                                                                    <br />
                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/idebit.png" />
                                                                        </div>

                                                                        <div className="col-sm-8 ">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500


                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/resizeImage.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/ecopayz.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                                <div id="tab-3" className="tab-content" style={{
                                                                    display: 'none'
                                                                }}>
                                                                    <h4 className="h4">Deposits</h4>
                                                                    <br />
                                                                    <br />
                                                                    <br />
                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/idebit.png" />
                                                                        </div>

                                                                        <div className="col-sm-8 ">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500


                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/resizeImage.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/ecopayz.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/neosurf.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id="tab-4" className="tab-content" style={{
                                                                    display: 'none'
                                                                }}>
                                                                    <h4 className="h4">Deposits</h4>
                                                                    <br />
                                                                    <br />
                                                                    <br />
                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/idebit.png" />
                                                                        </div>

                                                                        <div className="col-sm-8 ">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500


                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/resizeImage.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/ecopayz.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/neosurf.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id="tab-5" className="tab-content" style={{
                                                                    display: 'none'
                                                                }}>
                                                                    <h4 className="h4">Deposits</h4>
                                                                    <br />
                                                                    <br />
                                                                    <br />


                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/neosurf.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>

                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500

                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/ecopayz.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong></li>
                                                                                <li>free :<strong>&nbsp; Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction: &nbsp;&lrm; €37,500</li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/idebit.png" />
                                                                        </div>
                                                                        <div className="col-sm-8 ">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>
                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500
                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row pymnt-mthd">
                                                                        <div
                                                                            className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                                                            <img src="images/resizeImage.png" />
                                                                        </div>

                                                                        <div className="col-sm-8">
                                                                            <ul className="paymnt-mdhd">
                                                                                <li> AstroPay <strong>Card</strong>
                                                                                </li>
                                                                                <li>free :<strong>&nbsp;
                                                                                            Free</strong> </li>
                                                                                <li>min : &nbsp;10</li>
                                                                                <li>Max : &nbsp; Transaction:
                                                                                &nbsp;&lrm; €37,500
                                                                                    </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/transaction-history">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Transaction History' });
                                                return (
                                                    <div className="col-in">
                                                        <h1 className="main-heading-in">Transaction history</h1>
                                                        <div className="main-cnt">
                                                            <ul
                                                                className="histyr-list d-flex justify-content-space">
                                                                <li>FILTER OPTIONS</li>
                                                                <li><a href="#"> <i
                                                                    className="fas fa-calendar-week"></i>
                                                                            Date Range </a></li>
                                                                <li><a href="#"> <i
                                                                    className="fas fa-business-time"></i>
                                                                            Filter </a></li>
                                                            </ul>
                                                            <div className="amount-dtails">
                                                                <div className="row">
                                                                    <div className="col-sm-8">
                                                                    </div>
                                                                    <div className="col-sm-2 text-right">
                                                                        <strong> AMOUNT </strong>
                                                                    </div>
                                                                    <div className="col-sm-2 text-right">
                                                                        <strong> BALANCE </strong>
                                                                    </div>
                                                                </div>
                                                                <div className="row amount-col bg-color-box">
                                                                    <div className="col-sm-8">
                                                                        <span>Thu, Apr 30, 2020</span>
                                                                        <small>1 Wager(s) Placed</small>
                                                                    </div>
                                                                    <div className="col-sm-2 text-right">
                                                                        <small>-5.00</small>
                                                                    </div>
                                                                    <div className="col-sm-2 text-right">
                                                                        <small>93.5</small>
                                                                    </div>
                                                                </div>
                                                                <div className="row amount-col bg-color-box">
                                                                    <div className="col-sm-8">
                                                                        <span>Thu, Apr 30, 2020</span>
                                                                        <small>1 Wager(s) Placed</small>
                                                                    </div>

                                                                    <div className="col-sm-2 text-right">
                                                                        <small>-5.00</small>
                                                                    </div>
                                                                    <div className="col-sm-2 text-right">
                                                                        <small>93.5</small>
                                                                    </div>
                                                                </div>
                                                                <div className="row amount-col bg-color-box">
                                                                    <div className="col-sm-8">
                                                                        <span>Thu, Apr 30, 2020</span>
                                                                        <small>1 Wager(s) Placed</small>
                                                                    </div>

                                                                    <div className="col-sm-2 text-right">
                                                                        <small>-5.00</small>

                                                                    </div>
                                                                    <div className="col-sm-2 text-right">
                                                                        <small>93.5</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="load-m text-center">
                                                                <a className="load-more" href="#">Load More</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/security">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Password and Security' });
                                                return (
                                                    <div className="col-in">
                                                        <h1 className="main-heading-in">Password and security</h1>
                                                        <div className="main-cnt">
                                                            <form>

                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <div className="card scrity mt-3 tab-card">
                                                                            <div
                                                                                className="card-header tab-card-header">
                                                                                <ul className="nav nav-tabs card-header-tabs"
                                                                                    id="myTab" role="tablist">
                                                                                    <li className="nav-item">
                                                                                        <a className="nav-link"
                                                                                            id="one-tab"
                                                                                            data-toggle="tab"
                                                                                            href="#one" role="tab"
                                                                                            aria-controls="One"
                                                                                            aria-selected="true">PASSWORD
                                                                                                AND SECURITY</a>
                                                                                    </li>
                                                                                    <li className="nav-item">
                                                                                        <a className="nav-link"
                                                                                            id="two-tab"
                                                                                            data-toggle="tab"
                                                                                            href="#two" role="tab"
                                                                                            aria-controls="Two"
                                                                                            aria-selected="false">LAST
                                                                                                LOGINS</a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>

                                                                            <div className="tab-content"
                                                                                id="myTabContent">
                                                                                <div className="tab-pane fade show active p-3"
                                                                                    id="one" role="tabpanel"
                                                                                    aria-labelledby="one-tab">
                                                                                    <h4 className="h4"> PASSWORD
                                                                                        </h4>
                                                                                    <div className="form-group">
                                                                                        <label>Current
                                                                                                password</label>
                                                                                        <input type="text"
                                                                                            name="pswrd"
                                                                                            className="form-control" />
                                                                                    </div>

                                                                                    <div className="form-group">
                                                                                        <label>New password</label>
                                                                                        <input type="text"
                                                                                            name="nw-pswrd"
                                                                                            className="form-control" />
                                                                                    </div>

                                                                                    <div className="form-group">
                                                                                        <label>Confirm
                                                                                                password</label>
                                                                                        <input type="text"
                                                                                            name="crn-pswrd"
                                                                                            className="form-control" />
                                                                                    </div>

                                                                                    <button type="submit"
                                                                                        className="btn-smt">save
                                                                                        </button>
                                                                                    <br />
                                                                                    <br />
                                                                                    <h4 className="h4">SECURITY
                                                                                            QUESTION AND ANSWER</h4>
                                                                                    <div className="form-group">
                                                                                        <label>Security
                                                                                                question</label>
                                                                                        <input type="text"
                                                                                            name="tkd"
                                                                                            placeholder="Tickets"
                                                                                            className="form-control" />
                                                                                        <i
                                                                                            className="fas fa-check"></i>
                                                                                        <i className="fa fa-info-circle"
                                                                                            aria-hidden="true"></i>
                                                                                    </div>

                                                                                    <div className="form-group">
                                                                                        <label>Security
                                                                                                question</label>
                                                                                        <input type="text"
                                                                                            name="tkd"
                                                                                            placeholder="Tickets"
                                                                                            className="form-control" />
                                                                                        <i
                                                                                            className="fas fa-check"></i>
                                                                                        <i className="fa fa-info-circle"
                                                                                            aria-hidden="true"></i>
                                                                                    </div>

                                                                                    <button type="submit"
                                                                                        className="btn-smt">save
                                                                                        </button>
                                                                                </div>
                                                                                <div className="login-d tab-pane fade p-3"
                                                                                    id="two" role="tabpanel"
                                                                                    aria-labelledby="two-tab">
                                                                                    <h4 className="h4">SUCCESSFUL
                                                                                            LOGINS</h4>
                                                                                    <div className="row bord-b">
                                                                                        <div className="col-sm-8">
                                                                                            Date and Time
                                                                                            </div>

                                                                                        <div className="col-sm-4">
                                                                                            IP Address
                                                                                            </div>
                                                                                    </div>

                                                                                    <div className="row">
                                                                                        <div className="col-sm-8">
                                                                                            Thursday, April 30,
                                                                                            2020, 16:57
                                                                                            </div>

                                                                                        <div className="col-sm-4">

                                                                                            103.214.119.44
                                                                                            </div>
                                                                                    </div>

                                                                                    <div className="row">
                                                                                        <div className="col-sm-8">
                                                                                            Thursday, April 30,
                                                                                            2020, 10:22
                                                                                            </div>

                                                                                        <div className="col-sm-4">
                                                                                            103.214.119.12
                                                                                            </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-sm-8">
                                                                                            Thursday, April 30,
                                                                                            2020, 09:57
                                                                                            </div>
                                                                                        <div className="col-sm-4">
                                                                                            51.79.70.147
                                                                                            </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/account" component={Profile}>

                                    </Route>
                                    <Route path="/self-exclusion">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Self Exclusion' });
                                                return (
                                                    <div className="col-in">
                                                        <h1 className="main-heading-in">Self exclusion</h1>
                                                        <div className="main-cnt redio-sec">
                                                            <p className="text-t"><i className="fa fa-info-circle"
                                                                aria-hidden="true"></i> Your account is
                                                                    currently above zero. We recommend you withdraw
                                                                    remaining funds in your account before you
                                                                    self-exclude. Withdraw funds here. </p>
                                                            <p>If you need to take a break from gambling to prevent
                                                            or control a possible gambling addiction, we
                                                            recommend you withdraw funds in your account and
                                                            make your account inaccesible by excluding yourself
                                                            either temporarily or permanently.
                                                                </p>
                                                            <a className="read-more" href="#">Read more </a>
                                                            <h4 className="h4">How long would you like to self-exclude?
                                                                </h4>
                                                            <form action="#">
                                                                <p>
                                                                    <input type="radio" id="test1"
                                                                        name="radio-group" checked="true" />
                                                                    <label for="test1">6 months</label>
                                                                </p>
                                                                <p>
                                                                    <input type="radio" id="test2"
                                                                        name="radio-group" />
                                                                    <label for="test2">1 year</label>
                                                                </p>
                                                                <p>
                                                                    <input type="radio" id="test3"
                                                                        name="radio-group" />
                                                                    <label for="test3">3 years</label>
                                                                </p>
                                                                <p>
                                                                    <input type="radio" id="test4"
                                                                        name="radio-group" />
                                                                    <label for="test4">5 years</label>
                                                                </p>
                                                                <p>
                                                                    <input type="radio" id="test5"
                                                                        name="radio-group" />
                                                                    <label for="test5">Permanent</label>
                                                                </p>
                                                                <button type="submit"
                                                                    className="btn-smt clr-t-l mar30">Permanent
                                                                    </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/deactivation">
                                        {
                                            () => {
                                                setTitle({ pageTitle: 'Deactivation' });
                                                return (
                                                    <div className="col-in">
                                                        <h1 className="main-heading-in">Account deactivation</h1>

                                                        <div className="main-cnt redio-sec">

                                                            <p className="text-t"><i className="fa fa-info-circle" aria-hidden="true"></i>
                                                                Your account is currently above zero. We recommend
                                                                you withdraw your remaining funds in your account
                                                                before you deactivate your account. <a href="#"><strong></strong></a><strong>Withdraw funds here.</strong></p>

                                                            <p>If you need to take a break from gambling to prevent
                                                            or control a possible gambling addiction, please
                                                            consider entering a self-exclusion. If you want to
                                                            stop gambling with us for other reasons, you may do
                                                            so by deactivating your account, either temporarily
                                                                    or permanently.</p>
                                                            <a className="read-more" href="#">Read more </a>

                                                            <h4 className="h4">How long would you like to self-exclude?
                                                                </h4>
                                                            <form action="#">
                                                                <p>
                                                                    <input type="radio" id="test1"
                                                                        name="radio-group" checked="true" />
                                                                    <label for="test1">6 months</label>
                                                                </p>
                                                                <p>
                                                                    <input type="radio" id="test2"
                                                                        name="radio-group" />
                                                                    <label for="test2">1 year</label>
                                                                </p>
                                                                <p>
                                                                    <input type="radio" id="test3"
                                                                        name="radio-group" />
                                                                    <label for="test3">3 years</label>
                                                                </p>

                                                                <p>
                                                                    <input type="radio" id="test4"
                                                                        name="radio-group" />
                                                                    <label for="test4">5 years</label>
                                                                </p>

                                                                <p>
                                                                    <input type="radio" id="test5"
                                                                        name="radio-group" />
                                                                    <label for="test5">Permanent</label>
                                                                </p>

                                                                <div className="form-group mar30">
                                                                    <h4 className="h4">Why are you deactivating your
                                                                            account?</h4>
                                                                    <select className="form-control">
                                                                        <option>
                                                                            select a reason
                                                                            </option>
                                                                    </select>
                                                                </div>
                                                                <button type="submit" className="btn-smt clr-blue">next</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }
                                    </Route>
                                    <Route path="/">
                                        {
                                            () => {
                                                setTitle({ pageTitle: '' });
                                                return (
                                                    <React.Fragment>
                                                        <Carousel autoPlay={8000} animationSpeed={1800} infinite
                                                            stopAutoPlayOnHover={true}>
                                                            <Link to={{ pathname: '/signup' }}>
                                                                <img src="/images/banner-1.jpg" />
                                                            </Link>
                                                            <Link to={{ pathname: '/how-it-works' }}>
                                                                <img src="/images/banner-2.jpg" />
                                                            </Link>
                                                            <Link to={{ pathname: '/sport/Politics' }}>
                                                                <img src="/images/politics.jpg" />
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

