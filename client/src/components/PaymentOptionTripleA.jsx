import React, { Component } from 'react';

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
        const { onBack, option } = this.props;
        const { currency } = this.state;
        return (
            <div className="main-cnt mt-5">
                <a
                    style={{ cursor: 'pointer', fontSize: 16 }}
                    onClick={onBack}>
                    <strong><i className="fas fa-chevron-left"></i> Back</strong>
                </a>
                {option == 'bitcoin' && <div>
                    <span className="card-name">Bitcoin</span>
                    <img className="right" style={{ border: "none" }} src="images/bitcoin.png" alt="Interac e-Transfer" width="170" height="auto" />
                </div>}
                {option == 'ethereum' && <div>
                    <span className="card-name">Ethereum</span>
                    <img className="right" style={{ border: "none" }} src="images/Ethereum.png" alt="Interac e-Transfer" width="170" height="auto" />
                </div>}
                {option == 'usdt' && <div>
                    <span className="card-name">USDT</span>
                    <img className="right" style={{ border: "none" }} src="images/USDT.png" alt="Interac e-Transfer" width="170" height="auto" />
                </div>}

                <hr />
                <p>For more information on a specific currency, select from the drop-down box below.</p>

                <div className="tab-navigation">
                    <label>Select currency</label>
                    <select id="select-box" className="form-control">
                        <option value="2">Canadian Dollars</option>
                    </select>
                </div>

                <div className="mt-3">
                    <table className="deposit-withdraw-table">
                        <thead>
                            <tr className="titles" style={{ display: "table-row" }}>
                                <th></th>
                                <th><center>Deposits</center></th>
                                <th><center>Withdrawals</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="title-cell">
                                    Fee
                                </td>
                                <td className="gray-cell">
                                    <center>Free</center>
                                </td>
                                <td className="gray-cell">
                                    <center>&lrm; $25</center>
                                </td>
                            </tr>
                            <tr >
                                <td className="title-cell">
                                    Minumum
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
                                    Maximum
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
                    <strong>PAYPER Win currently works with third party exchange providers that convert cryptocurrencies into the FIAT currency of your player account. Although we work to ensure that all costs are minimal, there may be fluctuations in the fees charged and conversion rates. We do not offer {currency} as an account currency.</strong>
                    <br />
                    <br />
                    <strong>Processing Time</strong>
                    <br />
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li>Deposits are usually confirmed within 30-60 minutes.</li>
                        <li>Withdrawals are processed instantly.</li>
                        <li>You may be asked to confirm your withdrawal request by clicking on a confirmation link that will be sent to your registered email address.</li>
                        <li>The payment information displayed (rate/address/QR code) is only valid for 10 minutes.</li>
                    </ul>
                    <br />
                    <strong>Fees</strong>
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li>PayPer Win absorbs all processing fees for deposits into your player account; however, we do not cover any {currency} network fees.</li>
                        <li>The exchange rate provided by our supplier is locked for 10 minutes. If you broadcast your transaction to the network within this time frame, you will receive the quoted rate.</li>
                        <li>For payouts, there may be fees charged by the exchange service which will not be reimbursed.</li>
                        <li>Each PayPer Win customer receives one free withdrawal per calendar month. Additional withdrawals during that month will incur the fee listed in the table above.</li>
                    </ul>
                    <br />
                    <p>PayPer Win makes every effort to ensure our payment processing rules strike a balance between being fair to our customers and free of fees, while also enabling us to keep offering the best value odds online. Whenever possible we absorb transaction fees, however failure to meet our deposit roll-over threshold (three times deposit amount) will incur a 10% processing fee on the withdrawal amount (minimum fee: $20 USD or equivalent), plus any applicable withdrawal fee. Please note that we reserve the right to reject withdrawals if the rollover requirement is not completed.</p>
                    <br />
                    <strong>Important Information</strong>
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li>All customers using this option must submit proof of ID and Address prior to any transactions being processed. If not already done, please log in and go to the Personal Details section of the website to upload your documents.</li>
                        <li>Funds NOT sent from exchanges or commercial wallet applications may require supporting Due Diligence documentation.</li>
                        <li>Transactions using cryptocurrency obtained from Hydra Market (or similar services) are not accepted.</li>
                        <li>PayPer Win uses an exchange service to convert your {currency} into your player account currency. We do not offer {currency} as an account currency.</li>
                    </ul>
                    <br />
                    <strong>Making a Deposit</strong>
                    <div>
                        <ul style={{ listStyle: 'number', marginLeft: '20px' }}>
                            <li>Log in to your PayPer Win account.</li>
                            <li>Go to the Cashier section and click on the {currency} icon in the deposit section.</li>
                            <li>Enter the deposit amount.</li>
                            <li>After you click “Submit”, you will be presented with payment information, including a QR code that you can scan and a payment amount and address to send your {currency} to.</li>
                            <li>Please follow the steps in your {currency} wallet to confirm the payment.</li>
                            <li>If your deposit is successful, the funds will be added to your Pinnacle account within 30-60 minutes.</li>
                        </ul>
                    </div>
                    <br />
                    <strong>Making a Withdrawal</strong>
                    <div>
                        <ul style={{ listStyle: 'number', marginLeft: '20px' }}>
                            <li>Log in to your PayPer Win account.</li>
                            <li>Go to the Cashier section and click on the {currency} icon in the withdrawal section.</li>
                            <li>Enter the withdrawal amount and your cryptocurrency wallet address and submit.</li>
                            <li>Once your request is completed, the transaction will be reviewed for processing.</li>
                            <li>You will receive an email confirmation when your withdrawal request is approved.</li>
                        </ul>
                    </div>
                    <br />
                </article>
            </div>
        );
    }
}

export default PaymentOptionTripleA;