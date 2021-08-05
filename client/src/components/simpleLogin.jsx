import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import UserContext from '../contexts/userContext';
import { setTitle } from '../libs/documentTitleBuilder';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class SimpleLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        const { location: { pathname }, showLoginModal } = this.props;

        return (
            <>
                <div className="form">
                    <div className="form-join">
                        <div className="form-group">
                            <button className="log-in-btn" onClick={showLoginModal}>Log&nbsp;in</button>
                        </div>
                        <div className="form-group">
                            <Link to={{ pathname: '/signup' }} className="join">Join</Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(null, frontend.actions)(withRouter(SimpleLogin));
