import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder'
import { Link, withRouter } from 'react-router-dom';

class Deposit extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const title = 'Deposit';
        setTitle({ pageTitle: title })
    }

    render() {

        return (
            <div className="col-in">
                <h3><FormattedMessage id="COMPONENTS.SIDEBAR.DEPOSIT" /></h3>
                <div className="main-cnt">
                    <p className="dpsit"><FormattedMessage id="PAGES.DEPOSIT.SELECTALERT" /></p>
                    <div className="deposit-in bg-color-box pad10">
                        <h4 className="header-i4"><FormattedMessage id="PAGES.DEPOSIT.SELECTMETHOD" /></h4>
                        <ul className="diposit-list d-flex flex-wrap justify-content-space">
                            <li>
                                <Link to={{ pathname: '/deposit-etransfer' }}>
                                    <img src="images/eTransfer.png" />
                                </Link>
                                <Link to={{ pathname: '/deposit-etransfer' }}>
                                    Interac eTransfer
                                </Link>
                            </li>
                            <li>
                                <Link to={{ pathname: '/deposit-bitcoin' }}>
                                    <img src="images/bitcoin.png" />
                                </Link>
                                <Link to={{ pathname: '/deposit-bitcoin' }}>
                                    Bitcoin
                                </Link>
                            </li>
                            <li>
                                <Link to={{ pathname: '/deposit-ethereum' }}>
                                    <img src="images/Ethereum.png" />
                                </Link>
                                <Link to={{ pathname: '/deposit-ethereum' }}>
                                    Ethereum
                                </Link>
                            </li>
                            <li>
                                <Link to={{ pathname: '/deposit-tether' }}>
                                    <img src="images/USDT.png" />
                                </Link>
                                <Link to={{ pathname: '/deposit-tether' }}>
                                    Tether
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <p className="dpsit">
                        <FormattedMessage id="PAGES.WITHDRAW.MESSAGE.1" />
                        <br />
                        <br />
                        <FormattedMessage id="PAGES.WITHDRAW.MESSAGE.2" />
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(Deposit);