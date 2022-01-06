import React, { Component } from "react";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { withRouter } from 'react-router-dom';
import { resend2FACode, verify2FACode } from "../redux/services";

class TfaModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resending_code: false,
            verifying: false,
            verification_code: '',
            message: 'We\'ve sent verification code to your email.',
        }
    }

    handleChange = (evt) => {
        const { require2FAAction, getUser, history, location: { pathname } } = this.props;
        const verification_code = evt.target.value;
        this.setState({ verification_code });
        if (verification_code.length == 6) {
            this.setState({ verifying: true });
            verify2FACode(verification_code)
                .then(({ data }) => {
                    if (data.success) {
                        this.setState({ verifying: false });
                        require2FAAction(false);
                        getUser((user) => {
                            if (user.autobet) {
                                history.push('autobet-dashboard');
                            }
                        });
                        if (pathname === '/login') {
                            history.replace({ pathname: '/' });
                        }
                    } else {
                        this.setState({ verifying: false, message: data.message });
                    }
                })
                .catch(() => {
                    this.setState({ verifying: false, message: 'Verification failed. Please try again.' });
                });
        }
    }

    sendAgain = (evt) => {
        this.setState({ resending_code: true });
        resend2FACode()
            .then(() => {
                this.setState({ resending_code: false, message: 'Verification was resent to your email.' });
            })
            .catch(() => {
                this.setState({ resending_code: false, message: 'Can\'t send verification code. Please try again.' });
            });
    }

    render() {
        const { require2FAAction } = this.props;
        const { verification_code, verifying, resending_code, message } = this.state;

        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={() => require2FAAction(false)} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => require2FAAction(false)} />
                    <div>
                        <br />
                        <b>Please input 6 digit verification code.</b>
                        <hr />
                        <p>{message}</p>
                        <input
                            className="form-control"
                            value={verification_code}
                            onChange={this.handleChange}
                            maxLength={6}
                        />
                        <div className="text-right">
                            <button className="form-button" onClick={this.sendAgain} disabled={resending_code}> Send Again </button>
                            <button className="form-button ml-2" onClick={() => require2FAAction(false)} disabled={verifying}> Cancel </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, frontend.actions)(withRouter(TfaModal))