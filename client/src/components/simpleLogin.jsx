import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { FormattedMessage, injectIntl } from "react-intl";

class SimpleLogin extends Component {
    render() {
        const { showLoginModalAction } = this.props;

        return (
            <div className="form not-mobile">
                <div className="form-join">
                    <div className="form-group">
                        <button className="log-in-btn" onClick={() => showLoginModalAction(true)}><FormattedMessage id="COMPONENTS.LOGIN" /></button>
                    </div>
                    <div className="form-group">
                        <Link to={{ pathname: '/signup' }} className="join"><FormattedMessage id="COMPONENTS.JOIN" /></Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, frontend.actions)(withRouter(SimpleLogin));
