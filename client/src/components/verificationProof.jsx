import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default class VerificationProof extends Component {
    render() {
        return (
            <>
                <div className="verification-proof-container shadow">
                    <h6><FormattedMessage id="COMPONENTS.VERIFY.PROOF_ID" /></h6>
                    <p><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ID" /></p>
                    <div className="verification-proof-list">
                        <ul>
                            <li><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ID_1" /></li>
                            <li><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ID_2" /></li>
                            <li><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ID_3" /></li>
                        </ul>
                    </div>
                </div>

                <div className="verification-proof-container shadow mt-3">
                    <h6><FormattedMessage id="COMPONENTS.VERIFY.PROOF_ADDRESS" /></h6>
                    <p><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ADDRESS" /></p>
                    <div className="verification-proof-list">
                        <ul>
                            <li><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ADDRESS_1" /></li>
                            <li><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ADDRESS_2" /></li>
                            <li><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ADDRESS_3" /></li>
                            <li><FormattedMessage id="COMPONENTS.VERIFY.UPLOAD_ADDRESS_4" /></li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}
