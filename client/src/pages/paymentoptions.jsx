import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import PaymentOptionEtransfer from "../components/paymentOptionEtransfer";
import PaymentOptionBitcoin from "../components/paymentOptionBitcoin";

class PaymentOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            option: null,
        }
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Payment Options' });
    }

    render() {
        const { option } = this.state;
        return (
            <div className="col-in px-5">
                <h1 className="main-heading-in">Payment methods</h1>
                {!option && <div className="main-cnt">
                    <p>
                        There are numerous payment options available to
                        PayPer Win customers.
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
                                        <img src="images/eTransfer.png" />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Interac E-Transfer</li>
                                            <li>Fee : <strong>$10</strong> </li>
                                            <li>Min : <strong>$25</strong></li>
                                            <li>Max : <strong>$2,500&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'bitcoin' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/bitcoin.png" />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Bitcoin</li>
                                            <li>Fee : <strong>$10</strong> </li>
                                            <li>Min : <strong>$25</strong></li>
                                            <li>Max : <strong>$2,500&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'bitcoin' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/Ethereum.png" />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> Ethereum</li>
                                            <li>Fee : <strong>$10</strong> </li>
                                            <li>Min : <strong>$25</strong></li>
                                            <li>Max : <strong>$2,500&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'bitcoin' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/USDT.png" />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> USDT</li>
                                            <li>Fee : <strong>$10</strong> </li>
                                            <li>Min : <strong>$25</strong></li>
                                            <li>Max : <strong>$2,500&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {(option == 'etransfer') && <PaymentOptionEtransfer onBack={() => this.setState({ option: null })} />}
                {(option == 'bitcoin') && <PaymentOptionBitcoin onBack={() => this.setState({ option: null })} />}
            </div>
        );
    }
}

export default PaymentOptions;