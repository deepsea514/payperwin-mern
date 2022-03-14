import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as affiliates from "../redux/reducers";
import dateformat from "dateformat";
import "react-datepicker/dist/react-datepicker.css";
import CustomPagination from "../../../components/CustomPagination.jsx";

class Affiliates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            deleteId: null,
        }
    }

    componentDidMount() {
        const { getAffiliatesAction } = this.props;
        getAffiliatesAction();
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { affiliates, loading } = this.props;

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
        if (affiliates.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Affiliate Users</h3>
                    </td>
                </tr>
            );
        }

        return affiliates.map((affiliate, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{affiliate.email}</td>
                <td>{affiliate.company}</td>
                <td>{affiliate.click}</td>
                <td>{affiliate.conversions}</td>
                <td>{affiliate.deposits}</td>
                <td>${affiliate.commission} CAD</td>
                <td>{this.getStatus(affiliate.status)}</td>
                <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                            <Dropdown.Item as={Link} to={`/${affiliate._id}/edit`}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ deleteId: affiliate._id })}><i className="fas fa-trash"></i>&nbsp; Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        ));
    }

    getStatus = (status) => {
        if (status === 'active')
            return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Active</span>
        return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">Inactive</span>
    }

    onPageChange = (page) => {

    }

    render() {
        const { perPage } = this.state;
        const { total, currentPage, filter } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Affiliate Users</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to="/create" className="btn btn-success">Create A New Affiliate</Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Company</th>
                                            <th scope="col">Clicks</th>
                                            <th scope="col">Conversions</th>
                                            <th scope="col">Deposits</th>
                                            <th scope="col">Earned</th>
                                            <th scope="col">Status</th>
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
        );
    }
}


const mapStateToProps = (state) => ({
    affiliates: state.affiliates.affiliates,
    loading: state.affiliates.loading,
    total: state.affiliates.total,
    currentPage: state.affiliates.currentPage,
    filter: state.affiliates.filter,
})

export default connect(mapStateToProps, affiliates.actions)(Affiliates)