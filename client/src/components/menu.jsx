import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { FormattedMessage, injectIntl } from 'react-intl';

class Menu extends Component {
    render() {
        const {
            location, toggleField, oddsFormat, display_mode, lang,
            setOddsFormat, setDisplayMode, setLanguage,
            intl
        } = this.props;
        const { pathname } = location;

        return (
            <>
                <div className="background-closer" onClick={() => toggleField('menuOpen')} />
                <div className="mobile-menu modal-content">
                    <button type="button" className="close-header" onClick={() => toggleField('menuOpen')}>
                        <i className="fal fa-times" />
                    </button>
                    <Link to={{ pathname: '/' }} className="logo">
                        <img src="/images/ppw-white-xmas.png" />
                    </Link>
                    <ul className="navbar-nav">
                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/' }} className="nav-link">
                                <i className="fas fa-users"></i><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" />
                            </Link>
                        </li>
                        <li className={`nav-item ${pathname === '/how-it-works' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/how-it-works' }} className="nav-link" onClick={() =>
                                toggleField('menuOpen')}>
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
                    </ul>
                    <ul className="list-fab">
                        <li>
                            <FormattedMessage id="COMPONENTS.LANGUAGE" />
                            <select value={lang} onChange={(evt) => setLanguage(evt.target.value)}>
                                <option value="en">{intl.formatMessage({ id: "COMPONENTS.LANGUAGE.ENGLISH" })} (EN)</option>
                                <option value="es">{intl.formatMessage({ id: "COMPONENTS.LANGUAGE.SPANISH" })} (ES)</option>
                                <option value="ko">{intl.formatMessage({ id: "COMPONENTS.LANGUAGE.KOREAN" })} (KO)</option>
                            </select>
                        </li>
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