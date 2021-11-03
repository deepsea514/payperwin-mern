import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default class VerificationNotify extends Component {
    render() {
        return (
            <div className="verification-notify-container shadow">
                <div className="verification-notify-header">
                    <strong><FormattedMessage id="COMPONENTS.VERIFY.UNVERIFIED" /></strong>
                    <p className="pt-1">
                        <FormattedMessage id="COMPONENTS.VERIFY.DESCRIPTION" />
                    </p>
                </div>
                <div className="verification-notify-list">
                    <ul>
                        <li><i className="fal fa-times text-danger"></i>&nbsp;&nbsp;&nbsp;<FormattedMessage id="COMPONENTS.VERIFY.ID" /></li>
                        <li><i className="fal fa-times text-danger"></i>&nbsp;&nbsp;&nbsp;<FormattedMessage id="COMPONENTS.VERIFY.ADDRESS" /></li>
                    </ul>
                </div>
                <hr />
                <div className="verification-notify-footer">
                    <Link to="/verification" className="pull-right">
                        <strong><FormattedMessage id="COMPONENTS.VEIRFY.VERIFY" /> <i className="fas fa-chevron-right"></i></strong>
                    </Link>
                </div>
            </div>
        );
    }
}
