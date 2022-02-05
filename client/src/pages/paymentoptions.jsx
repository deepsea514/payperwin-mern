import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import PaymentOptionEtransfer from "../components/paymentOptionEtransfer";
import PaymentOptionTripleA from "../components/PaymentOptionTripleA";
import { FormattedMessage, injectIntl } from 'react-intl';

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
        const { intl } = this.props;

        return (
            <div className="col-in px-5">
                <h1 className="main-heading-in"><FormattedMessage id="COMPONENTS.PAYMENT.METHODS" /></h1>
                {!option && <div className="main-cnt">
                    <p>
                        <FormattedMessage id="PAGES.PAYMENT.METHODS.SUMMARY" />
                    </p>

                    <div className="tab-container">
                        <div className="tab-navigation">
                            <label><FormattedMessage id="PAGES.PAYMENT.CURRENCY.SELECT" /></label>
                            <select id="select-box" className="form-control">
                                <option value="2">{intl.formatMessage({ id: "PAGES.PAYMENT.CURRENCY.CAD" })}</option>
                            </select>
                        </div>

                        <div className="tab-content">
                            <br />
                            <h4 className="h4"><FormattedMessage id="PAGES.DEPOSITS" /></h4>
                            <div className="container">
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'etransfer' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/eTransfer.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> <FormattedMessage id="PAGES.WITHDRAW.INTERAC.ETRANSFER" /></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong><FormattedMessage id="COMPONENTS.PAYMENT.FREE" /></strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$25</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>$3,000&nbsp;Daily</strong></li>
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
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong><FormattedMessage id="COMPONENTS.PAYMENT.FREE" /></strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$5</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>$50,000&nbsp;Daily</strong></li>
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
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong><FormattedMessage id="COMPONENTS.PAYMENT.FREE" /></strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$5</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>$50,000&nbsp;Daily</strong></li>
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
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong><FormattedMessage id="COMPONENTS.PAYMENT.FREE" /></strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$5</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>$50,000&nbsp;Daily</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-content">
                            <br />
                            <h4 className="h4"><FormattedMessage id="COMPONENTS.SIDEBAR.WITHDRAW" /></h4>
                            <div className="container">
                                <div className="row pymnt-mthd" style={{ cursor: 'pointer' }} onClick={() => this.setState({ option: 'etransfer' })}>
                                    <div
                                        className="col-sm-4 border-right d-flex justify-content-center align-items-center">
                                        <img src="images/eTransfer.png" style={imageStyle} />
                                    </div>

                                    <div className="col-sm-8">
                                        <ul className="paymnt-mdhd">
                                            <li> <FormattedMessage id="PAGES.WITHDRAW.INTERAC.ETRANSFER" /></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong>$15</strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$25</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>-</strong></li>
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
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong>$25</strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$15</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>$50,000&nbsp;Daily</strong></li>
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
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong>$25</strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$15</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>$50,000&nbsp;Daily</strong></li>
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
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.FEE" /> : <strong>$25</strong> </li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" /> : <strong>$15</strong></li>
                                            <li><FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" /> : <strong>$50,000&nbsp;Daily</strong></li>
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

export default injectIntl(PaymentOptions);