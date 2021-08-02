import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class VerificationNotify extends PureComponent {
    render() {
        return (
            <div className="verification-notify-container shadow">
                <div className="verification-notify-header">
                    <strong>Your profile is currently unverified.</strong>
                    <p className="pt-1">
                        It's important that we can identify out customers to comply with both regulatory requirements and to help ensure the security of customer accounts.
                        Please the following documents in order to do so:
                    </p>
                </div>
                <div className="verification-notify-list">
                    <ul>
                        <li><i className="fal fa-times text-danger"></i>&nbsp;&nbsp;&nbsp;ID</li>
                        <li><i className="fal fa-times text-danger"></i>&nbsp;&nbsp;&nbsp;Address</li>
                    </ul>
                </div>
                <hr />
                <div className="verification-notify-footer">
                    <Link to="/verification" className="pull-right">
                        <strong>VERIFY YOUR PROFILE <i className="fas fa-chevron-right"></i></strong>
                    </Link>
                </div>
            </div>
        );
    }
}
