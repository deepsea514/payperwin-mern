import React from "react";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import * as customers from "../redux/reducers";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import { deleteCustomer, suspendCustomer, updateCustomer, verifyCustomer } from "../redux/services";
import { addWithdraw } from "../../withdrawlogs/redux/services";
import { addDeposit } from "../../depositlogs/redux/services";
import CustomPagination from "../../../components/CustomPagination.jsx";
import dateformat from "dateformat";
import CreditModal from "../components/CreditModal";
import * as Yup from "yup";
import { Formik } from "formik";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import numberFormat from "../../../../helpers/numberFormat";

class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteId: null,
            addDepositId: null,
            addWithdrawId: null,
            changePasswordId: null,
            withdrawmax: 0,
            modal: false,
            modalvariant: "success",
            resMessage: "",
            perPage: 25,
            PasswordSchema: Yup.object().shape({
                password: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Password is required."),
                confirmpassword: Yup.string()
                    .required("You should confirm password")
                    .when("password", {
                        is: (val) => (val && val.length > 0 ? true : false),
                        then: Yup.string().oneOf([Yup.ref("password")], "Password and Confirm Password didn't match"),
                    }),
            }),
            initialValues: {
                password: "",
                confirmpassword: ""
            },
            suspendId: null,
            returnId: null,
            verifyId: null,
        }
    }

    componentDidMount() {
        const { getCustomers, getReason } = this.props;
        getCustomers();
        getReason();
    }

    getCustomerTier = (MaxWinLimitAmount) => {
        switch (MaxWinLimitAmount) {
            case "2000":
                return "0 (default)";
            case "3000":
                return "1";
            case "5000":
                return "2";
            case "10000":
                return "3";
            default:
                return "0";
        }
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
                    {/* <td>{index + 1}</td> */}
                    <td>{(customer.firstname ? customer.firstname : "") + " " + (customer.lastname ? customer.lastname : "")}</td>
                    <td><Link to={`/users/${customer._id}/profile`}>{customer.email}</Link></td>
                    <td className="">{this.getCustomerTier(customer.maxBetLimitTier || "2000")}</td>
                    <td className="">{dateformat(new Date(customer.createdAt), "mediumDate")}</td>
                    <td className="">{numberFormat(Number(customer.balance).toFixed(2))} {customer.currency}</td>
                    <td className="">{numberFormat(Number(customer.inplay).toFixed(2))} {customer.currency}</td>
                    <td className="">{customer.totalBetCount}</td>
                    <td className="">{numberFormat(Number(customer.totalWager).toFixed(2))} {customer.currency}</td>
                    <td className="">
                        <span className={`label label-lg label-inline font-weight-lighter mr-2  label-${customer.roles.verified ? 'success' : 'info'}`}>
                            {customer.roles.verified ? "Verified" : "Not Verified"}
                        </span>
                    </td>

                    <td className="text-right">
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Actions
                            </Dropdown.Toggle>

                            <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                                <Dropdown.Item onClick={() => this.setState({ changePasswordId: customer._id })}><i className="fas fa-credit-card"></i>&nbsp; Change Password</Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/users/${customer._id}/profile`}>
                                    <i className="far fa-user"></i>&nbsp; Profile
                                </Dropdown.Item>
                                {!customer.roles.verified && <Dropdown.Item onClick={() => this.setState({ verifyId: customer._id })}><i className="fas fa-check"></i>&nbsp; Verify Customer</Dropdown.Item>}
                                <Dropdown.Item onClick={() => this.setState({ addDepositId: customer._id })}><i className="fas fa-credit-card"></i>&nbsp; Add Deposit</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.setState({ addWithdrawId: customer._id, withdrawmax: customer.balance })}><i className="fas fa-credit-card"></i>&nbsp; Add Withdraw</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.setState({ deleteId: customer._id })}><i className="fas fa-trash"></i>&nbsp; Delete Customer</Dropdown.Item>
                                {!customer.roles.suspended && <Dropdown.Item onClick={() => this.setState({ suspendId: customer._id })}><i className="fas fa-pause"></i>&nbsp; Suspend Customer</Dropdown.Item>}
                                {customer.roles.suspended && <Dropdown.Item onClick={() => this.setState({ returnId: customer._id })}><i className="fas fa-play"></i>&nbsp; Return Customer</Dropdown.Item>}
                            </Dropdown.Menu>
                        </Dropdown>
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

    changePassword = (values, formik) => {
        const { changePasswordId } = this.state;
        this.setState({ isError: false, isSuccess: false });
        formik.setSubmitting(true);
        updateCustomer(changePasswordId, { password: values.password }).then(() => {
            this.setState({ modal: true, changePasswordId: null, resMessage: "Successfully changed!", modalvariant: "success" });
        }).catch(() => {
            this.setState({ modal: true, changePasswordId: null, resMessage: "Update Failed!", modalvariant: "danger" });
        }).finally(() => {
            formik.setSubmitting(false);
        })
    }

    suspendUser = (suspend) => {
        const { returnId, suspendId } = this.state;
        const { getCustomers } = this.props;
        const id = suspend ? suspendId : returnId;
        suspendCustomer(id, suspend)
            .then(() => {
                this.setState({ modal: true, returnId: null, suspendId: null, resMessage: "Successfully changed!", modalvariant: "success" });
                getCustomers();
            })
            .catch(() => {
                this.setState({ modal: true, returnId: null, suspendId: null, resMessage: "Update failed!", modalvariant: "danger" });
            })
    }

    verifyUser = () => {
        const { verifyId } = this.state;
        const { getCustomers } = this.props;
        verifyCustomer(verifyId).then(() => {
            this.setState({ modal: true, verifyId: null, resMessage: "Successfully Verified!", modalvariant: "success" });
            getCustomers();
        }).catch(() => {
            this.setState({ modal: true, verifyId: null, resMessage: "Verification Failed!", modalvariant: "danger" });
        })
    }

    render() {
        const { deleteId, modal, modalvariant, perPage, resMessage, addDepositId, changePasswordId,
            addWithdrawId, withdrawmax, PasswordSchema, initialValues, suspendId, returnId, verifyId } = this.state;
        const { total, currentPage, filter, reasons } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;
        const startNum = perPage * (currentPage - 1) + 1;
        const endNum = perPage * currentPage < total ? perPage * currentPage : total;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Users List</h3>
                                </div>
                                <div className="card-toolbar">
                                    {startNum} - {endNum} out of {total} users.
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group row">
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
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Full Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Tier</th>
                                                <th scope="col" className="sort-header" onClick={() => this.onFilterChange({ sortby: 'joined_date' })}>
                                                    Date Joined&nbsp;
                                                    {filter.sortby == 'joined_date' && <>
                                                        {filter.sort == 'asc' && <i className="fas fa-sort-amount-up-alt" />}
                                                        {filter.sort == 'desc' && <i className="fas fa-sort-amount-down-alt" />}
                                                    </>}
                                                </th>
                                                <th scope="col" className="sort-header" onClick={() => this.onFilterChange({ sortby: 'balance' })}>
                                                    Balance&nbsp;
                                                    {filter.sortby == 'balance' && <>
                                                        {filter.sort == 'asc' && <i className="fas fa-sort-amount-up-alt" />}
                                                        {filter.sort == 'desc' && <i className="fas fa-sort-amount-down-alt" />}
                                                    </>}
                                                </th>
                                                <th scope="col">In-Play</th>
                                                <th scope="col" className="sort-header" onClick={() => this.onFilterChange({ sortby: 'num_bets' })}>
                                                    # of Bets&nbsp;
                                                    {filter.sortby == 'num_bets' && <>
                                                        {filter.sort == 'asc' && <i className="fas fa-sort-amount-up-alt" />}
                                                        {filter.sort == 'desc' && <i className="fas fa-sort-amount-down-alt" />}
                                                    </>}
                                                </th>
                                                <th scope="col" className="sort-header" onClick={() => this.onFilterChange({ sortby: 'total_wager' })}>
                                                    Total Wager&nbsp;
                                                    {filter.sortby == 'total_wager' && <>
                                                        {filter.sort == 'asc' && <i className="fas fa-sort-amount-up-alt" />}
                                                        {filter.sort == 'desc' && <i className="fas fa-sort-amount-down-alt" />}
                                                    </>}
                                                </th>
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
                                    className="pagination"
                                    currentPage={currentPage - 1}
                                    totalPages={totalPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPageChange(page + 1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to manually verify this customer?</Modal.Title>
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

                <Modal show={verifyId != null} onHide={() => this.setState({ verifyId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to verify this customer?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ verifyId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.verifyUser}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={suspendId != null} onHide={() => this.setState({ suspendId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to return this customer?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ suspendId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.suspendUser(true)}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={returnId != null} onHide={() => this.setState({ returnId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to return this customer?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ returnId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.suspendUser(false)}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                {addWithdrawId && <CreditModal
                    show={addWithdrawId != null}
                    onHide={() => this.setState({ addWithdrawId: null })}
                    title="Add Withdraw"
                    onSubmit={this.addWithdraw}
                    reasons={reasons}
                    withdrawmax={withdrawmax}
                    type="withdraw"
                />}

                {addDepositId && <CreditModal
                    show={addDepositId != null}
                    onHide={() => this.setState({ addDepositId: null })}
                    title="Add Deposit"
                    onSubmit={this.addDeposit}
                    reasons={reasons}
                    type="deposit"
                />}

                {changePasswordId && <Modal show={changePasswordId != null} onHide={() => this.setState({ changePasswordId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reset Password</Modal.Title>
                    </Modal.Header>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={PasswordSchema}
                        onSubmit={this.changePassword}>
                        {(formik) => {
                            return <form onSubmit={formik.handleSubmit}>
                                <Modal.Body>
                                    <div className="form-group">
                                        <label>New Password<span className="text-danger">*</span></label>
                                        <input type="password" name="password" placeholder="Enter New Password"
                                            className={`form-control ${getInputClasses(formik, "password")}`}
                                            {...formik.getFieldProps("password")}
                                        />
                                        {formik.touched.password && formik.errors.password ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.password}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password<span className="text-danger">*</span></label>
                                        <input type="password" name="confirmpassword" placeholder="Enter Confirm Password"
                                            className={`form-control ${getInputClasses(formik, "confirmpassword")}`}
                                            {...formik.getFieldProps("confirmpassword")}
                                        />
                                        {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.confirmpassword}
                                            </div>
                                        ) : null}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="light-primary" onClick={() => this.setState({ changePasswordId: null })}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </form>
                        }}
                    </Formik>
                </Modal>}

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