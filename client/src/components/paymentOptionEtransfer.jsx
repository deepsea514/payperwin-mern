import React, { Component } from 'react';

class PaymentOptionEtransfer extends Component {
    render() {
        const { onBack } = this.props;
        return (
            <div className="main-cnt mt-5">
                <a
                    style={{ cursor: 'pointer', fontSize: 16 }}
                    onClick={onBack}>
                    <strong><i className="fas fa-chevron-left"></i> Back</strong>
                </a>
                <div>
                    <span className="card-name">Interac e-Transfer</span>
                    <img className="right" style={{ border: "none" }} src="images/eTransfer.png" alt="Interac e-Transfer" width="170" height="70" />
                </div>

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
                                    <center>&lrm; $15</center>
                                </td>
                            </tr>
                            <tr >
                                <td className="title-cell">
                                    Minumum
                                </td>
                                <td className="gray-cell">
                                    <center>&lrm; $25</center>
                                </td>
                                <td className="gray-cell">
                                    <center>&lrm; $25</center>
                                </td>
                            </tr>
                            <tr >
                                <td className="title-cell">
                                    Maximum
                                </td>
                                <td className="gray-cell">
                                    <center>24 hours: &lrm; $3,000</center>
                                </td>
                                <td className="gray-cell">
                                    <center>-</center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <article className="paymentoption-content mt-5">
                    <p>Please note that additional limits may be applied by Interac or your financial institution.</p>
                    <br />
                    <strong>Processing Time</strong>
                    <br />
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li>Interac e-Transfer deposits are usually completed in a few minutes but in rare circumstances can take a few hours.</li>
                        <li>Interac e-Transfer withdrawals will be processed into your bank account within one business day.</li>
                        <li>If you have accumulated transactions valuing CAD 7,500, international financial regulations require us to request proof of identification.</li>
                    </ul>
                    <br />
                    <strong>Fees</strong>
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li>Each PAYPER WIN customer receives one free withdrawal per calendar month.</li>
                        <li>Additional withdrawals during that month incur the fee listed above.</li>
                    </ul>
                    <br />
                    <p>PAYPER WIN makes every effort to ensure our payment processing rules strike a balance between being fair to our customers and free of fees, while also enabling us to keep offering the best value odds online. Whenever possible we absorb transaction fees, however failure to meet our deposit roll-over threshold (three times deposit amount) will incur a 10% processing fee on the withdrawal amount (minimum fee: $20 USD or equivalent), plus any applicable withdrawal fee. Please note that we reserve the right to reject withdrawals if the rollover requirement is not completed.</p>
                    <br />
                    <strong>Important Information</strong>
                    <ul style={{ listStyle: 'circle', marginLeft: '20px' }}>
                        <li>All funds must be sent and received from an Interac e-Transfer account registered in the same name as the PAYPER WIN account holder only. Funds received by PAYPER WIN sent by an Interac e-Transfer account registered to a person other than the account holder will not be accepted. Please make sure your personal details are correct by using the Account Details option in your account.</li>
                        <li>If you deposit funds to your PAYPER WIN account using Interac e-Transfer, payouts must be processed back to the same Interac e-Transfer account up to, but not limited to, the amount initially deposited.</li>
                    </ul>
                    <br />
                    <strong>Making a Deposit</strong>
                    <div>
                        <ul style={{ listStyle: 'number', marginLeft: '20px' }}>
                            <li>Log in to your PAYPER WIN account.</li>
                            <li>Go to the Cashier section and click on the Interac e-Transfer icon in the deposit section.</li>
                            <li>Enter the amount and confirm your email address and phone number on the form and select "Submit".</li>
                            <li>You will receive an email with instructions to complete the transaction.</li>
                            <li>If your deposit is successful, the funds will be added to your PAYPER WIN account.</li>
                        </ul>
                    </div>
                    <br />
                    <strong>Making a Withdrawal</strong>
                    <div>
                        <ul style={{ listStyle: 'number', marginLeft: '20px' }}>
                            <li>Log in to your PAYPER WIN account.</li>
                            <li>Go to the Cashier section and click on the Interac e-Transfer icon in the withdrawal section.</li>
                            <li>Enter the amount, ensuring that your email address and phone number are correct and select "Submit".</li>
                            <li>If the email address and phone number are not correct, please contact support@payperwin.co to update your account information before submitting the request.</li>
                            <li>Once the transaction is approved, the funds will be deducted from your PAYPER WIN player account and you will receive an email with instructions to claim your funds at Interac.</li>
                        </ul>
                    </div>
                    <br />
                </article>
            </div>
        );
    }
}

export default PaymentOptionEtransfer;