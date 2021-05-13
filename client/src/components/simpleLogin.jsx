import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import UserContext from '../contexts/userContext';
import { setTitle } from '../libs/documentTitleBuilder';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
const config = require('../../../config.json');
const serverUrl = config.appUrl;

const Form = ({
    email, // eslint-disable-line react/prop-types
    password, // eslint-disable-line react/prop-types
    errors, // eslint-disable-line react/prop-types
    handleChange, // eslint-disable-line react/prop-types
    handleSubmit, // eslint-disable-line react/prop-types
    handleDirty, // eslint-disable-line react/prop-types
    pathNameLoginOrChat,
}) => (
    <React.Fragment>
        <div className="form-group email-d">
            <input
                label="Email"
                name="email"
                type="email"
                value={email}
                className="form-control form-control-sm"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleDirty}
            />
        </div>
        <div className="form-group pswd-d">
            <input
                label="Password"
                name="password"
                value={password}
                className="form-control form-control-sm"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleDirty}
                type="password"
            />
        </div>
        <div className="form-group">
            <Link to={{ pathname: '/login' }} className="log-in-btn mobile">Log&nbsp;In</Link>
            <button
                className="log-in-btn not-mobile"
                onClick={handleSubmit}
            >
                Log&nbsp;in
            </button>
        </div>
        <div className="form-group">
            <Link to={{ pathname: '/signup' }} className="join">Join</Link>
        </div>
    </React.Fragment>
);

const initState = {
    email: '',
    password: '',
    errors: {},
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initState };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDirty = this.handleDirty.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(userContextValue) {
        const { history, location: { pathname }, require2FAAction } = this.props;
        const { getUser } = userContextValue;
        const { errors } = this.state;

        registrationValidation.validateFields(this.state)
            .then((result) => {
                if (result === true) {
                    const { email, password } = this.state;
                    const url = `${serverUrl}/login`;
                    axios({
                        method: 'post',
                        url,
                        data: {
                            email,
                            password,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }).then(({ data }) => {
                        if (data._2fa_required == false) {
                            getUser();
                            if (pathname === '/login') {
                                history.replace({ pathname: '/' });
                            }
                        } else {
                            require2FAAction();
                        }
                    }).catch((err) => {
                        if (err.response) {
                            const { data } = err.response;
                            if (data.error) {
                                this.setState({ errors: { ...errors, server: data.error } });
                            }
                        }
                    });
                } else {
                    this.setState({
                        errors: result,
                    });
                }
            })
            .catch((err) => {
                this.setState({ errors: err });
            });
    }

    handleDirty(e) {
        const { errors } = this.state;
        const { name } = e.target;
        registrationValidation.validateField(name, this.state).then((result) => {
            const errorsStateChange = { ...errors, server: undefined };
            if (result === true) {
                errorsStateChange[name] = undefined;
            } else {
                errorsStateChange[name] = result;
            }
            this.setState({ errors: errorsStateChange });
        });
    }

    render() {
        const { location: { pathname } } = this.props;
        const { errors } = this.state;
        return (
            <UserContext.Consumer>
                {
                    userContextValue => (
                        <div className="form">
                            <div className="form-join">
                                <Form
                                    {...this.state}
                                    handleChange={this.handleChange}
                                    handleSubmit={() => this.handleSubmit(userContextValue)}
                                    handleDirty={this.handleDirty}
                                    pathNameLoginOrChat={pathname === '/login' || pathname === '/chat/'}
                                />
                            </div>
                            <div>
                                {
                                    errors.server ? <div className="form-error">{errors.server}</div>
                                        : errors.email ? <div className="form-error">{errors.email}</div>
                                            : errors.password ? <div className="form-error">{errors.password}</div> : null
                                }
                            </div>
                            <div className="frgt-pswrd"> Forgot <Link to="/passwordRecovery">password?</Link></div>
                        </div>
                    )
                }
            </UserContext.Consumer>
        );
    }
}

export default connect(null, frontend.actions)(withRouter(Login));
