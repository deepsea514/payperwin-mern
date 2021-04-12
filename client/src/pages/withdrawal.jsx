import React, { PureComponent } from 'react';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder'
const config = require('../../../config.json');
const serverUrl = config.appUrl;

export default class Deposit extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    updateBalance(amount) {
        const { updateUser } = this.props;
        const url = `${serverUrl}/balanceUpdate`;
        axios({
            method: 'post',
            url,
            data: {
                amount,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(({ data: balance }) => {
            updateUser('balance', balance);
        }).catch((err) => {
            if (err.response) {
                console.log(err.response);
            }
        });
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Withdrawal' });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="col-in">
                <h3>Withdraw</h3>
                <div className="main-cnt">
                    <p className="dpsit">
                        Select a withdrawal method. To find out more about our different Payment Methods, please check our payment methods page.
                    </p>
                    <div className="deposit-in bg-color-box pad10">
                        <h4 className="header-i4">SELECT WITHDRAWAL METHOD</h4>
                        <ul className="diposit-list d-flex flex-wrap justify-content-space">
                            <li><a href="#"><img src="images/eTransfer.png" /></a> <a href="#">Interac eTransfer </a></li>
                        </ul>
                    </div>
                    <p className="dpsit">
                        PAYPER WIN make every effort to ensure our payment processing rules strike a balance between being fair to you the customer, and free of fees, while also enabling us to keep offering the best value odds online. Whenever possible we absorb transaction fees, however failure to meet our industry standard deposit roll-over threshold (three times deposit amount) will incur a 3% processing fee on the deposit and any applicable withdrawal fee.
                        <br />
                        <br />
                        Please see the payment methods pages of the site for more information on fees.
                    </p>
                </div>
            </div>
        );
    }
}
