import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder'

class Withdraw extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Withdrawal' });
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
                            <li>
                                <Link to={{ pathname: '/withdraw-etransfer' }}>
                                    <img src="images/eTransfer.png" />
                                </Link>
                                <Link to={{ pathname: '/withdraw-etransfer' }}>
                                    Interac eTransfer
                                </Link>
                            </li>
                            <li>
                                <Link to={{ pathname: '/withdraw-bitcoin' }}>
                                    <img src="images/bitcoin.png" />
                                </Link>
                                <Link to={{ pathname: '/withdraw-bitcoin' }}>
                                    Bitcoin
                                </Link>
                            </li>
                            <li>
                                <Link to={{ pathname: '/withdraw-bitcoin' }}>
                                    <img src="images/Ethereum.png" />
                                </Link>
                                <Link to={{ pathname: '/withdraw-bitcoin' }}>
                                    Ethereum
                                </Link>
                            </li>
                            <li>
                                <Link to={{ pathname: '/withdraw-bitcoin' }}>
                                    <img src="images/USDT.png" />
                                </Link>
                                <Link to={{ pathname: '/withdraw-bitcoin' }}>
                                    USDT
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
            </div>
        );
    }
}

export default withRouter(Withdraw);