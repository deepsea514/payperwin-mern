import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as cashback from "../redux/reducers";
import dateformat from "dateformat";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import CustomPagination from "../../../components/CustomPagination.jsx";

class Cashback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {
        const { getCashback } = this.props;
        getCashback();
    }

    onFilterChange = (filter) => {
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { cashbacks, loading, filter } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (cashbacks.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Data</h3>
                    </td>
                </tr>
            );
        }

        return cashbacks.map((cashback, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{cashback.user.email}</td>
                <td>${Number(cashback.fee).toFixed(2)}</td>
                <td>${Number(cashback.amount).toFixed(2)}</td>
                <td className="text-right">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                            <Dropdown.Item as={Link} to={`${cashback.user._id}/history/${filter.year}/${parseInt(filter.month) + 1}`}>
                                <i className="far fa-eye"></i>&nbsp; Detail
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        ));
    }

    onPageChange = (page) => {

    }

    render() {
        const { perPage } = this.state;
        const { total, currentPage, filter, filterCashbackChange } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Cashbacks</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <div className="col-lg-3 col-md-4">
                                    <select
                                        type="text"
                                        value={filter.year}
                                        className="form-control"
                                        name="year"
                                        onChange={(e) => filterCashbackChange({ year: e.target.value })}
                                    >
                                        <option>2021</option>
                                        <option>2022</option>
                                        <option>2023</option>
                                        <option>2024</option>
                                        <option>2025</option>
                                        <option>2026</option>
                                        <option>2027</option>
                                        <option>2028</option>
                                        <option>2029</option>
                                        <option>2030</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Select Year</b>
                                    </small>
                                </div>
                                <div className="col-lg-3 col-md-4">
                                    <select
                                        type="text"
                                        value={filter.month}
                                        className="form-control"
                                        name="month"
                                        onChange={(e) => filterCashbackChange({ month: e.target.value })}
                                    >
                                        <option value="0">January</option>
                                        <option value="1">Feburary</option>
                                        <option value="2">March</option>
                                        <option value="3">April</option>
                                        <option value="4">May</option>
                                        <option value="5">June</option>
                                        <option value="6">July</option>
                                        <option value="7">August</option>
                                        <option value="8">September</option>
                                        <option value="9">October</option>
                                        <option value="10">November</option>
                                        <option value="11">December</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Select Month</b>
                                    </small>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Lost This Month</th>
                                            <th scope="col">Qualified Cashback</th>
                                            <th scope="col">Details</th>
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
        );
    }
}


const mapStateToProps = (state) => ({
    cashbacks: state.cashback.cashbacks,
    loading: state.cashback.loading,
    total: state.cashback.total,
    currentPage: state.cashback.currentPage,
    filter: state.cashback.filter,
})

export default connect(mapStateToProps, cashback.actions)(Cashback)