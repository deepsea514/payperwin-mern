
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import axios from "axios";
import dateformat from "dateformat";
import { FormGroup, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import config from "../../../config.json";
const serverUrl = config.appUrl;

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
                withdraw: false
            },
            daterange: null,
            page: 1,
            loading: false,
        };
    }

    componentDidMount() {
        this.getHistory();
    }

    getHistory = (page = 0, clear = true) => {
        const { filter, daterange, transactions } = this.state;
        this.setState({ loading: true, });
        axios.post(`${serverUrl}/transactions`, { filter, daterange, page }, { withCredentials: true })
            .then(({ data }) => {
                if (clear) {
                    this.setState({ transactions: data, page });
                }
                else {
                    this.setState({ transactions: [...transactions, ...data], page });
                }
            }).finally(() => this.setState({ loading: false }));
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
            case 'betwon':
                return '';
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
            case 'betwon':
                return `Won the bet.`;
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

    changeFilter = async (event) => {
        const { name: field, checked: value } = event.target;
        if (field == 'all') {
            await this.setState({
                filter: {
                    all: true,
                    betwon: false,
                    placebet: false,
                    deposit: false,
                    withdraw: false
                }
            });
        }
        else {
            const { filter, daterange } = this.state;
            if (value) {
                await this.setState({
                    filter: {
                        ...filter,
                        ...{
                            all: false,
                            [field]: true
                        }
                    }
                });
            }
            else {
                let nextFilter = { ...filter };
                nextFilter[field] = false;
                let { betwon, placebet, deposit, withdraw } = nextFilter;
                let all = !betwon && !placebet && !deposit && !withdraw;
                await this.setState({
                    filter: {
                        betwon, placebet, deposit, withdraw, all
                    }
                });
            }
        }
        // this.getHistory();
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

    render() {
        setTitle({ pageTitle: 'Transaction History' });
        const { transactions, showFilter, filter, daterange, page, loading } = this.state;
        const { user } = this.props;
        return (
            <div className="col-in">
                <h1 className="main-heading-in">Transaction history</h1>
                <div className="main-cnt">
                    <ul
                        className="histyr-list d-flex justify-content-space">
                        <li>FILTER OPTIONS</li>
                        <li>
                            <DateRangePicker
                                initialSettings={daterange}
                                onApply={this.handleChangeDate}
                            >
                                <a href="#"><i className="fas fa-calendar-week"></i> Date Range </a>
                            </DateRangePicker>
                        </li>
                        <li>
                            <a onClick={() => this.setState({ showFilter: true })}> <i className="fas fa-business-time"></i> Filter </a>
                            {showFilter &&
                                <>
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
                                        </FormGroup>
                                        <Button variant="outlined" color="primary" onClick={() => {
                                            this.getHistory();
                                            this.setState({ showFilter: false })
                                        }}>Apply</Button>
                                        <Button variant="outlined" color="secondary" className="ml-2" onClick={() => this.setState({ showFilter: false })}>Cancel</Button>
                                    </div>
                                </>}
                        </li>
                    </ul>
                    <div className="amount-dtails">
                        <div className="row">
                            <div className="col-sm-8">
                            </div>
                            <div className="col-sm-2 text-right">
                                <strong> AMOUNT </strong>
                            </div>
                            {/* <div className="col-sm-2 text-right">
                                <strong> BALANCE </strong>
                            </div> */}
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
                                {/* <div className="col-sm-2 text-right">
                                    <small>{user ? this.getFormattedAmount(user.balance) : null}</small>
                                </div> */}
                            </div>
                        ))}
                    </div>
                    <div className="load-m text-center">
                        <a className="load-more"
                            disabled={loading}
                            onClick={() => this.getHistory(page + 1, false)}
                            style={{ cursor: 'pointer' }}
                        >
                            Load More
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransactionHistory;