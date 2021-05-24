/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerWithdraws } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
const config = require("../../../../../../../config.json");
const FinancialStatus = config.FinancialStatus;

class Withdraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            withdraws: [],
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

        getCustomerWithdraws(customer._id, page, perPage)
            .then(({ data }) => {
                const { total, page, perPage, withdraws } = data;
                this.setState({ total, page, perPage, withdraws });
            })
            .catch(() => {
                this.setState({
                    withdraws: [],
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
        const { withdraws, loading } = this.state;
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
        if (withdraws.length == 0) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <h3>No Withdraws</h3>
                    </td>
                </tr>
            );
        }
        return withdraws.map((deposit, index) => (
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
                        {deposit.method}
                    </span>
                </td>
                <td className="pl-0">
                    {deposit.status == FinancialStatus.pending && <span className="label label-lg label-light-primary label-inline">
                        {deposit.status}
                    </span>}
                    {deposit.status == FinancialStatus.success && <span className="label label-lg label-light-success label-inline">
                        {deposit.status}
                    </span>}
                    {deposit.status == FinancialStatus.onhold && <span className="label label-lg label-light-warning label-inline">
                        {deposit.status}
                    </span>}
                    {deposit.status == FinancialStatus.inprogress && <span className="label label-lg label-light-info label-inline">
                        {deposit.status}
                    </span>}
                </td>
            </tr>
        ));
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    render() {
        const { className } = this.props;
        const { perPage, page, total } = this.state;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;
        return (
            <div className={`card card-custom ${className}`}>
                {/* Head */}
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                            Withdraws
                        </span>
                        <span className="text-muted mt-3 font-weight-bold font-size-sm">
                            More than 400+ new withdraws
                        </span>
                    </h3>
                    <div className="card-toolbar">
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

export default Withdraw;