import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import SimpleLogin from './simpleLogin';
import { FormattedMessage, injectIntl } from "react-intl";
import CookieAccept from "./cookieAccept";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import timeHelper from "../helpers/timehelper";
import LoginModal from './loginModal';
import ForgotPasswordModal from './forgotPasswordModal';
import numberFormat from '../helpers/numberFormat';
import _env from '../env.json';
const serverUrl = _env.appUrl;

function logout(getUser, history) {
    const url = `${serverUrl}/logout`;
    axios.get(url, { withCredentials: true })
        .then(() => {
            getUser();
            history.replace({ pathname: '/' });
        });
}

class Header extends Component {
    constructor(props) {
        super(props);
        const { timezone } = props;
        this.state = {
            userDropDownOpen: false,
            oddsDropDownOpen: false,
            langDropDownOpen: false,
            timerInterval: null,
            timeString: timeHelper.convertTimeClock(new Date(), timezone),
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        const timerInterval = setInterval(this.headerTimer.bind(this), 1000);
        this._isMounted && this.setState({ timerInterval });
    }

    headerTimer = () => {
        const { timezone } = this.props;
        const timeString = timeHelper.convertTimeClock(new Date(), timezone);
        this._isMounted && this.setState({ timeString });
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { timerInterval } = this.state;
        clearInterval(timerInterval);
        this.setState({ timerInterval: null });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    toggleField = (fieldName, forceState) => {
        if (typeof this.state[fieldName] !== 'undefined') {
            this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }

    logout = () => {
        const { getUser, history } = this.props;
        logout(getUser, history);
        this.setState({ userDropDownOpen: false, oddsDropDownOpen: false, langDropDownOpen: false });
    }

    getOddsFormatString = () => {
        const { oddsFormat, intl } = this.props;
        switch (oddsFormat) {
            case 'decimal':
                return intl.formatMessage({ id: "COMPONENTS.DECIMAL.ODDS" });
            case 'american':
            default:
                return intl.formatMessage({ id: "COMPONENTS.AMERICAN.ODDS" });
        }
    }

    setOddsFormat = (format) => {
        const { setOddsFormat } = this.props;
        setOddsFormat(format);
        this._isMounted && this.setState({ oddsDropDownOpen: false });
    }

    setDisplayMode = (display_mode) => {
        const { setDisplayMode } = this.props;
        setDisplayMode(display_mode);
    }

    setLanguage = (lang) => {
        const { setLanguage } = this.props;
        setLanguage(lang);
        this._isMounted && this.setState({ langDropDownOpen: false });
    }

    balanceString = (balance) => {
        balance = parseInt(balance * 100);
        return balance / 100;
    }

    onSearch = (evt) => {
        const { search, history } = this.props;
        if (evt.key !== 'Enter') return;
        history.push(`/search/${search}`);
    }

    render() {
        const { userDropDownOpen,
            oddsDropDownOpen,
            langDropDownOpen,
            timeString,
        } = this.state;
        const { toggleField,
            user,
            location,
            search,
            lang,
            setSearch,
            acceptCookie,
            acceptCookieAction,
            dark_light,
            getUser,
            showLoginModal,
            showForgotPasswordModal,
            showLoginModalAction,
            showForgotPasswordModalAction
        } = this.props;
        const { pathname } = location;
        return (
            <header className="header">
                {!acceptCookie && <CookieAccept acceptCookieAction={acceptCookieAction} />}
                <div className="header-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-5 col-sm-6">
                                <button className="navbar-toggler responsive-menu" type="button" onClick={() => toggleField('menuOpen')}>
                                    <span className="navbar-toggler-icon"></span>
                                    <span className="navbar-toggler-icon"></span>
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <Link to={{ pathname: '/' }} className="logo">
                                    <img src="/images/logo-white.png" />
                                </Link>
                            </div>
                            <div className="col-7 col-sm-6 text-right">
                                {user ? (
                                    <div className="login-nav-contain">
                                        <ul className="login-nav">
                                            <li className="not-mobile"><Link to={{ pathname: '/inbox' }} className="blue-icon"><i className="fas fa-envelope mx-0" />{user.messages ? <span className="inbox-count">{user.messages}</span> : null}</Link></li>
                                            {!user.autobet && <li>
                                                <span className="blue-icon">
                                                    <Link to={{ pathname: '/deposit' }}>
                                                        CAD {user.currency} {user.balance ? numberFormat(this.balanceString(user.balance)) : 0}
                                                    </Link>
                                                    &nbsp;<i className="fa fa-refresh cursor-pointer" onClick={() => getUser()} />
                                                </span>
                                            </li>}
                                            <li className="not-mobile">
                                                <Link to={{ pathname: '/deposit' }} className="deposit">
                                                    <span>{<FormattedMessage id="COMPONENTS.DEPOSIT" />}</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <a className="username blue-icon" onClick={() => this.toggleField('userDropDownOpen')}>
                                                    <i className="fas fa-user" />&nbsp;<span className="not-mobile emailspan"><FormattedMessage id="COMPONENTS.MY.ACCOUNT" /></span>&nbsp;<i className="fa fa-caret-down not-mobile" />
                                                </a>
                                            </li>
                                        </ul>
                                        {userDropDownOpen ? (
                                            <React.Fragment>
                                                <div className="background-closer" onClick={() => this.toggleField('userDropDownOpen')} />
                                                <div className="login-dropdown">
                                                    <ul>
                                                        <li className="mobile username">
                                                            <FormattedMessage id="COMPONENTS.MY.ACCOUNT" />
                                                        </li>
                                                        <li className="mobile" onClick={() => toggleField('accountMenuMobileOpen')}>
                                                            <FormattedMessage id="COMPONENTS.MY.ACCOUNT" />
                                                        </li>
                                                        {!user.autobet && <li>
                                                            <Link to={{ pathname: '/preferences' }}><FormattedMessage id="COMPONENTS.PREFERENCES" /></Link>
                                                        </li>}
                                                        {!user.autobet && <li>
                                                            <Link to={{ pathname: '/deposit' }}><FormattedMessage id="COMPONENTS.DEPOSIT" /></Link>
                                                        </li>}
                                                        {!user.autobet && <li>
                                                            <Link to={{ pathname: '/withdraw' }}><FormattedMessage id="COMPONENTS.WITHDRAW" /></Link>
                                                        </li>}
                                                        {user.autobet && <li>
                                                            <Link to={{ pathname: '/autobet-dashboard' }}><FormattedMessage id="COMPONENTS.HEADER.DASHBOARD" /></Link>
                                                        </li>}
                                                        <li>
                                                            <Link to={{ pathname: '/bets' }}><FormattedMessage id="COMPONENTS.OPENBETS" /></Link>
                                                        </li>
                                                        <li>
                                                            <button onClick={this.logout}><FormattedMessage id="COMPONENTS.LOGOUT" /><i className="fap fa-sign-out" /></button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </React.Fragment>
                                        ) : null}
                                    </div>
                                )
                                    : <SimpleLogin showLoginModal={() => showLoginModalAction(true)} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`header-bottom ${dark_light == 'light' ? 'light' : 'dark'}`}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="navbar-mobile">
                                    <button className="navbar-toggler responsive-cat" onClick={() => toggleField('sportsMenuMobileOpen')}>
                                        <span className="navbar-toggler-icon"></span>
                                        <span className="navbar-toggler-icon"></span>
                                        <span className="navbar-toggler-icon"></span>
                                        <FormattedMessage id="COMPONENTS.AZ.SPORTS" />
                                    </button>
                                    <ul className="navbar-nav-mobile navbar-nav">
                                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                            <center style={{ whiteSpace: "nowrap" }}>
                                                <Link to={{ pathname: '/' }} className="nav-link">
                                                    <i className="fas fa-users"></i><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" />
                                                </Link>
                                            </center>
                                        </li>
                                        <li className={`nav-item ${pathname === '/how-it-works' ? 'active' : ''}`}>
                                            <center style={{ whiteSpace: "nowrap" }}>
                                                <Link to={{ pathname: '/how-it-works' }} className="nav-link">
                                                    <i className="fas fa-info"></i><FormattedMessage id="COMPONENTS.HOW.IT.WORKS" />
                                                </Link>
                                            </center>
                                        </li>
                                        <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                                            <center style={{ whiteSpace: "nowrap" }}>
                                                <Link to={{ pathname: '/faq' }} className="nav-link">
                                                    <i className="fas fa-question"></i><FormattedMessage id="COMPONENTS.FAQ" />
                                                </Link>
                                            </center>
                                        </li>
                                        <li className={`nav-item ${pathname === '/articles' ? 'active' : ''}`}>
                                            <center style={{ whiteSpace: "nowrap" }}>
                                                <Link to={{ pathname: '/articles' }} className="nav-link">
                                                    <i className="fas fa-newspaper"></i><FormattedMessage id="COMPONENTS.ARTICLES" />
                                                </Link>
                                            </center>
                                        </li>
                                    </ul>
                                </div>
                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav">
                                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/' }} className="nav-link">
                                                <i className="fas fa-users"></i><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" />
                                            </Link>
                                        </li>
                                        <li className={`nav-item ${pathname === '/how-it-works' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/how-it-works' }} className="nav-link">
                                                <i className="fas fa-info"></i><FormattedMessage id="COMPONENTS.HOW.IT.WORKS" />
                                            </Link>
                                        </li>
                                        <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/faq' }} className="nav-link">
                                                <i className="fas fa-question"></i><FormattedMessage id="COMPONENTS.FAQ" />
                                            </Link>
                                        </li>
                                        <li className={`nav-item ${pathname === '/articles' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/articles' }} className="nav-link">
                                                <i className="fas fa-newspaper"></i><FormattedMessage id="COMPONENTS.ARTICLES" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {pathname !== '/sportsbook' && <div className={`header-search ${dark_light == 'light' ? 'light' : 'dark'}`}>
                    <div className="container">
                        <div className="d-flex justify-content-between">
                            <div className="">
                                <div className="search-box">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                    <input
                                        className="searh-f"
                                        type="search"
                                        placeholder="Search"
                                        value={search}
                                        onChange={(evt) => setSearch(evt.target.value)}
                                        onKeyDown={this.onSearch}
                                    />
                                </div>
                            </div>
                            <div className="">
                                <ul className="list-s">
                                    <li style={{ padding: '0 15px' }}>
                                        <div className={`displaymode_container ${dark_light == 'light' ? 'lightmode' : 'darkmode'}`}
                                            onClick={() => this.setDisplayMode(dark_light == 'light' ? 'dark' : 'light')}
                                        >
                                            <i className="far fa-sun lightmode_ico"></i>
                                            <i className="far fa-moon darkmode_ico"></i>
                                            <div className="lightmode_switch"></div>
                                        </div>
                                    </li>
                                    <li>
                                        <a onClick={() => this.toggleField('oddsDropDownOpen')} style={{ cursor: "pointer" }}>
                                            <i className="fa fa-info-circle" aria-hidden="true"></i>{this.getOddsFormatString()}<i className="fa fa-caret-down" aria-hidden="true"></i>
                                        </a>
                                        {oddsDropDownOpen ? (
                                            <React.Fragment>
                                                <div className="background-closer" onClick={() => this.toggleField('oddsDropDownOpen')} />
                                                <div className="odds-dropdown">
                                                    <ul>
                                                        <li onClick={() => this.setOddsFormat('american')}>
                                                            <i className="fa fa-info-circle" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.AMERICAN.ODDS" />
                                                        </li>
                                                        <li onClick={() => this.setOddsFormat('decimal')}>
                                                            <i className="fa fa-info-circle" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.DECIMAL.ODDS" />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </React.Fragment>
                                        ) : null}
                                    </li>
                                    <li>
                                        <a onClick={() => this.toggleField('langDropDownOpen')} style={{ cursor: "pointer" }}>{lang.toUpperCase()} <i className="fa fa-caret-down" aria-hidden="true"></i></a>
                                        {langDropDownOpen ? (
                                            <React.Fragment>
                                                <div className="background-closer" onClick={() => this.toggleField('langDropDownOpen')} />
                                                <div className="odds-dropdown">
                                                    <ul>
                                                        <li onClick={() => this.setLanguage('en')}>
                                                            <i className="fa fa-info-circle" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.LANGUAGE.ENGLISH" />
                                                        </li>
                                                        <li onClick={() => this.setLanguage('es')}>
                                                            <i className="fa fa-info-circle" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.LANGUAGE.SPANISH" />
                                                        </li>
                                                        <li onClick={() => this.setLanguage('ko')}>
                                                            <i className="fa fa-info-circle" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.LANGUAGE.KOREAN" />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </React.Fragment>
                                        ) : null}
                                    </li>
                                    <li>{timeString}</li>
                                    <li><Link to="/faq"><i className="fa fa-question-circle" aria-hidden="true"></i> <FormattedMessage id="COMPONENTS.HELP" /> </Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}
                {!user && showLoginModal && <LoginModal
                    closeModal={() => {
                        showLoginModalAction(false)
                    }}
                    forgotPassword={() => {
                        showForgotPasswordModalAction(true);
                        showLoginModalAction(false)
                    }}
                    getUser={getUser} />}
                {!user && showForgotPasswordModal && <ForgotPasswordModal
                    closeModal={() => {
                        showForgotPasswordModalAction(false);
                    }}
                    backToLogin={() => {
                        showForgotPasswordModalAction(false);
                        showLoginModalAction(true);
                    }} />}

                    {
                        
                    }
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    oddsFormat: state.frontend.oddsFormat,
    search: state.frontend.search,
    timezone: state.frontend.timezone,
    acceptCookie: state.frontend.acceptCookie,
    dark_light: state.frontend.dark_light,
    showLoginModal: state.frontend.showLoginModal,
    showForgotPasswordModal: state.frontend.showForgotPasswordModal,
    lang: state.frontend.lang,
    maxBetLimitTier: state.frontend.maxBetLimitTier,
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(Header))