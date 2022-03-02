import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';

class AdminMessage extends Component {
    render() {
        const { onDismiss, message } = this.props;

        return (
            <div className="adminMessage_container">
                <div className="cookieBanner_main">
                    <div className="cookieBanner_content">
                        <span>
                            {message.value.message}
                        </span>
                    </div>
                    <button className="adminMessage_button cookieBanner_small dead-center cookieBanner_dark" onClick={() => onDismiss(message.updatedAt)}>
                        <span><FormattedMessage id="COMPONENTS.DISMISS" /></span>
                    </button>
                </div>
            </div>
        )
    }
}

export default injectIntl(AdminMessage);