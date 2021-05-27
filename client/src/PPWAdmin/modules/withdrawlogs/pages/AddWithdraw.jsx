import React from "react";
import { connect } from "react-redux";
import * as withdrawlog from "../redux/reducers";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { Formik } from "formik";
import AsyncSelect from 'react-select/async'
import { searchUsers } from "../../customers/redux/services";
import { addWithdraw } from "../redux/services";

const config = require("../../../../../../config.json");
const PaymentMethod = config.PaymentMethod;
const FinancialStatus = config.FinancialStatus;

class AddWithdraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isSuccess: false,
            loadingUser: false,
            initialvalues: {
                user: null,
                amount: 0,
                method: "",
                status: '',
                _2fa_code: '',
            },
            withdrawSchema: Yup.object().shape({
                user: Yup.object()
                    .nullable(),
                amount: Yup.number()
                    .min(1, "Amount shouldn't be 0.")
                    // .max(withdrawmax, `Amount shouldn't be bigger than ${withdrawmax}.`)
                    .required("Amount field is required."),
                method: Yup.string()
                    .required("Method field is required"),
                status: Yup.string()
                    .required("Status field is required."),
                _2fa_code: Yup.string()
                    .required("2FA code field is required")
            }),
        }
    }

    componentDidMount() {

    }

    onSubmit = (values, formik) => {
        this.setState({ isSuccess: false, isError: false });
        if (!values.user) {
            formik.setFieldTouched('user', true);
            formik.setFieldError('user', "You should select user");
            formik.setSubmitting(false);
            return;
        }
        if (values.amount > values.user.balance) {
            formik.setFieldTouched('amount', true);
            formik.setFieldError('amount', `The balance of this user is ${values.user.balance}.`);
            formik.setSubmitting(false);
            return;
        }
        const withdraw = {
            user: values.user.value,
            amount: values.amount,
            method: values.method,
            status: values.status,
            _2fa_code: values._2fa_code,
        };
        addWithdraw(withdraw).then(() => {
            this.setState({ isSuccess: true });
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

    renderMethods = () => {
        return PaymentMethod.map(method => <option key={method} value={method}>{method}</option>)
    }

    renderStatus = () => {
        return Object.keys(FinancialStatus).map(function (key, index) {
            return <option key={FinancialStatus[key]} value={FinancialStatus[key]}>{FinancialStatus[key]}</option>
        });
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
        const { initialvalues, withdrawSchema, isError, isSuccess, loadingUser } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <Formik
                        validationSchema={withdrawSchema}
                        initialValues={initialvalues}
                        onSubmit={this.onSubmit}
                    >
                        {(formik) => {
                            return <form onSubmit={formik.handleSubmit}>
                                <div className="card card-custom gutter-b">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <h3 className="card-label">Add a withdraw</h3>
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
                                                className={`basic-single ${this.getInputClasses(
                                                    formik,
                                                    "user"
                                                )}`}
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
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "amount"
                                                )}`}
                                                {...formik.getFieldProps("amount")}
                                            />
                                            {formik.touched.amount && formik.errors.amount ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.amount}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Method<span className="text-danger">*</span></label>
                                            <select name="method" placeholder="Choose payment method"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "method"
                                                )}`}
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
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "status"
                                                )}`}
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
                                            <label>2FA Code<span className="text-danger">*</span></label>
                                            <input name="_2fa_code" placeholder="Enter 2FA Code"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "_2fa_code"
                                                )}`}
                                                {...formik.getFieldProps("_2fa_code")}
                                            />
                                            {formik.touched._2fa_code && formik.errors._2fa_code ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors._2fa_code}
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

export default connect(null, withdrawlog.actions)(AddWithdraw)