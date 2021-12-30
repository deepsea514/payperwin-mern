import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { FormattedMessage, injectIntl } from 'react-intl';
import { logout } from '../libs/logout';

class Menu extends Component {
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
                    {!user && <div className='d-flex justify-content-around p-4'>
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
                    {user && <div className='d-flex justify-content-around p-4'>
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
                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`} >
                            <Link to={{ pathname: '/' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                <i className="fas fa-users"></i><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="https://shop.payperwin.com" className="nav-link" target="_blank">
                                <i className="fas fa-money-check"></i><FormattedMessage id="COMPONENTS.BUYGIFTCARD" />
                            </a>
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
                        <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/faq' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                <i className="fa fa-question-circle" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.HELP" />
                            </Link>
                        </li>
                        {user && <li className="nav-item">
                            <a className="nav-link" onClick={this.logout}>
                                <i className="fas fa-sign-out-alt" aria-hidden="true"></i><FormattedMessage id="COMPONENTS.LOGOUT" />
                            </a>
                        </li>}
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