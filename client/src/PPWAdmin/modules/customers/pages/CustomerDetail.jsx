import React from "react";
import { connect } from "react-redux";
import * as customers from "../redux/reducers";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import { getCustomerDetail, updateCustomer } from "../redux/services";
import dateformat from "dateformat";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";

class CustomerDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            loading: false,
            customer: null,
            showHistory: false,
            resetPassword: false,
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
            isSuccess: false,
            isError: false,
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getCustomerDetail(id)
            .then(({ data }) => {
                this.setState({ customer: data, loading: false });
            })
            .catch(err => {
                this.setState({ customer: null, loading: false });
            });
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mediumDate");
    }

    betHistory = () => {
    }

    changePassword = (values, formik) => {
        const { id } = this.state;
        this.setState({ isError: false, isSuccess: false });
        formik.setSubmitting(true);
        updateCustomer(id, { password: values.password }).then(() => {
            this.setState({ isSuccess: true });
            this.setState({ resetPassword: false });
        }).catch(() => {
            this.setState({ isError: true });
        }).finally(() => {
            formik.setSubmitting(false);
        })
    }

    getInputClasses = (formik, fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }
        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }
        return "";
    };

    render() {
        const { customer, loading, showHistory, resetPassword, PasswordSchema, initialValues, isSuccess, isError } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    {!loading && customer == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}
                    {!loading && customer &&
                        <div className="card card-custom gutter-b text-left">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Customer Detail</h3>
                                </div>
                                <div className="d-flex align-items-center p-4">
                                    <button className="btn btn-transparent-success font-weight-bold mr-2" onClick={() => this.setState({ showHistory: true })}>Win/Loss History</button>
                                    <button className="btn btn-transparent-primary font-weight-bold mr-2" onClick={() => this.setState({ resetPassword: true })}>Reset Password</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>First Name</th>
                                                <td>{customer.firstname}</td>
                                                <th>Last Name</th>
                                                <td>{customer.lastname}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{customer.email}</td>
                                                <th>Account Balance</th>
                                                <td>${customer.balance}</td>
                                            </tr>
                                            <tr>
                                                <th>Timestamp</th>
                                                <td>1611328452</td>
                                                <th>IP</th>
                                                <td>106.207.64.242</td>
                                            </tr>
                                            <tr>
                                                <th>Event</th>
                                                <td>Test Event</td>
                                                <th>Amount</th>
                                                <td>$100.00</td>
                                            </tr>
                                            <tr>
                                                <th>Deposit Log</th>
                                                <td>-</td>
                                                <th>Withdraw Log</th>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <th>Created</th>
                                                <td>{this.getDate(customer.createdAt)}</td>
                                                <th>Status</th>
                                                <td><span className="label label-lg label-success label-inline font-weight-lighter mr-2">Active</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer">
                                <Link to="/" className="btn btn-secondary">Cancel</Link>
                            </div>
                        </div>
                    }
                </div>
                <Modal show={showHistory} onHide={() => this.setState({ showHistory: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Win/loss History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Note</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.betHistory()}
                            </tbody>
                        </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setState({ showHistory: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={resetPassword} onHide={() => this.setState({ resetPassword: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reset Password</Modal.Title>
                    </Modal.Header>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={PasswordSchema}
                        onSubmit={this.changePassword}>
                        {
                            (formik) => {
                                return <form onSubmit={formik.handleSubmit}>
                                    <Modal.Body>
                                        <div className="form-group">
                                            <label>New Password<span className="text-danger">*</span></label>
                                            <input type="password" name="password" placeholder="Enter New Password"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "password"
                                                )}`}
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
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "confirmpassword"
                                                )}`}
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
                                        <Button variant="light-primary" onClick={() => this.setState({ resetPassword: false })}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                            Save
                                        </Button>
                                    </Modal.Footer>
                                </form>
                            }
                        }
                    </Formik>
                </Modal>

                <Modal show={isSuccess} onHide={() => this.setState({ isSuccess: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Password Changed</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => this.setState({ isSuccess: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={isError} onHide={() => this.setState({ isError: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Password Change Failed</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.setState({ isError: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, customers.actions)(CustomerDetail)