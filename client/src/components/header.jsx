import React, { Component, createRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import SimpleLogin from './simpleLogin';
import { FormattedMessage, injectIntl } from "react-intl";
import CookieAccept from "./cookieAccept";
import AdminMessage from './adminMessage';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import timeHelper from "../helpers/timehelper";
import LoginModal from './loginModal';
import ForgotPasswordModal from './forgotPasswordModal';
import logout from '../libs/logout';
import numberFormat from '../helpers/numberFormat';
import Switch from './switch';

class Header extends Component {
    constructor(props) {
        super(props);
        const { timezone } = props;
        this.state = {
            oddsDropDownOpen: false,
            langDropDownOpen: false,
            timerInterval: null,
            timeString: timeHelper.convertTimeClock(new Date(), timezone),
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        // const timerInterval = setInterval(this.headerTimer.bind(this), 1000);
        // this._isMounted && this.setState({ timerInterval });
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
        const { getUser, history, toggleField } = this.props;
        logout(getUser, history);
        this.setState({ oddsDropDownOpen: false, langDropDownOpen: false });
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

    setLanguage = (lang) => {
        const { setLanguage } = this.props;
        setLanguage(lang);
        this._isMounted && this.setState({ langDropDownOpen: false });
    }

    balanceString = (balance) => {
        balance = parseInt(balance * 100);
        return balance / 100;
    }

    getImageSource = () => {
        const { lang } = this.props;
        switch (lang) {
            case 'ko':
                return '/media/svg/flags/018-south-korea.svg';
            case 'es':
                return '/media/svg/flags/016-spain.svg';
            case 'en':
            default:
                return '/media/svg/flags/226-united-states.svg';
        }
    }

    checkShowMessage = () => {
        const { adminMessage, adminMessageDismiss } = this.props;
        if (!adminMessage || !adminMessage.value || !adminMessage.value.show) return false;
        return adminMessageDismiss != adminMessage.updatedAt;
    }

    render() {
        const { oddsDropDownOpen, } = this.state;
        const {
            toggleField,
            user,
            acceptCookie,
            acceptCookieAction,
            getUser,
            showLoginModal,
            showForgotPasswordModal,
            showLoginModalAction,
            showForgotPasswordModalAction,
            adminMessage,
            dismissAdminMessage,
            showPromotionAction,
        } = this.props;
        const showMessage = this.checkShowMessage();
        const headerClass = !acceptCookie && showMessage ? 'msg-both' : (!acceptCookie || showMessage ? 'msg-one' : '');
        return (
            <header className={"header" + (headerClass ? ' ' + headerClass : '')}>
                {!acceptCookie && <CookieAccept acceptCookieAction={acceptCookieAction} />}
                {showMessage && <AdminMessage onDismiss={dismissAdminMessage} message={adminMessage} />}
                <div className="header-top">
                    <div className="container">
                        <div className="d-flex justify-content-between">
                            <div className="">
                                <Link to={{ pathname: '/' }} className="logo">
                                    <img src="/images/logo-white.png" />
                                </Link>
                            </div>
                            <div className="d-flex justify-content-end align-items-center">
                                <ul className="navbar-nav-mobile navbar-nav not-mobile">
                                    <li className={`nav-item`}>
                                        <center style={{ whiteSpace: "nowrap" }}>
                                            <Link to={{ pathname: '/' }} className="nav-link">
                                                <i className="fas fa-users"></i><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" />
                                            </Link>
                                        </center>
                                    </li>
                                    <li className={`nav-item`}>
                                        <center style={{ whiteSpace: "nowrap" }}>
                                            <a href="https://tickets.payperwin.com/" target="_blank" className="nav-link">
                                                <i className="fas fa-ticket"></i>Event Tickets
                                            </a>
                                        </center>
                                    </li>
                                    <li className="nav-item">
                                        <center style={{ whiteSpace: "nowrap" }}>
                                            <Link to={{ pathname: '/how-it-works' }} className="nav-link">
                                                <i className="fas fa-info"></i><FormattedMessage id="COMPONENTS.HOW.IT.WORKS" />
                                            </Link>
                                        </center>
                                    </li>
                                </ul>
                                {!user && <SimpleLogin />}
                                {user && <ul className="login-nav">
                                    <li>
                                        <span className="blue-icon">
                                            <Link to={{ pathname: '/deposit' }}>
                                                CAD ${user.balance ? numberFormat(this.balanceString(user.balance)) : 0}
                                            </Link>
                                            &nbsp;<i className="fa fa-refresh cursor-pointer not-mobile" onClick={() => getUser()} />
                                        </span>
                                    </li>
                                </ul>}
                                <button className="navbar-toggler responsive-menu"
                                    onClick={() => toggleField('menuOpen')}>
                                    <span className="navbar-toggler-icon"></span>
                                    <span className="navbar-toggler-icon"></span>
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`header-bottom`}>
                    <div className="container p-0">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className='promotion-botton-wrap' onClick={() => showPromotionAction(true)}>
                                    <div className='promotion-botton'><span>What's New</span></div>
                                </div>
                            </div>
                            <ul className="list-s">
                                <li className='d-flex align-items-center'>
                                    <span className='pr-2'>View</span>
                                    <Switch />
                                </li>
                                <li>
                                    <a onClick={() => this.toggleField('oddsDropDownOpen')} style={{ cursor: "pointer" }}>
                                        <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp;{this.getOddsFormatString()}&nbsp;<i className="fa fa-caret-down" aria-hidden="true"></i>
                                    </a>
                                    {oddsDropDownOpen && (
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
                                    )}
                                </li>

                                {/* <li>{timeString}</li> */}
                            </ul>
                        </div>
                    </div>
                </div>
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
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    oddsFormat: state.frontend.oddsFormat,
    search: state.frontend.search,
    timezone: state.frontend.timezone,
    acceptCookie: state.frontend.acceptCookie,
    showLoginModal: state.frontend.showLoginModal,
    showForgotPasswordModal: state.frontend.showForgotPasswordModal,
    lang: state.frontend.lang,
    pro_mode: state.frontend.pro_mode,
    maxBetLimitTier: state.frontend.maxBetLimitTier,
    adminMessage: state.frontend.adminMessage,
    adminMessageDismiss: state.frontend.adminMessageDismiss
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(Header))