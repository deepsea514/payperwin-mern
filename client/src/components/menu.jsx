import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";

class Menu extends Component {
    render() {
        const { location, toggleField, oddsFormat, setOddsFormat } = this.props;
        const { pathname } = location;

        return (
            <>
                <div className="background-closer" onClick={() => toggleField('menuOpen')} />
                <div className="mobile-menu modal-content">
                    <button type="button" className="close-header" onClick={() => toggleField('menuOpen')}>
                        <i className="fal fa-times" />
                    </button>
                    <Link to={{ pathname: '/' }} className="logo">
                        <img src="/images/logo200.png" />
                    </Link>
                    <ul className="navbar-nav">
                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/' }} className="nav-link">
                                <i className="fas fa-users"></i>PEER&nbsp;TO&nbsp;PEER&nbsp;BETTING
                            </Link>
                        </li>
                        {/* <li className={`nav-item ${pathname === '/sportsbook' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/sportsbook' }} className="nav-link">
                                <i className="fas fa-futbol"></i>LIVE&nbsp;CENTER
                            </Link>
                        </li> */}
                        <li className={`nav-item ${pathname === '/how-it-works' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/how-it-works' }} className="nav-link" onClick={() =>
                                toggleField('menuOpen')}>
                                <i className="fas fa-info"></i>HOW IT WORKS
                            </Link>
                        </li>
                        <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/faq' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                <i className="fas fa-question"></i>FAQ
                            </Link>
                        </li>
                        <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                            <Link to={{ pathname: '/faq' }} className="nav-link" onClick={() => toggleField('menuOpen')}>
                                <i className="fa fa-question-circle" aria-hidden="true"></i>Help
                            </Link>
                        </li>
                    </ul>
                    <ul className="list-fab">
                        <li>
                            Language
                            <select>
                                <option>English (EN)</option>
                                <option>Chinese (CH)</option>
                                <option>Korean (KR)</option>
                            </select>
                        </li>
                        <li>
                            Odds Format
                            <select value={oddsFormat} onChange={(evt) => setOddsFormat(evt.target.value)}>
                                <option value="american">American Odds</option>
                                <option value="decimal">Decimal Odds</option>
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
});

export default connect(mapStateToProps, frontend.actions)(Menu)