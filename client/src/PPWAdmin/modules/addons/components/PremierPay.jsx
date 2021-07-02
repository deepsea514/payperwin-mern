import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getAddon, setAddon } from "../redux/services";
import SVG from "react-inlinesvg";

export default class PremierPay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialValues: null,
            premierSchema: Yup.object().shape({
                paymenturl: Yup.string()
                    .required("Payment Url is required"),
                payouturl: Yup.string()
                    .required("Payout Url is required"),
                sid: Yup.string()
                    .required("SID is required"),
                rcode: Yup.string()
                    .required("R Code is required"),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
        getAddon('pinnacle')
            .then(({ data }) => {
                if (data) {
                    this.setState({ initialValues: data.value, loading: false });
                } else {
                    this.setState({
                        initialValues: {
                            paymenturl: "",
                            payouturl: "",
                            sid: "",
                            rcode: ""
                        }, loading: false
                    });
                }
            })
            .catch(() => {
                this.setState({ initialValues: null, loading: false });
            })
    }

    onSubmit = (values, formik) => {
        this.setState({ isError: false, isError: false, });
        setAddon('pinnacle', values)
            .then(() => {
                this.setState({ isSuccess: true })
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ isError: true })
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
        const { loading, initialValues, premierSchema, isError, isSuccess } = this.state;
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between">
                    <h3>PremierPay</h3>
                    <img src="/images/premier.png" style={{ display: 'block', height: '40px', width: 'auto' }} />
                </div>
                {loading && <center className="mt-5"><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} /></center>}
                {!loading && initialValues == null && <h1>No data available</h1>}
                {!loading && initialValues && <Formik
                    validationSchema={premierSchema}
                    initialValues={initialValues}
                    onSubmit={this.onSubmit}
                >
                    {(formik) => {
                        return <form onSubmit={formik.handleSubmit} className="p-3">
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
                                        Update Failed
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
                                        Successfully Updated.
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
                                <label>Payment Url<span className="text-danger">*</span></label>
                                <input type="text" name="paymenturl" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "paymenturl"
                                )}`}
                                    {...formik.getFieldProps("paymenturl")}
                                    placeholder="Payment Url" />
                                {formik.touched.paymenturl && formik.errors.paymenturl ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.paymenturl}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Payout Url<span className="text-danger">*</span></label>
                                <input type="text" name="payouturl" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "payouturl"
                                )}`}
                                    {...formik.getFieldProps("payouturl")}
                                    placeholder="Payout Url" />
                                {formik.touched.payouturl && formik.errors.payouturl ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.payouturl}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>SID<span className="text-danger">*</span></label>
                                <input type="text" name="sid" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "sid"
                                )}`}
                                    {...formik.getFieldProps("sid")}
                                    placeholder="SID" />
                                {formik.touched.sid && formik.errors.sid ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.sid}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>R Code<span className="text-danger">*</span></label>
                                <input type="text" name="rcode" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "rcode"
                                )}`}
                                    {...formik.getFieldProps("rcode")}
                                    placeholder="R Code" />
                                {formik.touched.rcode && formik.errors.rcode ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.rcode}
                                    </div>
                                ) : null}
                            </div>

                            <div className="form-row">
                                <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Submit</button>
                            </div>
                        </form>
                    }}
                </Formik>}
            </div>
        )
    }
}