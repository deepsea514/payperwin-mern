import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

class Header extends Component {
    render() {
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
                                <h1>a</h1>
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