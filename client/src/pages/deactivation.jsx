import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class Deactivation extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const title = 'Account Deactivation';
        setTitle({ pageTitle: title })
    }

    render() {
        return (
            <div className="col-in">
                <h1 className="main-heading-in">Account deactivation</h1>

                <div className="main-cnt redio-sec">

                    <p className="text-t text-dark">
                        <i className="fa fa-info-circle" aria-hidden={true}></i>
                        &nbsp;Your account is currently above zero. We recommend
                        you withdraw your remaining funds in your account
                        before you deactivate your account. <a href="#" className='text-dark'><strong>Withdraw funds here.</strong></a>
                    </p>

                    <p>
                        If you need to take a break from gambling to prevent
                        or control a possible gambling addiction, please
                        consider entering a self-exclusion. If you want to
                        stop gambling with us htmlFor other reasons, you may do
                        so by deactivating your account, either temporarily
                        or permanently.
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

                        <div className="form-group mar30">
                            <h4 className="h4">Why are you deactivating your account?</h4>
                            <select className="form-control">
                                <option>Select a reason</option>
                            </select>
                        </div>
                        <button className="btn-smt clr-blue">next</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Deactivation;