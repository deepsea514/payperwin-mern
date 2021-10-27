import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class SidebarAccount extends Component {
    render() {
        const { toggleField, accountMenuMobileOpen, sidebarShowAccountLinks, user } = this.props;
        return (
            <div className={`col-sm-2 responsive-v ${sidebarShowAccountLinks ? '' : 'hide'}`}
                style={accountMenuMobileOpen ? { display: 'block' } : null} onClick={() =>
                    toggleField('accountMenuMobileOpen', false)}>
                {(!user || !user.autobet) && <>
                    <h3 className="cat-heading"><FormattedMessage id="COMPONENTS.SIDEBAR.MESSAGECENTER" /></h3>
                    <ul className="left-cat top-cls-sport">
                        <li>
                            <Link to={{ pathname: '/inbox' }}><i className="fas fa-envelope"></i><FormattedMessage id="COMPONENTS.SIDEBAR.INBOX" /></Link>
                        </li>
                    </ul>
                </>}

                <h3 className="cat-heading"><FormattedMessage id="COMPONENTS.SIDEBAR.MYBETS" /></h3>
                <ul className="left-cat top-cls-sport">
                    <li>
                        <Link to={{ pathname: '/bets' }}><i className="fas fa-gamepad"></i><FormattedMessage id="COMPONENTS.SIDEBAR.OPENBETS" /></Link>
                    </li>
                    <li>
                        <Link to={{ pathname: '/history' }}><i className="fas fa-history"></i><FormattedMessage id="COMPONENTS.SIDEBAR.BETTING_HISTORY" /></Link>
                    </li>
                    {/* <li>
                        <Link to={{ pathname: '/custom-bets' }}><i className="fas fa-user-clock"></i>Custom Bets</Link>
                    </li> */}
                </ul>

                {(!user || !user.autobet) && <>
                    <h3 className="cat-heading"><FormattedMessage id="COMPONENTS.SIDEBAR.CASHIER" /></h3>
                    <ul className="left-cat top-cls-sport">
                        <li>
                            <Link to={{ pathname: '/deposit' }}><i className="fas fa-money-check"></i><FormattedMessage id="COMPONENTS.SIDEBAR.DEPOSIT" /> </Link>
                        </li>
                        <li>
                            <Link to={{ pathname: '/withdraw' }}><i className="fas fa-money-check-alt"></i><FormattedMessage id="COMPONENTS.SIDEBAR.WITHDRAW" /> </Link>
                        </li>
                        <li>
                            <Link to={{ pathname: '/transaction-history' }}><i className="fas fa-list"></i><FormattedMessage id="COMPONENTS.SIDEBAR.TRANSACTION_HISTORY" /> </Link>
                        </li>
                        <li>
                            <Link to={{ pathname: '/payment-options' }}><i className="far fa-money-bill-alt"></i><FormattedMessage id="COMPONENTS.SIDEBAR.PAYMENT_METHODS" /> </Link>
                        </li>
                        <li>
                            <Link to={{ pathname: '/cashback' }}><i className="fas fa-comment-dollar"></i> <FormattedMessage id="COMPONENTS.SIDEBAR.CASHBACK" /> </Link>
                        </li>
                        <li>
                            <Link to={{ pathname: '/loyalty' }}><i className="fas fa-file-invoice-dollar"></i> <FormattedMessage id="COMPONENTS.SIDEBAR.LOYALTY" /> </Link>
                        </li>
                    </ul>
                </>}

                {user && user.autobet && <>
                    <h3 className="cat-heading">AUTOBET</h3>
                    <ul className="left-cat top-cls-sport">
                        <li>
                            <Link to={{ pathname: '/autobet-dashboard' }}><i className="fas fa-chart-bar"></i>Dashboard </Link>
                        </li>
                        <li>
                            <Link to={{ pathname: '/autobet-settings' }}><i className="fas fa-tools"></i>Settings </Link>
                        </li>
                    </ul>
                </>}

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
                    {user && !user.roles.verified && !user.autobet && <li>
                        <Link to={{ pathname: '/verification' }}><i className="far fa-check-double"></i>Verification</Link>
                    </li>}
                    {user && !user.roles.phone_verified && !user.autobet && <li>
                        <Link to={{ pathname: '/phone-verification' }}><i className="fas fa-sms"></i>Phone Verification</Link>
                    </li>}
                </ul>

                {(!user || !user.autobet) && <>
                    <h3 className="cat-heading">RESPONSIBLE GAMING</h3>
                    <ul className="left-cat top-cls-sport">
                        <li>
                            <Link to={{ pathname: '/self-exclusion' }}><i className="fas fa-user-times"></i>Self exclusion</Link>
                        </li>
                    </ul>
                </>}
            </div>
        );
    }
}

export default SidebarAccount;