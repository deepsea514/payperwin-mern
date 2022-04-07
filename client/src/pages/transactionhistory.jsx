import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import dateformat from "dateformat";
import { FormGroup, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { FormattedMessage } from 'react-intl';
import { getTransactions } from '../redux/services';

class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            showFilter: false,
            filter: {
                all: true,
                betwon: false,
                placebet: false,
                deposit: false,
                withdraw: false,
                credit: false,
            },
            daterange: null,
            page: 1,
            loading: false,
            noMore: false,
        };
    }

    componentDidMount() {
        this.getHistory();
        const title = 'Transaction History';
        setTitle({ pageTitle: title })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.user && this.props.user) {
            this.getHistory();
        }
    }

    getHistory = (page = 0, clear = true) => {
        const { filter, daterange, transactions } = this.state;
        this.setState({ loading: true, noMore: false });
        getTransactions({ filter, daterange, page })
            .then(({ data }) => {
                this.setState({ transactions: clear ? data : [...transactions, ...data], page, noMore: data.length == 0 });
            }).finally(() => this.setState({ loading: false }));
    }

    getDate = (date) => {
        return dateformat(new Date(date), "ddd, mmmm dS, yyyy, hh:MM:ss TT");
    }

    getInOut = (type, method) => {
        switch (type) {
            case "deposit":
                return '';
            case "signupbonus":
                return "+"
            case "depositheld":
                return '-';
            case 'withdraw':
                return '-';
            case 'withdrawfee':
                return `-`;
            case 'cashback':
                return '+';
            case 'betwon':
                return '+';
            case 'betfee':
                return '-';
            case 'betcancel':
            case 'betcancelfee':
                return '+';
            case 'betdraw':
                return '+';
            case "prize":
                return '+';
            case 'bet':
                return '-';
            case 'betrefund':
                return '+';
            case 'transfer-out':
                return '+';
            case 'transfer-in':
                return '-';
            case 'invitebonus':
                return '+';
            case 'lock_event':
                return '-';
            case 'unlock_event':
                return '+';
            case 'win_event':
                return '+';
            case 'lose_event':
                return '-';
            case 'claim_reward':
                return '+';
            default:
                return '';
        }
    }

    getFormattedString = (type, method) => {
        switch (type) {
            case "deposit":
                return `Deposit made through ${method}`;
            case "signupbonus":
                return `Signup Bonus`;
            case "prize":
                return 'Prize';
            case 'depositheld':
                return `Deposit Held`;
            case 'withdraw':
                return `Withdraw made through ${method}`;
            case 'withdrawfee':
                return `Withdraw fee through ${method}`;
            case 'cashback':
                return 'Cashback';
            case 'betwon':
                return `Won the bet.`;
            case 'betfee':
                return 'Bet fee';
            case 'betcancel':
                return 'Bet Cancelled';
            case 'betcancelfee':
                return 'Bet Cancel Fee';
            case 'betdraw':
                return 'Bet Draw';
            case 'bet':
                return '1 Bet(s) placed.';
            case 'betrefund':
                return 'Bet Refund';
            case 'transfer-out':
                return 'Transfer out from the credit';
            case 'transfer-in':
                return 'Transfer in to the credit';
            case 'invitebonus':
                return 'Invite Bonus';
            case 'lock_event':
                return 'Lock bet amount for a side bet.';
            case 'unlock_event':
                return 'Unlock bet amount for a side bet.';
            case 'win_event':
                return 'Credit win amount in a side bet.';
            case 'lose_event':
                return 'Debit lose amount in a side bet.';
            case 'claim_reward':
                return 'Claim loyalty reward.';
            default:
                return '';
        }
    }

    getFormattedAmount = (amount) => {
        return Number(amount).toFixed(2);
    }

    changeFilter = async (event) => {
        const { name: field, checked: value } = event.target;
        if (field == 'all') {
            await this.setState({
                filter: {
                    all: true,
                    betwon: false,
                    placebet: false,
                    deposit: false,
                    withdraw: false,
                    credit: false,
                }
            });
        }
        else {
            const { filter } = this.state;
            if (value) {
                await this.setState({
                    filter: {
                        ...filter,
                        ...{ all: false, [field]: true }
                    }
                });
            }
            else {
                let nextFilter = { ...filter };
                nextFilter[field] = false;
                let { betwon, placebet, deposit, withdraw, credit } = nextFilter;
                let all = !betwon && !placebet && !deposit && !withdraw && !credit;
                await this.setState({
                    filter: { credit, betwon, placebet, deposit, withdraw, all }
                });
            }
        }
    }

    handleChangeDate = async (event, picker) => {
        await this.setState({
            daterange: {
                startDate: picker.startDate._d,
                endDate: picker.endDate._d
            }
        });
        this.getHistory();
    }

    getTransactionDetail = (transaction) => {
        if (transaction.betDetails) {
            if (transaction.betDetails.isParlay) {
                return (
                    <div><small>Parlay Bet</small> - <small>{transaction.betDetails.transactionID}</small></div>
                )
            }
            if (transaction.betDetails.origin == 'custom') {
                return (
                    <div><small>{transaction.betDetails.lineQuery.eventName}</small> - <small>{transaction.betDetails.transactionID}</small></div>
                )
            }
            return (
                <div><small>{`${transaction.betDetails?.teamA?.name} vs ${transaction.betDetails?.teamB?.name}`} </small> - <small>{transaction.betDetails?.transactionID}</small></div>
            )
        }
        return null;
    }

    render() {
        const { transactions, showFilter, filter, daterange, page, loading, noMore } = this.state;
        return (
            <div className="col-in">
                <h1 className="main-heading-in"><FormattedMessage id="PAGES.TRANSACTIONHISTORY" /></h1>
                <div className="main-cnt">
                    <ul className="histyr-list d-flex justify-content-space">
                        <li><FormattedMessage id="PAGES.TRANSACTIONHISTORY.FILTEROPTIONS" /></li>
                        <li>
                            <DateRangePicker
                                initialSettings={daterange}
                                onApply={this.handleChangeDate}
                            >
                                <a href="#"><i className="fas fa-calendar-week"></i> <FormattedMessage id="PAGES.TRANSACTIONHISTORY.DATERANGE" /> </a>
                            </DateRangePicker>
                        </li>
                        <li>
                            <a onClick={() => this.setState({ showFilter: true })}> <i className="fas fa-business-time"></i> Filter </a>
                            {showFilter && <>
                                <div className="background-closer" onClick={() => this.setState({ showFilter: false })} />
                                <div className="filter-dropdown">
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={filter.all}
                                                onChange={this.changeFilter}
                                                name="all" />}
                                            label="All"
                                            className="p-0 mb-0"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={filter.betwon}
                                                onChange={this.changeFilter}
                                                name="betwon" />}
                                            label="Bet Won"
                                            className="p-0 mb-0"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={filter.placebet}
                                                onChange={this.changeFilter}
                                                name="placebet" />}
                                            label="Bet Placed"
                                            className="p-0 mb-0"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={filter.deposit}
                                                onChange={this.changeFilter}
                                                name="deposit" />}
                                            label="Deposit"
                                            className="p-0 mb-0"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={filter.withdraw}
                                                onChange={this.changeFilter}
                                                name="withdraw" />}
                                            label="Withdraw"
                                            className="p-0 mb-0"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={filter.credit}
                                                onChange={this.changeFilter}
                                                name="credit" />}
                                            label="Credit"
                                            className="p-0 mb-0"
                                        />
                                    </FormGroup>
                                    <Button variant="outlined" color="primary" onClick={() => {
                                        this.getHistory();
                                        this.setState({ showFilter: false })
                                    }}><FormattedMessage id="PAGES.TRANSACTIONHISTORY.APPLY" /></Button>
                                    <Button variant="outlined" color="secondary" className="ml-2" onClick={() => this.setState({ showFilter: false })}><FormattedMessage id="PAGES.TRANSACTIONHISTORY.CANCEL" /></Button>
                                </div>
                            </>}
                        </li>
                    </ul>
                    <div className="amount-dtails">
                        <div className="row">
                            <div className="col-sm-8">
                            </div>
                            <div className="col-sm-2 text-right">
                                <strong> <FormattedMessage id="PAGES.TRANSACTIONHISTORY.AMOUNT" /> </strong>
                            </div>
                        </div>
                        {transactions.map((transaction, index) => (
                            <div className="row amount-col bg-color-box" key={index}>
                                <div className="col-sm-8">
                                    <span>{this.getDate(transaction.updatedAt)}</span>
                                    {this.getTransactionDetail(transaction)}
                                    <small>{this.getFormattedString(transaction.financialtype, transaction.method)}</small>
                                </div>
                                <div className="col-sm-2 text-right">
                                    <small>{this.getInOut(transaction.financialtype, transaction.method) + this.getFormattedAmount(transaction.amount)}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading && <center>
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </center>}
                    {!loading && !noMore && <div className="load-m text-center">
                        <a className="load-more"
                            disabled={loading}
                            onClick={() => this.getHistory(page + 1, false)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FormattedMessage id="PAGES.OPENBETS.LOADMORE" />
                        </a>
                    </div>}
                </div>
            </div >
        );
    }
}

export default TransactionHistory;