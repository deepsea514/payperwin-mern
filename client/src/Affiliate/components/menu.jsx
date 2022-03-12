import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

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
        const { toggleField, user } = this.props;
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
                            <li className="nav-item col-12">
                                <a className="nav-link" onClick={null}>
                                    <i className="fas fa-key" />
                                    <span>Change Password</span>
                                </a>
                            </li>
                            <li className="nav-item col-12">
                                <a className="nav-link" onClick={this.logout}>
                                    <i className="fas fa-sign-out-alt" />
                                    <span>Logout</span>
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