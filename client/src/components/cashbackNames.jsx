import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

class CashbackNames extends Component {
    render() {
        return (
            <div className="verification-proof-container shadow">
                <h6><FormattedMessage id="COMPONENTS.CASHBACK.FAQ" /></h6>
                <div className="verification-proof-list">
                    <p>
                        <FormattedMessage id="COMPONENTS.CASHBACK.FAQ_CONTENT" />
                    </p>
                </div>
            </div>
        );
    }
}

export default injectIntl(CashbackNames);