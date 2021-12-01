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
            <React.Fragment>
                <div className="col-in invite-container">
                    <div className="row">
                        <div className="col-md-7 pt-3">
                            <h2>Invite a friend and you will get $50 Credit</h2>
                            <h5 className="mt-5">If you enjoy PAYPER WIN, share it with friends and colleagues to earn free credits.</h5>
                        </div>
                        <div className="col-md-5 pt-3">
                            <div className="shadow p-3 mb-3 bg-white rounded">
                                <h4>Share your link</h4>
                                <p>Copy your personal referral link and share it with your friends and followers.</p>
                                <textarea value={inviteLink} readOnly className="invite-textarea" />
                                <div className="row px-3">
                                    <div className="col-md-4 col-sm-12 invite-copybutton py-2 cursor-pointer"
                                        onClick={() => this.copyUrl(inviteLink)}>
                                        {copied ? 'Copied' : 'Copy'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Invite;