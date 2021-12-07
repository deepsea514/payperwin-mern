import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';

class AdminMessage extends Component {
    render() {
        const { onDismiss } = this.props;

        return (
            <div className="adminMessage_container">
                <div className="cookieBanner_main">
                    <div className="cookieBanner_content">
                        <span>
                            This is the custom message from admin.
                        </span>
                    </div>
                    <button className="adminMessage_button cookieBanner_small dead-center cookieBanner_dark" onClick={onDismiss}>
                        <span>Dismiss</span>
                    </button>
                </div>
            </div>
        )
    }
}

export default injectIntl(AdminMessage);