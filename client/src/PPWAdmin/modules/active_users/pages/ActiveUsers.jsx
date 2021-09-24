import React, { createRef } from "react";
import * as active_users from "../redux/reducers";
import { connect } from "react-redux";
import dateformat from "dateformat";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getActiveUsersCSV } from "../redux/services";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { CSVLink } from 'react-csv';
import config from "../../../../../../config.json";
const FinancialStatus = config.FinancialStatus;
const PaymentMethod = config.PaymentMethod;

class ActiveUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            activeUsersDownloadData: []
        };
        this.csvRef = createRef();
    }

    componentDidMount() {
        const { getActiveUsers } = this.props;
        getActiveUsers();
    }

    tableBody = () => {
        const { active_users, loading } = this.props;

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
        if (active_users.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Records</h3>
                    </td>
                </tr>
            );
        }

        return active_users.map((record, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record.username}</td>
                    <td>{record.email}</td>
                    <td>{record.total_bets}</td>
                    <td>{record.win}</td>
                    <td>{record.loss}</td>
                    <td>{record.res}</td>
                </tr>
            )
        })
    }

    onCountChange = (filter) => {
        this.props.countActiveUsersChange(filter);
    }

    downloadCSV = () => {
        const { count } = this.props;
        getActiveUsersCSV(count)
            .then(async ({ data }) => {
                await this.setState({ activeUsersDownloadData: data });
                this.csvRef.current.link.click();
            })
    }

    render() {
        const { activeUsersDownloadData, } = this.state;
        const { count } = this.props;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 order-12 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Active Users</h3>
                                </div>
                                <div className="card-toolbar">
                                    <CSVLink
                                        data={activeUsersDownloadData}
                                        filename='active-user-report.csv'
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
                                        <input
                                            type="number"
                                            value={count}
                                            className="form-control"
                                            placeholder=""
                                            onChange={(e) => {
                                                this.onCountChange(e.target.value);
                                            }}
                                        />
                                        <small className="form-text text-muted">
                                            <b>#</b> of Users
                                        </small>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col"># of Bets</th>
                                                <th scope="col">Win</th>
                                                <th scope="col">Loss</th>
                                                <th scope="col">Net</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.tableBody()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    active_users: state.active_users.active_users,
    loading: state.active_users.loading,
    count: state.active_users.count,
    state: state.active_users
})

export default connect(mapStateToProps, active_users.actions)(ActiveUsers)