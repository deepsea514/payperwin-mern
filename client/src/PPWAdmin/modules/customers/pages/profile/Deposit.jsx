/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerDeposits } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
import config from "../../../../../../../config.json";
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";
const FinancialStatus = config.FinancialStatus;

class Deposit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.customer._id,
            loading: true,
            deposits: [],
            total: 0,
            page: 1,
            perPage: 10,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { customer } = this.props;
        const { page, perPage } = this.state;
        this.setState({ loading: true });

        getCustomerDeposits(customer._id, page, perPage)
            .then(({ data }) => {
                const { total, page, perPage, deposits } = data;
                this.setState({ total, page, perPage, deposits });
            })
            .catch(() => {
                this.setState({
                    deposits: [],
                    total: 0,
                    page: 1,
                    perPage: 15,
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

    tableBody = () => {
        const { deposits, loading } = this.state;
        const { customer } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (deposits.length == 0) {
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <h3>No Deposits</h3>
                    </td>
                </tr>
            );
        }
        return deposits.map((deposit, index) => (
            <tr key={index}>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {index + 1}
                    </span>
                </td>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {this.getDate(deposit.createdAt)}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        ${deposit.amount} {customer.currency}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {deposit.reason ? deposit.reason.title : null}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {deposit.method}
                    </span>
                </td>
                <td className="pl-0">
                    {this.getFinancialStatus(deposit.status)}
                </td>
            </tr>
        ));
    }

    getFinancialStatus = (status) => {
        switch (status) {
            case FinancialStatus.pending:
                return <span className="label label-lg label-light-primary label-inline">{status}</span>
            case FinancialStatus.success:
                return <span className="label label-lg label-light-success label-inline">{status}</span>
            case FinancialStatus.onhold:
                return <span className="label label-lg label-light-warning label-inline">{status}</span>
            case FinancialStatus.approved:
            default:
                return <span className="label label-lg label-light-info label-inline">{status}</span>

        }
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
                            Deposits
                        </span>
                        <span className="text-muted mt-3 font-weight-bold font-size-sm">
                            More than 400+ new deposits
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
                                    <th className="p-0" >#</th>
                                    <th className="p-0" >Time</th>
                                    <th className="p-0" >Amount</th>
                                    <th className="p-0" >Reason</th>
                                    <th className="p-0" >Method</th>
                                    <th className="p-0" >Status</th>
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

export default Deposit;