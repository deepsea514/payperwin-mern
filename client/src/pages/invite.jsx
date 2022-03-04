import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class Invite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            inviteLink: `${window.location.origin}/signup?invite=${props.user.username}`
        }
    }

    copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        this.setState({ copied: true });
    }

    render() {
        const { copied, inviteLink } = this.state;
        setTitle({ pageTitle: 'Invite Friends' });
        return (
            <div className="invite-container">
                <div className="row mx-0 align-items-center">
                    <div className="col-md-6 pt-3 px-0" style={{ position: 'relative' }}>
                        <img src='/images/invite-logo.jpg' className='invite-logo' />
                    </div>
                    <div className="col-md-6 pt-3 invite-form">
                        <div className="p-3 mb-3">
                            <h2 className='invite-title'>SPREAD THE WORD</h2>
                            <p className='invite-description'>Refer a friend and you will receive 10% of your referral’s first deposit in Payper Win credits.</p>
                            <input value={inviteLink} readOnly className="invite-textarea" />
                            <div className="row px-3">
                                <div className="col-12 invite-copybutton py-2 cursor-pointer"
                                    onClick={() => this.copyUrl(inviteLink)}>
                                    {copied ? 'Copied' : 'Copy'}
                                </div>
                            </div>
                            <p className='invite-warn'>New players only, 19 or older. Available in Canada only. A minimum of $100 deposit by the referral is required for you to qualify.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Invite;