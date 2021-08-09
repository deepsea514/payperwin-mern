import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import PaymentOptionEtransfer from "../components/paymentOptionEtransfer";
import PaymentOptionTripleA from "../components/PaymentOptionTripleA";

import GoToTop from "../components/gotoTop";

const imageStyle = {
    width: '90%',
    height: 'auto',
    maxHeight: 'none',
}

class PaymentOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            option: null,
        }
    }

    componentDidMount() {
        const title = 'Payment Methods';
        setTitle({ pageTitle: title })
    }

    render() {
        const { option } = this.state;
        return (
            <div className="col-in px-5">
                <h1 className="main-heading-in">Payment methods</h1>
                {!option && <div className="main-cnt">
                    <p>
                        There are numerous payment options available to
                        PAYPER WIN customers.
                        They are determined by the currency you chose when
                        you open an account.
                    </p>

                    <div className="tab-container">
                        <div className="tab-navigation">
                            <label>Select currency</label>
                            <select id="select-box" className="form-control">
                                <option value="2">Canadian Dollars</option>
                            </select>
                        </div>

                        <div className="tab-content">
                            <br />
                            <h4 className="h4">Deposits</h4>
                            <div className="container">
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'etransfer' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/eTransfer.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Interac E-Transfer</li>
                                            <li>Fee : <strong>Free</strong> </li>
                                            <li>Min : <strong>$25</strong></li>
                                            <li>Max : <strong>$3,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'bitcoin' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/bitcoin.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Bitcoin</li>
                                            <li>Fee : <strong>Free</strong> </li>
                                            <li>Min : <strong>$5</strong></li>
                                            <li>Max : <strong>$50,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'ethereum' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/Ethereum.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Ethereum</li>
                                            <li>Fee : <strong>Free</strong> </li>
                                            <li>Min : <strong>$5</strong></li>
                                            <li>Max : <strong>$50,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'usdt' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/USDT.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> USDT</li>
                                            <li>Fee : <strong>Free</strong> </li>
                                            <li>Min : <strong>$5</strong></li>
                                            <li>Max : <strong>$50,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-content">
                            <br />
                            <h4 className="h4">Withdrawals</h4>
                            <div className="container">
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'etransfer' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/eTransfer.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Interac E-Transfer</li>
                                            <li>Fee : <strong>$15</strong> </li>
                                            <li>Min : <strong>$25</strong></li>
                                            <li>Max : <strong>-</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'bitcoin' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/bitcoin.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Bitcoin</li>
                                            <li>Fee : <strong>$25</strong> </li>
                                            <li>Min : <strong>$15</strong></li>
                                            <li>Max : <strong>$50,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'ethereum' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/Ethereum.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Ethereum</li>
                                            <li>Fee : <strong>$25</strong> </li>
                                            <li>Min : <strong>$15</strong></li>
                                            <li>Max : <strong>$50,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'usdt' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/USDT.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> USDT</li>
                                            <li>Fee : <strong>$25</strong> </li>
                                            <li>Min : <strong>$15</strong></li>
                                            <li>Max : <strong>$50,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {(option == 'etransfer') && <>
                    <GoToTop />
                    <PaymentOptionEtransfer onBack={() => this.setState({ option: null })} />
                </>}
                {(option == 'bitcoin' || option == 'ethereum' || option == 'usdt') && <>
                    <GoToTop />
                    <PaymentOptionTripleA onBack={() => this.setState({ option: null })} option={option} />
                </>}
            </div>
        );
    }
}

export default PaymentOptions;