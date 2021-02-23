import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class SelfExcusion extends Component {
    render() {
        setTitle({ pageTitle: 'Self Exclusion' });
        return (
            <div className="col-in">
                <h1 className="main-heading-in">Self exclusion</h1>
                <div className="main-cnt redio-sec">
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
                    <a className="read-more" href="#">Read more </a>
                    <h4 className="h4">How long would you like to self-exclude?</h4>
                    <form action="#">
                        <p>
                            <input type="radio" id="test1"
                                name="radio-group" />
                            <label htmlFor="test1">6 months</label>
                        </p>
                        <p>
                            <input type="radio" id="test2"
                                name="radio-group" />
                            <label htmlFor="test2">1 year</label>
                        </p>
                        <p>
                            <input type="radio" id="test3"
                                name="radio-group" />
                            <label htmlFor="test3">3 years</label>
                        </p>
                        <p>
                            <input type="radio" id="test4"
                                name="radio-group" />
                            <label htmlFor="test4">5 years</label>
                        </p>
                        <p>
                            <input type="radio" id="test5"
                                name="radio-group" />
                            <label htmlFor="test5">Permanent</label>
                        </p>
                        <button type="submit"
                            className="btn-smt clr-t-l mar30">Permanent
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default SelfExcusion;