import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import update from 'immutability-helper';
// import Favicon from 'react-favicon';
import App from '../containers/app';
import UserContext from '../contexts/userContext';
import axios from 'axios';
import socket from "../helpers/socket";
const config = require('../../../config.json');
const serverUrl = config.appUrl;

window.recaptchaSiteKey = config.recaptchaSiteKey;

export default class AuthWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            getUser: this.getUser.bind(this),
        };
        this.getUser = this.getUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
        this.getUser();
        socket.on("sportsbook-accepted", (id) => {
            const { user } = this.state;
            console.log(user.userId, id);
            if (user && user.userId == id) {
                window.location = '/bets-sportsbook';
            }
        });
    }

    getUser(callback) {
        const url = `${serverUrl}/user?compress=false`;
        axios.get(url, {
            withCredentials: true,
            cache: {
                exclude: {
                    filter: () => true,
                },
            },
        }).then(({ data: user }) => {
            this.setState({ user }, () => {
                if (callback) {
                    callback();
                }
            });
        });
    }

    updateUser(field, value) {
        const { user } = this.state;
        this.setState({
            user: update(user, {
                [field]: {
                    $set: value,
                }
            }),
        });
    }

    render() {
        const { user, getUser } = this.state;
        return (
            <UserContext.Provider value={{ user, getUser }}>
                <BrowserRouter basename="">
                    <Switch>
                        <Route path="/someroute" render={() => (
                            <div style={{ height: '100%' }}>
                                Some content
                            </div>
                        )} />
                        <Route path="/" render={() => (
                            <App
                                user={user}
                                getUser={getUser}
                                updateUser={this.updateUser}
                            />
                        )} />
                    </Switch>
                </BrowserRouter>
            </UserContext.Provider>
        );
    }
}