
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import axios from "axios";
import config from "../../../config.json";
import dateformat from "dateformat";
const serverUrl = config.appUrl;

class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        };
    }

    componentDidMount() {
        axios.post(`${serverUrl}/transactions`, {}, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ transactions: data });
            })
    }

    getDate = (date) => {
        return dateformat(new Date(date), "ddd, mmmm dS, yyyy, hh:MM:ss TT");
    }

    getInOut = (type, method) => {
        switch (type) {
            case "deposit":
                return '';
            case 'withdraw':
                return '-';
            case 'bet':
                switch (method) {
                    case 'bet':
                        return '-';
                    case 'bet - BETTED':
                    case 'bet - UNSETTLED':
                        return '-';
                    case 'bet - SETTLED':
                    case 'bet - REJECTED':
                    case 'bet - CANCELLED':
                    case 'bet - ROLLBACKED':
                        return '';
                    default:
                        return '';

                }
            default:
                return '';
        }
    }

    getFormattedString = (type, method) => {
        switch (type) {
            case "deposit":
                return `Deposit made through ${method}`;
            case 'withdraw':
                return `Withdraw made through ${method}`;
            case 'bet':
                switch (method) {
                    case 'bet':
                        return '1 Bet(s) placed.';
                    case 'bet - BETTED':
                        return '1 Bet(s) placed in sportsbook.';
                    case 'bet - UNSETTLED':
                        return '1 Bet(s) unsettled in sportsbook.';
                    case 'bet - SETTLED':
                        return '1 Bet(s) settled in sportsbook.';
                    case 'bet - REJECTED':
                        return '1 Bet(s) rejected in sportsbook.';
                    case 'bet - CANCELLED':
                        return '1 Bet(s) canceled in sportsbook.';
                    case 'bet - ROLLBACKED':
                        return '1 Bet(s) rollbacked in sportsbook.';
                    default:
                        return '';
                }
            default:
                return '';
        }
    }

    getFormattedAmount = (amount) => {
        return Number(amount).toFixed(2);
    }

    render() {
        setTitle({ pageTitle: 'Transaction History' });
        const { transactions } = this.state;
        const { user } = this.props;
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
                        {transactions.map((transaction, index) => (
                            <div className="row amount-col bg-color-box" key={index}>
                                <div className="col-sm-8">
                                    <span>{this.getDate(transaction.updatedAt)}</span>
                                    <small>{this.getFormattedString(transaction.financialtype, transaction.method)}</small>
                                </div>
                                <div className="col-sm-2 text-right">
                                    <small>{this.getInOut(transaction.financialtype, transaction.method) + this.getFormattedAmount(transaction.amount)}</small>
                                </div>
                                <div className="col-sm-2 text-right">
                                    <small>{user ? this.getFormattedAmount(user.balance) : null}</small>
                                </div>
                            </div>
                        ))}
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