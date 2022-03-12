import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import SimpleLogin from './simpleLogin';
import numberFormat from '../../helpers/numberFormat';

class Header extends Component {
    render() {
        const { showLoginModalAction, user, toggleField } = this.props;
        return (
            <header className="header">
                <div className="header-top">
                    <div className="container">
                        <div className="d-flex justify-content-between">
                            <div className="">
                                <Link to={{ pathname: '/' }} className="logo">
                                    <img src="/images/logo-white.png" />
                                </Link>
                            </div>
                            <div className="d-flex justify-content-end align-items-center">
                                {!user && <SimpleLogin showLoginModalAction={showLoginModalAction} />}
                                {user && <ul className="login-nav d-flex">
                                    <li>
                                        <span className="blue-icon">
                                            CAD ${user.balance ? numberFormat(Number(user.balance).toFixed(2)) : 0}
                                            &nbsp;<i className="fa fa-refresh cursor-pointer not-mobile" onClick={() => getUser()} />
                                        </span>
                                    </li>
                                </ul>}
                                {user && <button className="navbar-toggler responsive-menu"
                                    onClick={() => toggleField('menuOpen')}>
                                    <span className="navbar-toggler-icon"></span>
                                    <span className="navbar-toggler-icon"></span>
                                    <span className="navbar-toggler-icon"></span>
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(Header)