import React, { Component } from "react";

class CookieAccept extends Component {
    render() {
        const { acceptCookieAction } = this.props;
        return (
            <div className="cookieBanner_container">
                <div className="cookieBanner_main cookieBanner_main1">
                    <div className="cookieBanner_content">
                        <span>
                            Welcome to PAYPER WIN.
                            We use cookies to provide you with the most relevant experience.
                            To change your cookie settings or for more information on cookies, see our <a href="https://www.payperwin.com/privacy-policy#cookie-policy" target="_blank" rel="noopener noreferrer">cookie policy</a>.
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

export default CookieAccept;