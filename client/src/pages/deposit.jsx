import React, { PureComponent } from 'react';
// import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder'
import { Link, withRouter } from 'react-router-dom';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Deposit extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // updateBalance(amount) {
    //     const { updateUser } = this.props;
    //     const url = `${serverUrl}/balanceUpdate`;
    //     axios({
    //         method: 'post',
    //         url,
    //         data: {
    //             amount,
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         withCredentials: true,
    //     }).then(({ data: balance }) => {
    //         updateUser('balance', balance);
    //     }).catch((err) => {
    //         if (err.response) {
    //             console.log(err.response);
    //         }
    //     });
    // }

    componentDidMount() {
        setTitle({ pageTitle: 'Deposit' });
    }

    render() {
        return (
            <div className="col-in">
                <h3>Deposit</h3>
                <div className="main-cnt">
                    <p className="dpsit">Select a deposit method. To find out more about our different Payment Methods, please check our payment methods page.</p>
                    <div className="deposit-in bg-color-box pad10">
                        <h4 className="header-i4">SELECT DEPOSIT METHOD</h4>
                        <ul className="diposit-list d-flex flex-wrap justify-content-space">
                            <li>
                                <Link to={{ pathname: '/etransfer' }}>
                                    <img src="images/eTransfer.png" />
                                </Link>
                                <Link to={{ pathname: '/etransfer' }}>
                                    Interac eTransfer
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <p className="dpsit">
                        PAYPER WIN make every effort to ensure our payment processing rules strike a balance between being fair to you the customer, and free of fees, while also enabling us to keep offering the best value odds online. Whenever possible we absorb transaction fees, however failure to meet our industry standard deposit roll-over threshold (three times deposit amount) will incur a 3% processing fee on the deposit and any applicable withdrawal fee.
                        <br />
                        <br />
                        Please see the payment methods pages of the site for more information on fees.
                    </p>
                </div>
                {/* <button className="form-button" onClick={() => this.updateBalance(100)}>Deposit $100 (Testing Purposes)</button> */}
            </div>
        );
    }
}

export default withRouter(Deposit);