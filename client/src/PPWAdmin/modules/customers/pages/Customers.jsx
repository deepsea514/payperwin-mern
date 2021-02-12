import React from "react";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import * as customers from "../redux/reducers";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import { deleteCustomer } from "../redux/services";
import { addWithdraw } from "../../withdrawlogs/redux/services";
import { addDeposit } from "../../depositlogs/redux/services";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import CustomPagination from "../../../components/CustomPagination.jsx";
import dateformat from "dateformat";
import CreditModal from "../components/CreditModal";

class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteId: null,
            addDepositId: null,
            addWithdrawId: null,
            withdrawmax: 0,
            modal: false,
            modalvariant: "success",
            resMessage: "",
            perPage: 25,

        }
    }

    componentDidMount() {
        const { getCustomers, getReason } = this.props;
        getCustomers();
        getReason();
    }

    tableBody = () => {
        const { customers, loading } = this.props;

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
        if (customers.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Customers</h3>
                    </td>
                </tr>
            );
        }

        return customers.map((customer, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{customer.username}</td>
                    <td>{(customer.firstname ? customer.firstname : "") + " " + (customer.lastname ? customer.lastname : "")}</td>
                    <td>{customer.email}</td>
                    <td className="text-right">{dateformat(new Date(customer.createdAt), "mediumDate")}</td>
                    <td className="text-right">{customer.balance} {customer.currency}</td>
                    <td className="text-right">{customer.betHistory.length}</td>
                    <td className="text-right">2</td>
                    <td className="text-right">
                        <DropdownButton title="Actions">
                            <Dropdown.Item as={Link} to={`/${customer._id}/edit`}>
                                <i className="fas fa-edit"></i>&nbsp; Edit
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to={`/${customer._id}/detail`}>
                                <i className="far fa-eye"></i>&nbsp; Detail
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to={`/${customer._id}/profile`}>
                                <i className="far fa-user"></i>&nbsp; Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ addDepositId: customer._id })}><i className="fas fa-credit-card"></i>&nbsp; Add Deposit</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ addWithdrawId: customer._id, withdrawmax: customer.balance })}><i className="fas fa-credit-card"></i>&nbsp; Add Withdraw</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ deleteId: customer._id })}><i className="fas fa-trash"></i>&nbsp; Delete Customer</Dropdown.Item>
                        </DropdownButton>
                    </td>
                </tr>
            )
        })
    }

    deleteUser = () => {
        const { deleteId } = this.state;
        deleteCustomer(deleteId).then(() => {
            this.props.deleteCustomerSuccess(deleteId);
            this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
        }).catch(() => {
            this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
        })
    }

    addDeposit = (values, formik) => {
        formik.setSubmitting(true);
        const { addDepositId } = this.state;
        const credit = { ...values, ...{ user: addDepositId } };
        addDeposit(credit).then(({ data }) => {
            this.props.addDepositSuccess(data);
            this.setState({ modal: true, addDepositId: null, resMessage: "Successfully added!", modalvariant: "success" });
        }).catch((error) => {
            console.log(error)
            this.setState({ modal: true, addDepositId: null, resMessage: "Addition Failed!", modalvariant: "danger" });
        }).finally(() => {
            formik.setSubmitting(false);
        })
    }

    addWithdraw = (values, formik) => {
        formik.setSubmitting(true);
        const { addWithdrawId } = this.state;
        const credit = { ...values, ...{ user: addWithdrawId } };
        addWithdraw(credit).then(({ data }) => {
            this.props.addWithdrawSuccess(data);
            this.setState({ modal: true, addWithdrawId: null, resMessage: "Successfully added!", modalvariant: "success" });
        }).catch((error) => {
            console.log(error)
            this.setState({ modal: true, addWithdrawId: null, resMessage: "Addition Failed!", modalvariant: "danger" });
        }).finally(() => {
            formik.setSubmitting(false);
        })
    }

    onPageChange = (page) => {
        const { currentPage, getCustomers } = this.props;
        if (page != currentPage)
            getCustomers(page);
    }

    onFilterChange = (filter) => {
        this.props.filterCustomerChange(filter);
    }

    render() {
        const { deleteId, modal, modalvariant, perPage, resMessage, addDepositId,
            initialvalues, creditSchema, addWithdrawId, withdrawmax } = this.state;
        const { total, currentPage, filter, reasons } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Customer</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-lg-2 col-md-3">
                                        <input
                                            type="text"
                                            value={filter.name}
                                            className="form-control"
                                            name="searchName"
                                            placeholder="Search"
                                            onChange={(e) => {
                                                this.onFilterChange({ name: e.target.value });
                                            }}
                                        />
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Name
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <input
                                            type="text"
                                            value={filter.email}
                                            className="form-control"
                                            name="searchEmail"
                                            placeholder="Search"
                                            onChange={(e) => {
                                                this.onFilterChange({ email: e.target.value });
                                            }}
                                        />
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Email
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <input
                                            type="number"
                                            value={filter.balancemin}
                                            className="form-control"
                                            name="searchMinBalance"
                                            placeholder="Search"
                                            onChange={(e) => {
                                                this.onFilterChange({ balancemin: e.target.value });
                                            }}
                                        />
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Min Balance
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <input
                                            type="number"
                                            value={filter.balancemax}
                                            className="form-control"
                                            name="searchMaxBalance"
                                            placeholder="Search"
                                            onChange={(e) => {
                                                this.onFilterChange({ balancemax: e.target.value });
                                            }}
                                        />
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Max Balance
                                        </small>
                                    </div>
                                </div>
                                <div className="">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Username</th>
                                                <th scope="col">Full Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Date Joined</th>
                                                <th scope="col">Balance</th>
                                                <th scope="col"># of Bets</th>
                                                <th scope="col">Total Wager</th>
                                                <th scope="col" width="20%"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.tableBody()}
                                        </tbody>
                                    </table>

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
                </div>
                <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to delete this customer?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteUser}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                {addWithdrawId && <CreditModal
                    show={addWithdrawId != null}
                    onHide={() => this.setState({ addWithdrawId: null })}
                    title="Add Withdraw"
                    initialValues={initialvalues}
                    validationSchema={creditSchema}
                    onSubmit={this.addWithdraw}
                    reasons={reasons}
                    withdrawmax={withdrawmax}
                    type="withdraw"
                />}

                { addDepositId && <CreditModal
                    show={addDepositId != null}
                    onHide={() => this.setState({ addDepositId: null })}
                    title="Add Deposit"
                    initialValues={initialvalues}
                    validationSchema={creditSchema}
                    onSubmit={this.addDeposit}
                    reasons={reasons}
                    type="deposit"
                />}

                <Modal show={modal} onHide={() => this.setState({ modal: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>{resMessage}</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant={modalvariant} onClick={() => this.setState({ modal: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    customers: state.customer.customers,
    loading: state.customer.loading,
    total: state.customer.total,
    currentPage: state.customer.currentPage,
    filter: state.customer.filter,
    reasons: state.customer.reasons,
})

export default connect(mapStateToProps, customers.actions)(Customers)