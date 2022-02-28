/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerTransactions } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
import config from "../../../../../../../config.json";
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";

class TransactionHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.customer._id,
            loading: true,
            transactions: [],
            total: 0,
            page: 1,
            perPage: 100,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { customer } = this.props;
        const { page, perPage } = this.state;
        this.setState({ loading: true });

        getCustomerTransactions(customer._id, page, perPage)
            .then(({ data }) => {
                const { total, page, perPage, transactions } = data;
                this.setState({ total, page, perPage, transactions });
            })
            .catch(() => {
                this.setState({
                    transactions: [],
                    total: 0,
                    page: 1,
                    perPage: 100,
                });
            })
            .finally(() => this.setState({ loading: false }));
    }

    onPageChange = async (newpage) => {
        const { page } = this.state;
        if (page != newpage) {
            await this.setState({ page: newpage });
            this.getData();
        }
    }

    getInOut = (type) => {
        switch (type) {
            case "depositheld":
            case 'withdraw':
            case 'withdrawfee':
            case 'betfee':
            case 'bet':
            case 'transfer-in':
            case 'lock_event':
                return '- ';
            default:
                return '';
        }
    }

    tableBody = () => {
        const { transactions, loading } = this.state;
        const { customer } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (transactions.length == 0) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <h3>No Transactions</h3>
                    </td>
                </tr>
            );
        }
        return transactions.map((transaction, index) => (
            <tr key={index}>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {index + 1}
                    </span>
                </td>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {this.getDate(transaction.createdAt)}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {transaction.betId ? transaction.betId.pickName + ' @' + transaction.betId.pickOdds : null}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {this.getInOut(transaction.financialtype)}${Number(transaction.amount ? transaction.amount : 0).toFixed(2)}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {transaction.financialtype}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {transaction.uniqid}
                    </span>
                </td>
                <td className="pl-0">
                    {transaction.beforeBalance ? '$' + Number(transaction.beforeBalance).toFixed(2) : null}
                </td>
                <td className="pl-0">
                    {transaction.afterBalance ? '$' + Number(transaction.afterBalance).toFixed(2) : null}
                </td>
            </tr>
        ));
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    render() {
        const { className } = this.props;
        const { perPage, page, total, id } = this.state;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;
        return (
            <div className={`card card-custom ${className}`}>
                {/* Head */}
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                            Transaction History
                        </span>
                    </h3>
                    <div className="card-toolbar">
                        <Dropdown className="dropdown-inline" drop="down" alignRight>
                            <Dropdown.Toggle
                                id="dropdown-toggle-top2"
                                variant="transparent"
                                className="btn btn-light-primary btn-sm font-weight-bolder dropdown-toggle">
                                View:
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                <DropdownMenuCustomer id={id} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                {/* Body */}
                <div className="card-body pt-3 pb-0">
                    <div className="table-responsive text-left">
                        <table className="table table-vertical-center">
                            <thead>
                                <tr>
                                    <th className="p-0">#</th>
                                    <th className="p-0">Time</th>
                                    <th className="p-0">Game</th>
                                    <th className="p-0">Amount</th>
                                    <th className="p-0">Financial Type</th>
                                    <th className="p-0">Tx ID</th>
                                    <th className="p-0">Balance Before</th>
                                    <th className="p-0">Balance After</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.tableBody()}
                            </tbody>
                        </table>
                        <CustomPagination
                            className="pagination pull-right"
                            currentPage={page - 1}
                            totalPages={totalPages}
                            showPages={7}
                            onChangePage={(page) => this.onPageChange(page + 1)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default TransactionHistory;