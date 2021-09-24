import React, { createRef } from "react";
import * as reports from "../redux/reducers";
import { connect } from "react-redux";
import dateformat from "dateformat";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getProfitReportsCSV } from "../redux/services";
import { Link } from "react-router-dom";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { CSVLink } from 'react-csv';
import CustomDatePicker from "../../../../components/customDatePicker";
import config from "../../../../../../config.json";
const FinancialStatus = config.FinancialStatus;
const PaymentMethod = config.PaymentMethod;

class ProfitReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            profitsDownloadData: []
        };
        this.csvRef = createRef();
    }

    componentDidMount() {
        const { getProfitReports } = this.props;
        getProfitReports();
    }

    onPageChange = (page) => {
        const { getProfitReports } = this.props;
        getProfitReports(page);
    }

    tableBody = () => {
        const { profits, loading } = this.props;
        if (loading) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (profits.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Records</h3>
                    </td>
                </tr>
            );
        }

        return profits.map((record, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{dateformat(new Date(record.updatedAt), "yyyy-mm-dd HH:MM")}</td>
                    <td>{record.user ? record.user.email : null}</td>
                    <td>{record.financialtype == 'betfee' ? 'Winning Bet Fee' : 'Withdrawal Fee'}</td>
                    <td>{record.uniqid}</td>
                    <td>CAD {Number(record.amount).toFixed(2)}</td>
                </tr>
            )
        })
    }

    onFilterChange = (filter) => {
        const { filterProfitChange } = this.props;
        filterProfitChange(filter);
    }

    downloadCSV = () => {
        const { count } = this.props;
        getProfitReportsCSV(count)
            .then(async ({ data }) => {
                await this.setState({ profitsDownloadData: data });
                this.csvRef.current.link.click();
            })
    }

    render() {
        const { profitsDownloadData, perPage } = this.state;
        const { total, currentPage, filter } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 order-12 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Profit</h3>
                                </div>
                                <div className="card-toolbar">
                                    <CSVLink
                                        data={profitsDownloadData}
                                        filename='profit-report.csv'
                                        className='hidden'
                                        ref={this.csvRef}
                                        target='_blank'
                                    />
                                    <button className="btn btn-success font-weight-bolder font-size-sm mr-2" onClick={this.downloadCSV}>
                                        <i className="fas fa-download"></i>&nbsp; Download as CSV
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-lg-2 col-md-3">
                                        <CustomDatePicker
                                            className="form-control"
                                            placeholderText="Search"
                                            selected={filter.datefrom ? new Date(filter.datefrom) : null}
                                            onChange={date => {
                                                this.onFilterChange({ datefrom: date });
                                            }} />
                                        <small className="form-text text-muted">
                                            <b>Search</b> From
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <CustomDatePicker
                                            className="form-control"
                                            placeholderText="Search"
                                            selected={filter.dateto ? new Date(filter.dateto) : null}
                                            onChange={date => {
                                                this.onFilterChange({ dateto: date });
                                            }} />
                                        <small className="form-text text-muted">
                                            <b>Search</b> To
                                        </small>
                                    </div>
                                    <div className="col-lg-3 col-md-4">
                                        <select
                                            className="form-control"
                                            value={filter.type}
                                            onChange={e => {
                                                this.onFilterChange({ type: e.target.value });
                                            }} >
                                            <option value="all">Choose Match Status...</option>
                                            <option value="betfee">Winning Bet Fee</option>
                                            <option value="withdrawfee">Withdrawal Fee</option>
                                        </select>
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Event
                                        </small>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">User</th>
                                                <th scope="col">Event</th>
                                                <th scope="col">Transaction ID</th>
                                                <th scope="col">Fee</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.tableBody()}
                                        </tbody>
                                    </table>
                                </div>
                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={currentPage - 1}
                                    totalPages={totalPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPageChange(page + 1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    profits: state.reports.profits,
    loading: state.reports.loading_profits,
    total: state.reports.total_profits,
    currentPage: state.reports.currentPage_profits,
    filter: state.reports.filter_profits,
})

export default connect(mapStateToProps, reports.actions)(ProfitReport)