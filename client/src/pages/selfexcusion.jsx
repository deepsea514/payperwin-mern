import React, { Component } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import { Button } from '@material-ui/core';
import axios from 'axios';
import dateformat from "dateformat";
import DocumentMeta from 'react-document-meta';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class SelfExcusion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            readMore: false,
            peorid: null,
            step: 1,
            metaData: null,
        }
    }

    componentDidMount() {
        const title = 'Self Exclusion';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
    }

    onChoosePeorid = (evt, peorid) => {
        if (evt.target.checked)
            this.setState({ peorid: peorid })
    }

    next = (evt) => {
        evt.preventDefault();
        this.setState({ step: 2 });
    }

    selfExcusion = () => {
        const { peorid } = this.state;
        const { getUser } = this.props;
        axios.post(`${serverUrl}/self-exclusion`, { peorid }, { withCredentials: true })
            .then(() => {
                window.scrollTo(0, 0);
                getUser();
            })
    }

    render() {
        const { readMore, step, metaData } = this.state;
        const { user } = this.props;
        let selfExcluded = null;
        if (user &&
            user.roles.selfExcluded &&
            (new Date()).getTime() < (new Date(user.roles.selfExcluded)).getTime()
        ) {
            selfExcluded = dateformat(new Date(user.roles.selfExcluded), "mediumDate");
        }

        return (
            <div className="col-in">
                {metaData && <DocumentMeta {...metaData} />}
                <h1 className="main-heading-in">Self exclusion</h1>
                {user && selfExcluded && <p className="text-t"><i className="fa fa-info-circle"
                    aria-hidden={true}></i> Your account is
                    self-excluded till {selfExcluded}. </p>}
                {user && !selfExcluded && <div className="main-cnt redio-sec ml-3">
                    <p className="text-t"><i className="fa fa-info-circle"
                        aria-hidden={true}></i> Your account is
                        currently above zero. We recommend you withdraw
                        remaining funds in your account before you
                        self-exclude. Withdraw funds here. </p>
                    <p>
                        If you need to take a break from gambling to prevent
                        or control a possible gambling addiction, we
                        recommend you withdraw funds in your account and
                        make your account inaccesible by excluding yourself
                        either temporarily or permanently.
                    </p>

                    {readMore && <>
                        <p>
                            When the exclusion period has passed, we will notify you by email so that you may request to reopen your account. Note that a permanently excluded account cannot be reopened. Please read our Terms and Conditions regarding self-exclusion carefully.
                        </p>
                        <p>
                            We also recommend you
                            <ul>
                                <li>
                                    • Request self-exclusion with other gambling operators.
                                </li>
                                <li>
                                    • Install software that blocks access to internet gambling.
                                </li>
                                <li>
                                    • Unlike/Unfollow any gambling related social media accounts.
                                </li>
                            </ul>
                        </p>
                    </>}
                    <a className="read-more" style={{ cursor: 'pointer' }} onClick={() => this.setState({ readMore: !readMore })}>{readMore ? 'Read less' : 'Read more'} </a>

                    {step == 1 && <div>
                        <h4 className="h4">How long would you like to self-exclude?</h4>
                        <form onSubmit={this.next}>
                            <p>
                                <input type="radio" id="time-6-months"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '6 months')} />
                                <label htmlFor="time-6-months">6 months</label>
                            </p>
                            <p>
                                <input type="radio" id="time-1-year"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '1 year')} />
                                <label htmlFor="time-1-year">1 year</label>
                            </p>
                            <p>
                                <input type="radio" id="time-3-years"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '3 years')} />
                                <label htmlFor="time-3-years">3 years</label>
                            </p>
                            <p>
                                <input type="radio" id="time-5-years"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '5 years')} />
                                <label htmlFor="time-5-years">5 years</label>
                            </p>
                            <p>
                                <input type="radio" id="time-permanent"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, 'permanent')} />
                                <label htmlFor="time-permanent">Permanent</label>
                            </p>
                            {/* <button type="submit" className="btn-primary clr-t-l mar30">Next</button> */}
                            <Button type="submit" variant="contained" color="secondary">Next</Button>
                        </form>
                    </div>}
                    {step == 2 && <div>
                        <h4 className="h4">Terms And Conditions</h4>
                        <p>
                            By submitting this self-exclusion notice you acknowledge that you have read and understand our self-exclusion method, as described on our Responsible Gaming Page, and agree to the following:
                        </p>
                        <p>
                            You authorize PAYPER Win to prevent you from undertaking wagering activities on the selected product(s) for the indicated duration effective immediately.
                        </p>
                        <p>
                            You understand that this exclusion is voluntary and does not place any obligation, duty or responsibility on any other person or body other than yourself.
                        </p>
                        <p>
                            During the period of self-exclusion chosen by you we will use reasonable endeavours to prevent you gambling with us, including as applicable closing your account/blocking access to our products and attempting to identify any existing or duplicate accounts opened or operated by you.
                        </p>
                        <p>
                            However, you agree that you have an equal obligation not to seek to circumvent your self-exclusion.
                        </p>
                        <p>
                            You accept that we have no liability to you if you seek to breach your self-exclusion and gamble by opening further accounts or changing your registration details.
                        </p>
                        <p>
                            Once your self-exclusion has commenced, the decision is irreversible until the end of the period you have chosen.
                        </p>
                        <p>
                            Upon entry into a permanent self-exclusion you will need to contact Customer Services to return your remaining account balance in accordance with our withdrawal policy.
                        </p>
                        <p>
                            All reasonable attempts will be made to remove you from any direct marketing lists we hold, generally this will take effect within 24hrs of your self-exclusion request. It is your responsibility to opt out of any marketing communications you may receive from a third party or access via social media.
                        </p>
                        <p>
                            Once your self-exclusion period has ended, Customer Services will contact you to confirm if you wish to reopen your account.
                        </p>
                        <Button variant="contained" color="secondary" onClick={this.selfExcusion}>Confirm and Self-Exclusion</Button>
                    </div>}
                </div>}
            </div>
        );
    }
}

export default SelfExcusion;