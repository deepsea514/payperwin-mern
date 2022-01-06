import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { FormattedMessage, injectIntl } from 'react-intl';
import logout from '../libs/logout';
import sportNameImage from '../helpers/sportNameImage';
import { getSportsDir } from '../redux/services';


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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    logout = () => {
        const { getUser, history, toggleField } = this.props;
        logout(getUser, history);
        toggleField('menuOpen');
    }

    render() {
        const {
            location, toggleField, oddsFormat, display_mode, lang,
            setOddsFormat, setDisplayMode, setLanguage, user,
            intl, showLoginModalAction
        } = this.props;
        const { pathname } = location;
        const { showMenu, sports } = this.state;
        return (
            <>
                <div className="background-closer bg-modal" onClick={() => toggleField('menuOpen')} />
                <div className="mobile-menu modal-content">
                    <div className='d-flex justify-content-between p-4' style={{ alignItems: 'center' }}>
                        <h3 className='menu-title' style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user ? 'Hi, ' + user.firstname : 'Welcome'}</h3>
                        <button type="button" className="close-header" onClick={() => toggleField('menuOpen')}>
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    {!user && <div className='d-flex justify-content-around px-4'>
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
                    {user && <div className='d-flex justify-content-around px-4'>
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
                        <a className='mobile-menu-quick-icon-container' onClick={() => {
                            toggleField('accountMenuMobileOpen');
                            toggleField('menuOpen');
                        }}>
                            <div className='mobile-menu-quick-icon'>
                                <i className='fas fa-user' />
                            </div>
                            <p>Account</p>
                        </a>
                    </div>}
                    <ul className="navbar-nav">
                        {!showMenu && <>
                            <li className={`nav-item ${pathname === '/' ? 'active' : ''}`} >
                                <Link to={{ pathname: '/' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                    <i className="fas fa-users"></i><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => this.setState({ showMenu: 'az-sports' })}>
                                    <i className="fas fa-list" /><FormattedMessage id="COMPONENTS.AZ.SPORTS" /><i className="fas fa-chevron-right float-right" />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="https://shop.payperwin.com" className="nav-link" target="_blank">
                                    <i className="fas fa-money-check"></i><FormattedMessage id="COMPONENTS.BUYGIFTCARD" />
                                </a>
                            </li>
                            <li className={`nav-item ${pathname === '/articles' ? 'active' : ''}`}>
                                <Link to={{ pathname: '/articles' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                    <i className="fas fa-pencil"></i><FormattedMessage id="COMPONENTS.ARTICLES" />
                                </Link>
                            </li>
                            <li className={`nav-item ${pathname === '/how-it-works' ? 'active' : ''}`}>
                                <Link to={{ pathname: '/how-it-works' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                    <i className="fas fa-info"></i><FormattedMessage id="COMPONENTS.HOW.IT.WORKS" />
                                </Link>
                            </li>
                            <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                                <Link to={{ pathname: '/faq' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                    <i className="fas fa-question"></i><FormattedMessage id="COMPONENTS.FAQ" />
                                </Link>
                            </li>
                            <li className={`nav-item`}>
                                <a className="nav-link" onClick={() => this.setState({ showMenu: 'help' })}>
                                    <i className="fa fa-question-circle" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.HELP" /><i className="fas fa-chevron-right float-right" />
                                </a>
                            </li>
                            <li className={`nav-item ${pathname === '/about-us' ? 'active' : ''}`}>
                                <Link to={{ pathname: '/' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                    <i className="fas fa-briefcase"></i>About Us
                                </Link>
                            </li>
                            {user && <li className="nav-item">
                                <a className="nav-link" onClick={this.logout}>
                                    <i className="fas fa-sign-out-alt" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.LOGOUT" />
                                </a>
                            </li>}
                        </>}
                        {showMenu == 'az-sports' && <ul style={{
                            // maxHeight: '300px',
                            // overflowX: 'hidden',
                            // overflowY: 'scroll'
                        }}>
                            {sports.map(sport => {
                                const { name, eventCount } = sport;
                                if (eventCount <= 0) return null;

                                return (
                                    <li className="nav-item" key={name}>
                                        <Link
                                            to={{ pathname: name == 'Soccer' ? `/sport/${name}/league` : `/sport/${name.replace(" ", "_")}` }}
                                            className="nav-link menu-sports-item"
                                            onClick={() => toggleField('menuOpen')}>
                                            <img src={sportNameImage(name)} style={{ marginRight: '6px' }} />
                                            {name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>}
                        {showMenu == 'help' && <ul style={{ maxHeight: '300px' }}>
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
                        </ul>}
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
                            <FormattedMessage id="COMPONENTS.MENU.ODDS" />
                            <select value={oddsFormat} onChange={(evt) => setOddsFormat(evt.target.value)}>
                                <option value="american">{intl.formatMessage({ id: "COMPONENTS.MENU.ODDS.AMERICAN" })}</option>
                                <option value="decimal">{intl.formatMessage({ id: "COMPONENTS.MENU.ODDS.DECIMAL" })}</option>
                            </select>
                        </li>
                        <li>
                            <FormattedMessage id="COMPONENTS.DISPLAY" />
                            <select value={display_mode} onChange={(evt) => setDisplayMode(evt.target.value)}>
                                <option value="light">{intl.formatMessage({ id: "COMPONENTS.DISPLAY.LIGHT" })}</option>
                                <option value="dark">{intl.formatMessage({ id: "COMPONENTS.DISPLAY.DARK" })}</option>
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
    display_mode: state.frontend.display_mode,
    lang: state.frontend.lang,
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(Menu))