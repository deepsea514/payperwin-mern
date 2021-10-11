import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import update from 'immutability-helper';
// import Favicon from 'react-favicon';
import App from '../containers/app';
import UserContext from '../contexts/userContext';
import axios from 'axios';
import socket from "../helpers/socket";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import _env from '../env.json';
const serverUrl = _env.appUrl;

class AuthWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        // this.getUser();
        // setInterval(this.getUser.bind(this), 10 * 60 * 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getUser = (callback) => {
        const { setPreference } = this.props;
        const url = `${serverUrl}/user?compress=false`;
        axios.get(url, {
            withCredentials: true,
            cache: {
                exclude: {
                    filter: () => true,
                },
            },
        }).then(({ data: user }) => {
            setPreference(user.preference);
            this._isMounted && this.setState({ user }, () => {
                if (callback) {
                    callback(true);
                }
            });
        }).catch(() => {
            this._isMounted && this.setState({ user: false }, () => {
                if (callback) {
                    callback(false);
                }
            });
        });
    }

    updateUser = (field, value) => {
        const { user } = this.state;
        this._isMounted && this.setState({
            user: update(user, {
                [field]: {
                    $set: value,
                }
            }),
        });
    }

    render() {
        const { user } = this.state;
        return (
            <UserContext.Provider value={{ user, getUser: this.getUser.bind(this) }}>
                <App
                    user={user}
                    getUser={this.getUser}
                    updateUser={this.updateUser}
                />
            </UserContext.Provider >
        );
    }
}

export default connect(null, frontend.actions)(AuthWrap)
