import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { FormattedMessage, injectIntl } from 'react-intl';
import logout from '../libs/logout';
import sportNameImage from '../helpers/sportNameImage';
import { getSportsDir } from '../redux/services';
import Switch from './switch';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: null,
            sports: [],
        }
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        getSportsDir()
            .then(({ data }) => {
                if (data) {
                    this._isMounted && this.setState({ sports: data })
                }
            })
            .catch((err) => {
            });
        document.body.classList.add('noscroll');
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.body.classList.remove('noscroll');
    }

    logout = () => {
        const { getUser, history, toggleField } = this.props;
        logout(getUser, history);
        toggleField('menuOpen');
    }

    getSportName = (sport) => {
        switch (sport) {
            case 'American Football':
                return 'Football';
            case 'Ice Hockey':
                return 'Hockey';
            default:
                return sport;
        }
    }

    render() {
        const {
            location, toggleField, oddsFormat,
            setOddsFormat, setLanguage, user,
            intl, showLoginModalAction,
        } = this.props;
        const { pathname } = location;
        const { showMenu, sports } = this.state;
        return (
            <>
                <div className="background-closer bg-modal" onClick={() => toggleField('menuOpen')} />
                <div className="mobile-menu">
                    <div className='d-flex justify-content-between p-4' style={{ alignItems: 'center' }}>
                        <h3 className='menu-title' style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user ? 'Hi, ' + user.firstname : 'Welcome'}</h3>
                        <button type="button" className="close-header" onClick={() => toggleField('menuOpen')}>
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    {!user && <div className='d-flex justify-content-around px-4 py-3'>
                        <Link className={`mobile-menu-quick-icon-container ${pathname === '/signup' ? 'active' : ''}`}
                            to="/signup" onClick={() => toggleField('menuOpen')}>
                            <div className='mobile-menu-quick-icon'>
                                <i className='far fa-handshake' />
                            </div>
                            <p>Join</p>
                        </Link>
                        <a className='mobile-menu-quick-icon-container' onClick={() => {
                            toggleField('menuOpen');
                            showLoginModalAction(true);
                        }}>
                            <div className='mobile-menu-quick-icon'>
                                <i className='fas fa-sign-in-alt' />
                            </div>
                            <p>Login</p>
                        </a>
                        <Link className={`mobile-menu-quick-icon-container ${pathname === '/faq' ? 'active' : ''}`}
                            to="/faq" onClick={() => toggleField('menuOpen')}>
                            <div className='mobile-menu-quick-icon'>
                                <i className='fas fa-question' />
                            </div>
                            <p>FAQ</p>
                        </Link>
                    </div>}
                    {user && <div className='d-flex justify-content-around px-4 py-3'>
                        <Link className={`mobile-menu-quick-icon-container ${pathname === '/bets' ? 'active' : ''}`}
                            to="/bets" onClick={() => toggleField('menuOpen')}>
                            <div className='mobile-menu-quick-icon'>
                                <i className='far fa-gamepad' />
                            </div>
                            <p>Open Bets</p>
                        </Link>
                        <Link className={`mobile-menu-quick-icon-container ${pathname === '/deposit' ? 'active' : ''}`}
                            to="/deposit" onClick={() => toggleField('menuOpen')}>
                            <div className='mobile-menu-quick-icon'>
                                <i className='fas fa-piggy-bank' />
                            </div>
                            <p>Deposit</p>
                        </Link>
                        <a className='mobile-menu-quick-icon-container' onClick={() => this.setState({ showMenu: 'account' })}>
                            <div className='mobile-menu-quick-icon'>
                                <i className='fas fa-user' />
                            </div>
                            <p>Account</p>
                        </a>
                    </div>}
                    <ul className="navbar-nav">
                        {!showMenu && <>
                            <ul className='row mx-0'>
                                <li className={`nav-item col-6 ${pathname === '/' ? 'active' : ''}`} >
                                    <Link to={{ pathname: '/' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-users" />
                                        <span><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" /></span>
                                    </Link>
                                </li>
                                <li className="nav-item col-6">
                                    <a className="nav-link next" href='#' onClick={() => this.setState({ showMenu: 'az-sports' })}>
                                        <i className="fas fa-list" />
                                        <span><FormattedMessage id="COMPONENTS.AZ.SPORTS" /></span>
                                        <i className="fas fa-chevron-right float-right" />
                                    </a>
                                </li>
                                <li className="nav-item col-6">
                                    <a className="nav-link next" href="https://tickets.payperwin.com/" target="_blank">
                                        <i className="fas fa-ticket" />
                                        <span>Event Tickets</span>
                                    </a>
                                </li>
                                <li className="nav-item col-6">
                                    <a href="https://shop.payperwin.com" className="nav-link" target="_blank">
                                        <i className="fas fa-money-check" />
                                        <span><FormattedMessage id="COMPONENTS.BUYGIFTCARD" /></span>
                                    </a>
                                </li>
                                <li className={`nav-item col-6 ${pathname === '/articles' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/articles' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-pencil" />
                                        <span><FormattedMessage id="COMPONENTS.ARTICLES" /></span>
                                    </Link>
                                </li>
                                <li className={`nav-item col-6 ${pathname === '/invite' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/invite' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-user-friends" />
                                        <span><FormattedMessage id="COMPONENTS.REFER_FRIEND" /></span>
                                    </Link>
                                </li>
                                <li className={`nav-item col-6 ${pathname === '/how-it-works' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/how-it-works' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-info" />
                                        <span><FormattedMessage id="COMPONENTS.HOW.IT.WORKS" /></span>
                                    </Link>
                                </li>
                                <li className={`nav-item col-6 ${pathname === '/faq' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/faq' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-question" />
                                        <span><FormattedMessage id="COMPONENTS.FAQ" /></span>
                                    </Link>
                                </li>
                                <li className="nav-item col-6">
                                    <Link to="/team"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-chalkboard-teacher" />
                                        <FormattedMessage id="COMPONENTS.OUR_TEAM" />
                                    </Link>
                                </li>
                                <li className="nav-item col-6">
                                    <a className="nav-link next" href='#' onClick={() => this.setState({ showMenu: 'help' })}>
                                        <i className="fa fa-question-circle" />
                                        <span><FormattedMessage id="COMPONENTS.HELP" /></span>
                                        <i className="fas fa-chevron-right float-right" />
                                    </a>
                                </li>
                                <li className={`nav-item col-6 ${pathname === '/about-us' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/about-us' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-briefcase" />
                                        <span><FormattedMessage id="COMPONENTS.ABOUTUS" /></span>
                                    </Link>
                                </li>
                                {user && <li className="nav-item col-6">
                                    <a className="nav-link" href='#' onClick={this.logout}>
                                        <i className="fas fa-sign-out-alt" />
                                        <span><FormattedMessage id="COMPONENTS.LOGOUT" /></span>
                                    </a>
                                </li>}
                            </ul>
                        </>}
                        {showMenu == 'az-sports' && <>
                            {/* <li className={`nav-item`} >
                                <a href="#" className="nav-link" onClick={() => this.setState({ showMenu: null })}>
                                    <i className="fas fa-chevron-left" />
                                    <span><FormattedMessage id="PAGES.BACK" /></span>
                                </a>
                            </li> */}
                            <ul className='row px-2'>
                                {sports.map(sport => {
                                    const { name, eventCount, shortName } = sport;
                                    if (eventCount <= 0) return null;

                                    return (
                                        <li className="nav-item col-6" key={name}>
                                            <Link
                                                to={{ pathname: name == 'Soccer' ? `/sport/${shortName}/league` : `/sport/${shortName}` }}
                                                className="nav-link menu-sports-item"
                                                onClick={() => toggleField('menuOpen')}>
                                                <img src={sportNameImage(name)} style={{ marginRight: '6px' }} />
                                                {this.getSportName(name)}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </>}
                        {showMenu == 'help' && <>
                            {/* <li className={`nav-item`} >
                                <a href="#" className="nav-link" onClick={() => this.setState({ showMenu: null })}>
                                    <i className="fas fa-chevron-left" />
                                    <span><FormattedMessage id="PAGES.BACK" /></span>
                                </a>
                            </li> */}
                            <ul>
                                <li className="nav-item">
                                    <Link to="/payment-options"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="far fa-money-bill-alt" />
                                        <FormattedMessage id="COMPONENTS.PAYMENT.OPTIONS" />
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/betting-rules"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-tasks" />
                                        <FormattedMessage id="COMPONENTS.BETTING.RULES" />
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/support"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-phone" />
                                        <FormattedMessage id="COMPONENTS.CONTACTUS" />
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/faq"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-question" />
                                        <FormattedMessage id="COMPONENTS.CASHBACK.FAQ" />
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/privacy-policy"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-book" />
                                        <FormattedMessage id="COMPONENTS.PRIVACY_POLICY" />
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/terms-and-conditions"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-journal-whills" />
                                        <FormattedMessage id="COMPONENTS.TERMS_CONDITIONS" />
                                    </Link>
                                </li>
                            </ul>
                        </>}
                        {showMenu == 'account' && <>
                            {/* <li className={`nav-item`} >
                                <a href="#" className="nav-link" onClick={() => this.setState({ showMenu: null })}>
                                    <i className="fas fa-chevron-left" />
                                    <span><FormattedMessage id="PAGES.BACK" /></span>
                                </a>
                            </li> */}
                            <ul>
                                <li className={`nav-item ${pathname === '/account' ? 'active' : ''}`}>
                                    <Link to="/account"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-info-circle i-color" />
                                        <FormattedMessage id="COMPONENTS.SIDEBAR.MYACCOUNT" />
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/bets' ? 'active' : ''}`}>
                                    <Link to="/bets"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-gamepad" />
                                        <FormattedMessage id="COMPONENTS.SIDEBAR.OPENBETS" />
                                    </Link>
                                </li>
                                <li className={`nav-item col-6 ${pathname === '/history' ? 'active' : ''}`}>
                                    <Link to={{ pathname: '/history' }}
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-history" />
                                        <span><FormattedMessage id="COMPONENTS.SIDEBAR.BETTING_HISTORY" /></span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/preferences' ? 'active' : ''}`}>
                                    <Link to="/preferences"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-asterisk" />
                                        <FormattedMessage id="COMPONENTS.PREFERENCES" />
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/deposit' ? 'active' : ''}`}>
                                    <Link to="/deposit"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-money-check" />
                                        <FormattedMessage id="COMPONENTS.SIDEBAR.DEPOSIT" />
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/withdraw' ? 'active' : ''}`}>
                                    <Link to="/withdraw"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-money-check-alt" />
                                        <FormattedMessage id="COMPONENTS.SIDEBAR.WITHDRAW" />
                                    </Link>
                                </li>
                                <li className={`nav-item ${pathname === '/loyalty' ? 'active' : ''}`}>
                                    <Link to="/loyalty"
                                        className="nav-link"
                                        onClick={() => toggleField('menuOpen')}>
                                        <i className="fas fa-money-bill" />
                                        <FormattedMessage id="COMPONENTS.SIDEBAR.LOYALTY" />
                                    </Link>
                                </li>
                            </ul>
                        </>}
                        <li className="nav-item">
                            <ul>
                                <li onClick={() => setLanguage('en')} className="language-li-menu border-0 px-1 cursor-pointer">
                                    <img src="/images/flag/ca.png" className="language-flag-menu" />
                                </li>
                                <li onClick={() => setLanguage('es')} className="language-li-menu border-0 px-1 cursor-pointer">
                                    <img src="/images/flag/co.png" className="language-flag-menu" />
                                </li>
                                <li onClick={() => setLanguage('ko')} className="language-li-menu border-0 px-1 cursor-pointer">
                                    <img src="/images/flag/ko.png" className="language-flag-menu" />
                                </li>
                                <li onClick={() => setLanguage('vi')} className="language-li-menu border-0 px-1 cursor-pointer">
                                    <img src="/images/flag/vi.png" className="language-flag-menu" />
                                </li>
                                <li className="social-li-menu cursor-pointer">
                                    <a href="https://www.instagram.com/payperwin/?hl=en"><i className="fab fa-instagram" /></a>
                                    <a href="https://twitter.com/payperwin"><i className="fab fa-twitter" /></a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul className="list-fab">
                        <li>
                            <Switch />
                            <select value={oddsFormat} onChange={(evt) => setOddsFormat(evt.target.value)}>
                                <option value="american">{intl.formatMessage({ id: "COMPONENTS.MENU.ODDS.AMERICAN" })}</option>
                                <option value="decimal">{intl.formatMessage({ id: "COMPONENTS.MENU.ODDS.DECIMAL" })}</option>
                            </select>
                        </li>
                    </ul>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    oddsFormat: state.frontend.oddsFormat,
    lang: state.frontend.lang,
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(Menu))