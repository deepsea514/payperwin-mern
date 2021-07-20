import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SidebarAccount extends Component {
    render() {
        const { toggleField, accountMenuMobileOpen, sidebarShowAccountLinks, user } = this.props;
        return (
            <div className={`col-sm-2 responsive-v ${sidebarShowAccountLinks ? '' : 'hide'}`}
                style={accountMenuMobileOpen ? { display: 'block' } : null} onClick={() =>
                    toggleField('accountMenuMobileOpen', false)}>

                <h3 className="cat-heading">MESSAGE CENTER</h3>
                <ul className="left-cat top-cls-sport">
                    <li>
                        <Link to={{ pathname: '/inbox' }}><i className="fas fa-envelope"></i>Inbox</Link>
                    </li>
                    {/* <li>
                        <Link to={{ pathname: '/announcements' }}><i className="fas fa-bell"></i>Announcements </Link>
                    </li> */}
                </ul>

                <h3 className="cat-heading">MY BETS</h3>
                <ul className="left-cat top-cls-sport">
                    <li>
                        <Link to={{ pathname: '/bets' }}><i className="fas fa-hockey-puck"></i>Open bets</Link>
                    </li>
                    <li>
                        <Link to={{ pathname: '/history' }}><i className="fas fa-history"></i>Betting History</Link>
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
                    {user && !user.roles.verified && <li>
                        <Link to={{ pathname: '/verification' }}><i className="far fa-check-double"></i>Verification</Link>
                    </li>}
                </ul>

                <h3 className="cat-heading">RESPONSIBLE GAMING</h3>
                <ul className="left-cat top-cls-sport">
                    <li>
                        <Link to={{ pathname: '/self-exclusion' }}><i className="fas fa-user-times"></i>Self exclusion</Link>
                    </li>
                    {/* <li>
                        <Link to={{ pathname: '/deactivation' }}><i className="far fa-user-circle"></i>Account deactivation</Link>
                    </li> */}
                </ul>
            </div>
        );
    }
}

export default SidebarAccount;