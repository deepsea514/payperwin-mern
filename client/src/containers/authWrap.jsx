import React, { Component } from 'react';
import App from '../containers/app';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import _env from '../env.json';

class AuthWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <App />
        );
    }
}

export default connect(null, frontend.actions)(AuthWrap)
