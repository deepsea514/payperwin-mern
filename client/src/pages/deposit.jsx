import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder'
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

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
                        <div className='row'>
                            <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-etransfer' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/eTransfer.png" />
                                        </div>
                                        <div className='deposit-item-name'>Interac eTransfer</div>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-bitcoin' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/bitcoin.png" />
                                        </div>
                                        <div className='deposit-item-name'>Bitcoin</div>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-ethereum' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/Ethereum.png" />
                                        </div>
                                        <div className='deposit-item-name'>Ethereum</div>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-tether' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/USDT.png" />
                                        </div>
                                        <div className='deposit-item-name'>Tether</div>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-usdc' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/USDC.png" />
                                        </div>
                                        <div className='deposit-item-name'>USD Coin</div>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-binance' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/Binance.png" />
                                        </div>
                                        <div className='deposit-item-name'>Binance</div>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-giftcard' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/gift-card.png" />
                                        </div>
                                        <div className='deposit-item-name'>Gift Card</div>
                                    </Link>
                                </div>
                            </div>
                            {/* <div className='col-12 col-sm-6 col-md-3'>
                                <div className='deposit-item'>
                                    <Link to={{ pathname: '/deposit-creditcard' }} className='deposit-item-inner'>
                                        <div className='deposite-item-img-wrapper'>
                                            <img src="/images/payments/credit-card.png" />
                                        </div>
                                        <div className='deposit-item-name'>Credit Card</div>
                                    </Link>
                                </div>
                            </div> */}
                        </div>
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