
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class PaymentOptions extends Component {
    render() {
        setTitle({ pageTitle: 'Payment Options' });
        return (
            <div className="col-in">
                <h1 className="main-heading-in">Payment methods</h1>
                <div className="main-cnt">
                    <p>
                        There are numerous payment options available to
                        Pinnacle customers.
                        They are determined by the currency you chose when
                        you open an account.
                    </p>

                    <div className="tab-container">
                        <div className="tab-navigation">
                            <label>Select currency</label>
                            <select id="select-box"
                                className="form-control">
                                {/* <option value="1">Australian Dollars</option> */}
                                <option value="2">Canadian Dollars</option>
                                {/* <option value="3">Colombian Pesos</option>
                                <option value="4">Czech Koruna</option>
                                <option value="5">Norwegian Krone</option> */}
                            </select>
                        </div>

                        <div className="tab-content">
                            <br />
                            <h4 className="h4">Deposits</h4>
                            <div className="container">
                                <div className="row pymnt-mthd">
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/eTransfer.png" />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Interac E-Transfer</li>
                                            <li>free : <strong>$10</strong> </li>
                                            <li>min : <strong>$10</strong></li>
                                            <li>Max : <strong>$2,500&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PaymentOptions;