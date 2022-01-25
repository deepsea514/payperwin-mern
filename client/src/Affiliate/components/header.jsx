import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import SimpleLogin from './simpleLogin';

class Header extends Component {
    render() {
        const { showLoginModalAction } = this.props;
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
                                <SimpleLogin showLoginModalAction={showLoginModalAction} />
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