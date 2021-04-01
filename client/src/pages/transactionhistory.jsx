
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    render() {
        setTitle({ pageTitle: 'Transaction History' });
        return (
            <div className="col-in">
                <h1 className="main-heading-in">Transaction history</h1>
                <div className="main-cnt">
                    <ul
                        className="histyr-list d-flex justify-content-space">
                        <li>FILTER OPTIONS</li>
                        <li>
                            <a href="#"><i className="fas fa-calendar-week"></i> Date Range </a>
                        </li>
                        <li>
                            <a href="#"> <i className="fas fa-business-time"></i> Filter </a>
                        </li>
                    </ul>
                    <div className="amount-dtails">
                        <div className="row">
                            <div className="col-sm-8">
                            </div>
                            <div className="col-sm-2 text-right">
                                <strong> AMOUNT </strong>
                            </div>
                            <div className="col-sm-2 text-right">
                                <strong> BALANCE </strong>
                            </div>
                        </div>
                        <div className="row amount-col bg-color-box">
                            <div className="col-sm-8">
                                <span>Thu, Apr 30, 2020</span>
                                <small>1 Wager(s) Placed</small>
                            </div>
                            <div className="col-sm-2 text-right">
                                <small>-5.00</small>
                            </div>
                            <div className="col-sm-2 text-right">
                                <small>93.5</small>
                            </div>
                        </div>
                        <div className="row amount-col bg-color-box">
                            <div className="col-sm-8">
                                <span>Thu, Apr 30, 2020</span>
                                <small>1 Wager(s) Placed</small>
                            </div>

                            <div className="col-sm-2 text-right">
                                <small>-5.00</small>
                            </div>
                            <div className="col-sm-2 text-right">
                                <small>93.5</small>
                            </div>
                        </div>
                        <div className="row amount-col bg-color-box">
                            <div className="col-sm-8">
                                <span>Thu, Apr 30, 2020</span>
                                <small>1 Wager(s) Placed</small>
                            </div>

                            <div className="col-sm-2 text-right">
                                <small>-5.00</small>

                            </div>
                            <div className="col-sm-2 text-right">
                                <small>93.5</small>
                            </div>
                        </div>
                    </div>
                    <div className="load-m text-center">
                        <a className="load-more" href="#">Load More</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransactionHistory;