import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class Menu extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        document.body.classList.add('noscroll');
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.body.classList.remove('noscroll');
    }

    logout = () => {
        const { getUser, history, toggleField } = this.props;
        localStorage.removeItem("affiliate-token");
        getUser();
        history.replace({ pathname: '/' });
        toggleField('menuOpen');
    }

    render() {
        const { location, toggleField, user, showLoginModalAction } = this.props;
        // const { pathname } = location;
        console.log(this.props)
        const pathname = '/affi';
        return (
            <>
                <div className="background-closer bg-modal" onClick={() => toggleField('menuOpen')} />
                <div className="mobile-menu">
                    <div className='d-flex justify-content-between p-4' style={{ alignItems: 'center' }}>
                        <h3 className='menu-title-affiliate' style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user ? 'Hi, ' + user.email : 'Welcome'}</h3>
                        <button type="button" className="close-header" onClick={() => toggleField('menuOpen')}>
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <ul className="navbar-nav">
                        <ul className='row mx-0'>
                            <li className="nav-item col-6">
                                <a className="nav-link" onClick={this.logout}>
                                    <i className="fas fa-sign-out-alt" />
                                    <span><FormattedMessage id="COMPONENTS.LOGOUT" /></span>
                                </a>
                            </li>
                        </ul>
                    </ul>
                </div>
            </>
        );
    }
}

export default withRouter(Menu)