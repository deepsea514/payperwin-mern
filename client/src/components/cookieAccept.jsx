import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';

class CookieAccept extends Component {
    render() {
        const { acceptCookieAction } = this.props;
        return (
            <div className="cookieBanner_container">
                <div className="cookieBanner_main cookieBanner_main1">
                    <div className="cookieBanner_content">
                        <span>
                            <FormattedMessage id="COMPONENTS.COOKIE.CONTENT" values={{ cookie_policy: <a href="https://www.payperwin.com/privacy-policy#cookie-policy" target="_blank" rel="noopener noreferrer"><FormattedMessage id="COMPONENTS.COOKIE.POLICY" /></a> }} />
                        </span>
                    </div>
                    <button className="cookieBanner_button cookieBanner_small dead-center cookieBanner_dark" onClick={acceptCookieAction}>
                        <span>Accept</span>
                    </button>
                </div>
            </div>
        )
    }
}

export default injectIntl(CookieAccept);