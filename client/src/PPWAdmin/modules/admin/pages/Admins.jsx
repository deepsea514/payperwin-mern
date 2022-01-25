import React, { Component } from 'react';
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as admin from "../redux/reducers";
import dateformat from "dateformat";
import CustomPagination from "../../../components/CustomPagination.jsx";

class Admins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {
        const { getAdminsAction } = this.props;
        getAdminsAction();
    }

    onFilterChange = (filter) => {
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { admins, loading, adminUser } = this.props;

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
        if (admins.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Admins</h3>
                    </td>
                </tr>
            );
        }

        return admins.map((admin, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{admin.email}</td>
                <td>{admin.username}</td>
                <td>{admin.phone}</td>
                <td>{admin.role}</td>
                <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                            <Dropdown.Item as={Link} to={`/edit/${admin._id}`}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                            {adminUser && adminUser._id != admin._id && <Dropdown.Item onClick={() => this.setState({ deleteId: admin._id })}><i className="fas fa-trash"></i>&nbsp; Delete Admin</Dropdown.Item>}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        ));
    }

    render() {
        const { perPage } = this.state;
        const { total, currentPage, filter, filterAdminChangeAction } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Admins</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to="/create" className="btn btn-success font-weight-bolder font-size-sm ml-3">
                                    <i className="fas fa-newspaper"></i>&nbsp; Create a New Admin
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <div className="col-lg-4 col-md-4">
                                    <select
                                        value={filter.role}
                                        className="form-control"
                                        name="role"
                                        onChange={(e) => {
                                            filterAdminChangeAction({ role: e.target.value });
                                        }}
                                    >
                                        <option value='all'>All</option>
                                        <option value='super_admin'>Super Admin</option>
                                        <option value='customer_service'>Customer Service</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Status
                                    </small>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Role</th>
                                            <th scope="col"></th>
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
        )
    }
}

const mapStateToProps = (state) => ({
    admins: state.admin.admins,
    loading: state.admin.loading,
    total: state.admin.total,
    currentPage: state.admin.currentPage,
    filter: state.admin.filter,
    adminUser: state.adminUser.adminUser,
})

export default connect(mapStateToProps, admin.actions)(Admins)