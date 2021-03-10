import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import SimpleLogin from './simpleLogin';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

function logout(getUser, history) {
    const url = `${serverUrl}/logout`;
    axios(
        {
            method: 'get',
            url,
            withCredentials: true,
        },
    ).then((/* d */) => {
        getUser();
        history.replace({ pathname: '/' });
    });
}
export default class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userDropDownOpen: false,
        };
        this.toggleField = this.toggleField.bind(this);
        this.logout = this.logout.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }


    toggleField(fieldName, forceState) {
        if (typeof this.state[fieldName] !== 'undefined') {
            this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }

    logout() {
        const { getUser, history } = this.props;
        logout(getUser, history);
        this.setState({ userDropDownOpen: false });
    }

    render() {
        const { userDropDownOpen } = this.state;
        const { toggleField, user, location } = this.props;
        const { pathname } = location;
        return (
            <header className="header">
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
                                    <img src="/images/payperwin-web.png" style={{ height: 40 }} />
                                </Link>
                            </div>
                            <div className="col-7 col-sm-6 text-right">
                                {user
                                    ? (
                                        <div className="login-nav-contain">
                                            <ul className="login-nav">
                                                <li><Link to={{ pathname: '/inbox' }} className="blue-icon"><i className="fas fa-envelope" /></Link></li>
                                                <li>
                                                    <Link to={{ pathname: '/deposit' }}>
                                                        <span className="blue-icon">USD {user.balance ? user.balance.toFixed(2) : 0}</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={{ pathname: '/deposit' }} className="deposit">
                                                        <i className="fas fa-piggy-bank" /><span className="not-mobile">Deposit</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <div href="#" className="username blue-icon" onClick={() => this.toggleField('userDropDownOpen')}>
                                                        <i className="fas fa-user" /><span className="not-mobile">{user.username}</span>
                                                        <i className="fa fa-caret-down not-mobile" />
                                                    </div>
                                                </li>
                                            </ul>
                                            {userDropDownOpen ? (
                                                <React.Fragment>
                                                    <div className="background-closer" onClick={() => this.toggleField('userDropDownOpen')} />
                                                    <div className="login-dropdown">
                                                        <ul>
                                                            <li className="mobile username">
                                                                {user.username}
                                                            </li>
                                                            <li className="mobile" onClick={() => toggleField('accountMenuMobileOpen')}>
                                                                My Account
                                                            </li>
                                                            <li>
                                                                <Link to={{ pathname: '/preferences' }}>Preferences</Link>
                                                            </li>
                                                            <li>
                                                                <Link to={{ pathname: '/deposit' }}>Deposit</Link>
                                                            </li>
                                                            <li>
                                                                <Link to={{ pathname: '/withdraw' }}>Withdraw</Link>
                                                            </li>
                                                            <li>
                                                                <Link to={{ pathname: '/bets' }}>Open bets</Link>
                                                            </li>
                                                            <li>
                                                                <button onClick={this.logout}>Logout<i className="fap fa-sign-out" /></button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </React.Fragment>
                                            ) : null}
                                        </div>
                                    )
                                    : <SimpleLogin />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="navbar-mobile">
                                    <button className="navbar-toggler responsive-cat" onClick={() => toggleField('sportsMenuMobileOpen')}>
                                        <span className="navbar-toggler-icon"></span>
                                        <span className="navbar-toggler-icon"></span>
                                        <span className="navbar-toggler-icon"></span>
                                        A-Z Sports
                                    </button>
                                    <ul className="navbar-nav-mobile navbar-nav">
                                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/' }} className="nav-link">
                                                <i className="fas fa-users"></i>PEER&nbsp;TO&nbsp;PEER&nbsp;BETTING
                                            </Link>
                                        </li>
                                        {user && <li className={`nav-item ${pathname === '/sportsbook' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/sportsbook' }} className="nav-link">
                                                <i className="fas fa-futbol"></i>SPORTSBOOK
                                            </Link>
                                        </li>}
                                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/how-it-works' }} className="nav-link">
                                                <i className="fas fa-info"></i>How&nbsp;It&nbsp;Works
                                            </Link>
                                        </li>
                                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/faq' }} className="nav-link">
                                                <i className="fas fa-question"></i>FAQ
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav">
                                        <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/' }} className="nav-link">
                                                <i className="fas fa-users"></i>PEER&nbsp;TO&nbsp;PEER&nbsp;BETTING
                                            </Link>
                                        </li>
                                        {user && <li className={`nav-item ${pathname === '/sportsbook' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/sportsbook' }} className="nav-link">
                                                <i className="fas fa-futbol"></i>SPORTSBOOK
                                            </Link>
                                        </li>}
                                        <li className={`nav-item ${pathname === '/how-it-works' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/how-it-works' }} className="nav-link">
                                                <i className="fas fa-info"></i>HOW IT WORKS
                                            </Link>
                                        </li>
                                        <li className={`nav-item ${pathname === '/faq' ? 'active' : ''}`}>
                                            <Link to={{ pathname: '/faq' }} className="nav-link">
                                                <i className="fas fa-question"></i>FAQ
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-search">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="search-box">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                    <input className="searh-f" type="search" placeholder="Search" />
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <ul className="list-s">
                                    {/* <li><a href="#"><span className="moon"></span><i className="fas fa-moon"></i></a></li> */}
                                    {/* <li><a href="#"><i className="fa fa-info-circle" aria-hidden="true"></i></a><a href="#">Single Odds</a> <a href="#">Multiple Odds</a></li> */}
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-info-circle" aria-hidden="true"></i>Decimal Odds<i className="fa fa-caret-down" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <a href="#">
                                    </a>
                                    <li><a href="#"></a><a href="#">En <i className="fa fa-caret-down" aria-hidden="true"></i></a></li>
                                    <li>17:38:43 (GMT +05:30)</li>
                                    <li><a href="#"><i className="fa fa-question-circle" aria-hidden="true"></i> Help </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="myModal" role="dialog" style={{ display: 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">×</button>
                            </div>
                            <div className="modal-body">
                                <h2>Log in</h2>
                                <form>
                                    <div className="form-group">
                                        <input type="text" name="user" className="form-control" placeholder="Username" />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" name="pass" placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" name="login" className="login loginmodal-submit" value="Login" />
                                    </div>
                                </form>
                                <div className="login-help">
                                    <a href="#">Register</a> - <a href="#">Forgot Password</a>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">×</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
