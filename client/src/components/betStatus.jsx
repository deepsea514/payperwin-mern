import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

class BetStatus extends Component {
    render() {
        return (
            <div className="verification-proof-container shadow">
                <h6><FormattedMessage id="PAGES.OPENBETS.BETSTATUS" /></h6>
                <div className="verification-proof-list">
                    <ul>
                        <li>
                            <b><FormattedMessage id="COMPONENTS.BETSTATUS.WAITINGFORMATCH" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.WAITINGFORMATCH_CONTENT" />
                        </li>
                        <li>
                            <b><FormattedMessage id="COMPONENTS.BETSTATUS.MATCHED" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.MATCHED_CONTENT" />
                        </li>
                        <li>
                            <b><FormattedMessage id="COMPONENTS.BETSTATUS.PARTIALMATCHED" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.PARTIALMATCHED_CONTENT" />
                        </li>
                        <li>
                            <b><FormattedMessage id="COMPONENTS.BETSTATUS.SETTLED" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.SETTLED_CONTENT" />
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default injectIntl(BetStatus);