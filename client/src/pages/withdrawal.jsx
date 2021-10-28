import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormattedMessage } from 'react-intl';

class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const title = 'Withdraw';
        setTitle({ pageTitle: title })
    }

    render() {
        return (
            <div className="col-in">
                <h3><FormattedMessage id="COMPONENTS.WITHDRAW" /></h3>
                <div className="main-cnt">
                    <p className="dpsit">
                        <FormattedMessage id="PAGES.WITHDRAW.SUMMARY" />
                    </p>
                    <div className="deposit-in bg-color-box pad10">
                        <h4 className="header-i4"><FormattedMessage id="PAGES.WITHDRAW.SELECTMETHOD" /></h4>
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
                                <Link to={{ pathname: '/withdraw-ethereum' }}>
                                    <img src="images/Ethereum.png" />
                                </Link>
                                <Link to={{ pathname: '/withdraw-ethereum' }}>
                                    Ethereum
                                </Link>
                            </li>
                            <li>
                                <Link to={{ pathname: '/withdraw-tether' }}>
                                    <img src="images/USDT.png" />
                                </Link>
                                <Link to={{ pathname: '/withdraw-tether' }}>
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

export default withRouter(Withdraw);