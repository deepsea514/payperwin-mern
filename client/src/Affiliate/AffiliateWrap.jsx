import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Favicon from 'react-favicon';
import AffiliateAPI from './redux/affiliateAPI';
import * as _redux from "../PPWAdmin/redux";
import * as affiliate from './redux/reducers';
import { connect } from 'react-redux';
import App from './App';
import { getUser } from './redux/services';

_redux.setupAxios(AffiliateAPI, "affiliate-token");

class AffiliateWrap extends Component {
    componentDidMount() {
        this.getUser();
    }

    getUser = () => {
        const { setAffiliateUserAction } = this.props;
        getUser()
            .then(({ data }) => {
                setAffiliateUserAction(data);
            }).catch(() => {
                setAffiliateUserAction(null);
            })
    }

    render() {
        return (
            <>
                <Favicon url={'/images/favicon.png'} />
                <BrowserRouter basename={"affiliate"}>
                    <App getUser={this.getUser} />
                </BrowserRouter>
            </>
        );
    }
}

export default connect(null, affiliate.actions)(AffiliateWrap)