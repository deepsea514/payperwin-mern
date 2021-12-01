import React from "react";
import { connect } from "react-redux";
import * as depositlog from "../redux/reducers";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { Formik } from "formik";
import AsyncSelect from 'react-select/async';
import { getReason, searchUsers } from "../../customers/redux/services";
import { addDeposit } from "../redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";

import config from "../../../../../../config.json";
const PaymentMethod = config.PaymentMethod.filter(method => method.toLowerCase().search('debit') == -1);
const FinancialStatus = config.FinancialStatus;

class AddDeposit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isSuccess: false,
            loadingUser: false,
            reasons: [],
            initialValues: {
                user: null,
                amount: 0,
                reason: '',
                method: "",
                status: '',
                sendEmail: false,
            },
            depositSchema: Yup.object().shape({
                user: Yup.object()
                    .nullable(),
                amount: Yup.number()
                    .min(1, "Amount shouldn't be 0.")
                    .required("Amount field is required."),
                reason: Yup.string(),
                method: Yup.string()
                    .required("Method field is required"),
                status: Yup.string()
                    .required("Status field is required."),
                sendEmail: Yup.bool().default(false),
            }),
        }
    }

    componentDidMount() {
        getReason().then(({ data }) => {
            this.setState({ reasons: data });
        })
    }

    onSubmit = (values, formik) => {
        const { history } = this.props;
        this.setState({ isSuccess: false, isError: false });
        if (!values.user) {
            formik.setFieldTouched('user', true);
            formik.setFieldError('user', "You should select user");
            formik.setSubmitting(false);
            return;
        }
        const deposit = {
            user: values.user.value,
            amount: values.amount,
            reason: values.reason,
            method: values.method,
            status: values.status
        };
        addDeposit(deposit).then(() => {
            this.setState({ isSuccess: true });
            setTimeout(() => {
                history.push('/');
            }, 3000);
        }).catch(() => {
            this.setState({ isError: true });
        }).finally(() => {
            formik.setSubmitting(false);
        })
    }

    renderMethods = () => {
        return PaymentMethod.map(method => <option key={method} value={method}>{method}</option>)
    }

    renderStatus = () => {
        return Object.keys(FinancialStatus).map(function (key, index) {
            return <option key={FinancialStatus[key]} value={FinancialStatus[key]}>{FinancialStatus[key]}</option>
        });
    }

    renderReasons() {
        const { reasons } = this.state;
        return reasons.map(reason => <option key={reason._id} value={reason._id}>{reason.title}</option>)
    }

    getOptions = (name, cb) => {
        this.setState({ loadingUser: true });
        searchUsers(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingUser: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingUser: false });
        })
    }

    render() {
        const { initialValues, depositSchema, isError, isSuccess, loadingUser } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <Formik
                        validationSchema={depositSchema}
                        initialValues={initialValues}
                        onSubmit={this.onSubmit}
                    >
                        {(formik) => {
                            return <form onSubmit={formik.handleSubmit}>
                                <div className="card card-custom gutter-b">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <h3 className="card-label">Add a Deposit</h3>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {isError && (
                                            <div
                                                className="alert alert-custom alert-light-danger fade show mb-10"
                                                role="alert"
                                            >
                                                <div className="alert-icon">
                                                    <span className="svg-icon svg-icon-3x svg-icon-danger">
                                                        <SVG
                                                            src={"/media/svg/icons/Code/Info-circle.svg"}
                                                        ></SVG>{" "}
                                                    </span>
                                                </div>
                                                <div className="alert-text font-weight-bold">
                                                    Addition Failed
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ isError: false })}>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="alert"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">
                                                            <i className="ki ki-close"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {isSuccess && (
                                            <div
                                                className="alert alert-custom alert-light-success fade show mb-10"
                                                role="alert"
                                            >
                                                <div className="alert-icon">
                                                    <span className="svg-icon svg-icon-3x svg-icon-success">
                                                        <SVG
                                                            src={"/media/svg/icons/Code/Info-circle.svg"}
                                                        ></SVG>{" "}
                                                    </span>
                                                </div>
                                                <div className="alert-text font-weight-bold">
                                                    Successfully Added.
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ isSuccess: false })}>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="alert"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">
                                                            <i className="ki ki-close"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label>User<span className="text-danger">*</span></label>
                                            <AsyncSelect
                                                className={`basic-single ${getInputClasses(formik, "user")}`}
                                                classNamePrefix="select"
                                                // isClearable={true}
                                                isSearchable={true}
                                                name="user"
                                                loadOptions={this.getOptions}
                                                noOptionsMessage={() => "No Users"}
                                                value={formik.values.user}
                                                isLoading={loadingUser}
                                                {...formik.getFieldProps("user")}
                                                {...{
                                                    onChange: (user) => {
                                                        if (!user) return;
                                                        formik.setFieldError("user", false);
                                                        formik.setFieldTouched("user", true);
                                                        formik.setFieldValue("user", user);
                                                    },

                                                }}
                                            />
                                            {formik.touched.user && formik.errors.user ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.user}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Amount<span className="text-danger">*</span></label>
                                            <input name="amount" placeholder="Enter Amount"
                                                className={`form-control ${getInputClasses(formik, "amount")}`}
                                                {...formik.getFieldProps("amount")}
                                            />
                                            {formik.touched.amount && formik.errors.amount ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.amount}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Reason<span className="text-danger">*</span></label>
                                            <select name="reason" placeholder="Choose Reason"
                                                className={`form-control ${getInputClasses(formik, "reason")}`}
                                                {...formik.getFieldProps("reason")}
                                            >
                                                <option value="">Choose reason ...</option>
                                                {this.renderReasons()}
                                            </select>
                                            {formik.touched.reason && formik.errors.reason ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.reason}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Method<span className="text-danger">*</span></label>
                                            <select name="method" placeholder="Choose payment method"
                                                className={`form-control ${getInputClasses(formik, "method")}`}
                                                {...formik.getFieldProps("method")}
                                            >
                                                <option value="">Choose method ...</option>
                                                {this.renderMethods()}
                                            </select>
                                            {formik.touched.method && formik.errors.method ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.method}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Status<span className="text-danger">*</span></label>
                                            <select name="status" placeholder="Choose status"
                                                className={`form-control ${getInputClasses(formik, "status")}`}
                                                {...formik.getFieldProps("status")}
                                            >
                                                <option value="">Choose status ...</option>
                                                {this.renderStatus()}
                                            </select>
                                            {formik.touched.status && formik.errors.status ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.status}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <input type="checkbox"
                                                id="sendEmail"
                                                name="sendEmail"
                                                {...formik.getFieldProps("sendEmail")} />
                                            <label htmlFor="sendEmail"> &nbsp;&nbsp;Send Notification Email</label>
                                            {formik.touched.sendEmail && formik.errors.sendEmail ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.sendEmail}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Submit</button>
                                        <Link to="/" className="btn btn-secondary">Cancel</Link>
                                    </div>
                                </div>
                            </form>
                        }}
                    </Formik>
                </div>
            </div>
        );
    }
}

export default connect(null, depositlog.actions)(AddDeposit)