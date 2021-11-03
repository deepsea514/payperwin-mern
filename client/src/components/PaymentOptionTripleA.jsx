import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

class PaymentOptionTripleA extends Component {
    constructor(props) {
        super(props);
        const { option } = props;
        let currency = '';
        switch (option) {
            case 'bitcoin':
                currency = 'Bitcoin';
                break;
            case 'ethereum':
                currency = 'Ethereum';
                break;
            case 'usdt':
            default:
                currency = 'USDT';
                break;
        }
        this.state = {
            currency
        }
    }

    render() {
        const { onBack, option, intl } = this.props;
        const { currency } = this.state;
        return (
            <div className="main-cnt mt-5">
                <a
                    style={{ cursor: 'pointer', fontSize: 16 }}
                    onClick={onBack}>
                    <strong><i className="fas fa-chevron-left"></i> <FormattedMessage id="PAGES.BACK" /></strong>
                </a>
                {option == 'bitcoin' && <div className="d-flex justify-content-between">
                    <span className="card-name">Bitcoin</span>
                    <img className="right-image" style={{ border: "none" }} src="images/bitcoin.png" alt="Interac e-Transfer" width="170" height="auto" />
                </div>}
                {option == 'ethereum' && <div className="d-flex justify-content-between">
                    <span className="card-name">Ethereum</span>
                    <img className="right-image" style={{ border: "none" }} src="images/Ethereum.png" alt="Interac e-Transfer" width="170" height="auto" />
                </div>}
                {option == 'usdt' && <div className="d-flex justify-content-between">
                    <span className="card-name">USDT</span>
                    <img className="right-image" style={{ border: "none" }} src="images/USDT.png" alt="Interac e-Transfer" width="170" height="auto" />
                </div>}

                <hr />
                <p><FormattedMessage id="COMPONENTS.PAYMENT.MOREINFO" /></p>

                <div className="tab-navigation">
                    <label><FormattedMessage id="COMPONENTS.PAYMENT.SELECT_CURRENCY" /></label>
                    <select id="select-box" className="form-control">
                        <option value="2">{intl.formatMessage({ id: "PAGES.PAYMENT.CURRENCY.CAD" })}</option>
                    </select>
                </div>

                <div className="mt-3">
                    <table className="deposit-withdraw-table">
                        <thead>
                            <tr className="titles" style={{ display: "table-row" }}>
                                <th></th>
                                <th><center><FormattedMessage id="PAGES.DEPOSITS" /></center></th>
                                <th><center><FormattedMessage id="PAGES.TRANSACTIONHISTORY.WITHDRAW" /></center></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="title-cell">
                                    <FormattedMessage id="COMPONENTS.PAYMENT.FEE" />
                                </td>
                                <td className="gray-cell">
                                    <center><FormattedMessage id="COMPONENTS.PAYMENT.FREE" /></center>
                                </td>
                                <td className="gray-cell">
                                    <center>&lrm; $25</center>
                                </td>
                            </tr>
                            <tr >
                                <td className="title-cell">
                                    <FormattedMessage id="COMPONENTS.PAYMENT.MINUMUM" />
                                </td>
                                <td className="gray-cell">
                                    <center>&lrm; $5</center>
                                </td>
                                <td className="gray-cell">
                                    <center>&lrm; $15</center>
                                </td>
                            </tr>
                            <tr >
                                <td className="title-cell">
                                    <FormattedMessage id="COMPONENTS.PAYMENT.MAXIMUM" />
                                </td>
                                <td className="gray-cell">
                                    <center>24 hours: &lrm; $50,000</center>
                                </td>
                                <td className="gray-cell">
                                    <center>24 hours: &lrm; $50,000</center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <article className="paymentoption-content mt-5">
                    <strong><FormattedMessage id="COMPONENTS.PAYMENT.NOTE_LIMIT_TRIPLEA" values={{ currency: currency }} /></strong>
                    <br />
                    <br />
                    <strong><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_PROCESSING_TIME" /></strong>
                    <br />
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_PROCESSING_TIME_1" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_PROCESSING_TIME_2" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_PROCESSING_TIME_3" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_PROCESSING_TIME_4" /></li>
                    </ul>
                    <br />
                    <strong><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_FEES" /></strong>
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_FEES_1" values={{ currency: currency }} /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_FEES_2" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_FEES_3" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_FEES_4" /></li>
                    </ul>
                    <br />
                    <p><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKES_EFFORT" /></p>
                    <br />
                    <strong><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_IMPORTANT" /></strong>
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_IMPORTANT_1" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_IMPORTANT_2" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_IMPORTANT_3" /></li>
                        <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_IMPORTANT_4" values={{ currency: currency }} /></li>
                    </ul>
                    <br />
                    <strong><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_DEPOSIT" /></strong>
                    <div>
                        <ul style={{ listStyle: 'number', marginLeft: '20px' }}>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_DEPOSIT_1" /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_DEPOSIT_2" values={{ currency: currency }} /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_DEPOSIT_3" /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_DEPOSIT_4" values={{ currency: currency }} /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_DEPOSIT_5" values={{ currency: currency }} /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_DEPOSIT_6" /></li>
                        </ul>
                    </div>
                    <br />
                    <strong><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_WITHDRAWAL" /></strong>
                    <div>
                        <ul style={{ listStyle: 'number', marginLeft: '20px' }}>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_WITHDRAWAL_1" /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_WITHDRAWAL_2" values={{ currency: currency }} /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_WITHDRAWAL_3" /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_WITHDRAWAL_4" /></li>
                            <li><FormattedMessage id="COMPONENTS.PAYMENT.TRIPLEA_MAKE_WITHDRAWAL_5" /></li>
                        </ul>
                    </div>
                    <br />
                </article>
            </div>
        );
    }
}

export default injectIntl(PaymentOptionTripleA);