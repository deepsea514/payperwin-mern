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
                            <b style={{ background: '#dc6c44', padding: '2px', color: 'white' }}><FormattedMessage id="COMPONENTS.BETSTATUS.WAITINGFORMATCH" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.WAITINGFORMATCH_CONTENT" />
                        </li>
                        <li>
                            <b style={{ background: '#53b657', padding: '2px', color: 'white' }}><FormattedMessage id="COMPONENTS.BETSTATUS.MATCHED" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.MATCHED_CONTENT" />
                        </li>
                        <li>
                            <b style={{ background: '#f9ec77', padding: '2px', color: 'black' }}><FormattedMessage id="COMPONENTS.BETSTATUS.PARTIALMATCHED" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.PARTIALMATCHED_CONTENT" />
                        </li>
                        <li>
                            <b style={{ background: '#579187', padding: '2px', color: 'white' }}><FormattedMessage id="COMPONENTS.BETSTATUS.SETTLED" />:</b>
                            &nbsp;<FormattedMessage id="COMPONENTS.BETSTATUS.SETTLED_CONTENT" />
                        </li>
                        <li>
                            <b style={{ background: '#FFE2E5', padding: '2px', color: 'black' }}>Peer to Peer:</b>
                            &nbsp;Your bet is placed on the Peer to Peer marketplace.
                        </li>
                        <li>
                            <b style={{ background: '#EEE5FF', padding: '2px', color: 'black' }}>HIGH STAKER:</b>
                            &nbsp;Your bet is accepted on the HIGH STAKER marketplace.
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default injectIntl(BetStatus);