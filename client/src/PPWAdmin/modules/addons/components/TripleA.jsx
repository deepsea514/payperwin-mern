import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getAddon, setAddon } from "../redux/services";
import SVG from "react-inlinesvg";
import { FormControl, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";

export default class TripleA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialValues: null,
            tripleASchema: Yup.object().shape({
                tokenurl: Yup.string()
                    .required("Token Url is required"),
                paymenturl: Yup.string()
                    .required("Payment Url is required"),
                payouturl: Yup.string()
                    .required("Payout Url is required"),
                client_id: Yup.string()
                    .required("Client ID is required"),
                client_secret: Yup.string()
                    .required("Client Secret is required"),
                notify_secret: Yup.string()
                    .required("Notify Secret is required"),
                btc_api_id: Yup.string()
                    .required("BTC Api ID is required"),
                test_btc_api_id: Yup.string()
                    .required("TestBTC Api ID is required"),
                eth_api_id: Yup.string()
                    .required("ETH Api ID is required"),
                usdt_api_id: Yup.string()
                    .required("USDT Api ID is required"),
                merchant_key: Yup.string()
                    .required("Merchant Key is required"),
                testMode: Yup.bool()
                    .required("Test Mode is required"),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
        getAddon('tripleA')
            .then(({ data }) => {
                if (data) {
                    this.setState({
                        initialValues: {
                            ...data.value,
                            testMode: data.value.testMode ? 'true' : 'false'
                        }, loading: false
                    });
                } else {
                    this.setState({
                        initialValues: {
                            tokenurl: "",
                            paymenturl: "",
                            payouturl: "",
                            client_id: "",
                            client_secret: "",
                            notify_secret: "",
                            btc_api_id: "",
                            test_btc_api_id: "",
                            eth_api_id: "",
                            usdt_api_id: "",
                            merchant_key: "",
                            testMode: ""
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
        setAddon('tripleA', {
            ...values,
            testMode: values.testMode == 'true' ? true : false
        })
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
        const { loading, initialValues, tripleASchema, isError, isSuccess } = this.state;
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between">
                    <h3>TripleA</h3>
                    <img src="/images/tripleA.png" style={{ display: 'block', height: '40px', width: 'auto' }} />
                </div>
                {loading && <center className="mt-5"><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} /></center>}
                {!loading && initialValues == null && <h1>No data available</h1>}
                {!loading && initialValues && <Formik
                    validationSchema={tripleASchema}
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
                                <label>Token Url<span className="text-danger">*</span></label>
                                <input type="text" name="tokenurl" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "tokenurl"
                                )}`}
                                    {...formik.getFieldProps("tokenurl")}
                                    placeholder="Token Url" />
                                {formik.touched.tokenurl && formik.errors.tokenurl ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.tokenurl}
                                    </div>
                                ) : null}
                            </div>
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
                                <label>Client ID<span className="text-danger">*</span></label>
                                <input type="text" name="client_id" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "client_id"
                                )}`}
                                    {...formik.getFieldProps("client_id")}
                                    placeholder="Client ID" />
                                {formik.touched.client_id && formik.errors.client_id ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.client_id}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Client Secret<span className="text-danger">*</span></label>
                                <input type="text" name="client_secret" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "client_secret"
                                )}`}
                                    {...formik.getFieldProps("client_secret")}
                                    placeholder="Client Secret" />
                                {formik.touched.client_secret && formik.errors.client_secret ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.client_secret}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Notify Secret<span className="text-danger">*</span></label>
                                <input type="text" name="notify_secret" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "notify_secret"
                                )}`}
                                    {...formik.getFieldProps("notify_secret")}
                                    placeholder="Notify Secret" />
                                {formik.touched.notify_secret && formik.errors.notify_secret ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.notify_secret}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>BTC Api ID<span className="text-danger">*</span></label>
                                <input type="text" name="btc_api_id" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "btc_api_id"
                                )}`}
                                    {...formik.getFieldProps("btc_api_id")}
                                    placeholder="BTC Api ID" />
                                {formik.touched.btc_api_id && formik.errors.btc_api_id ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.btc_api_id}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>TestBTC Api ID<span className="text-danger">*</span></label>
                                <input type="text" name="test_btc_api_id" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "test_btc_api_id"
                                )}`}
                                    {...formik.getFieldProps("test_btc_api_id")}
                                    placeholder="TestBTC Api ID" />
                                {formik.touched.test_btc_api_id && formik.errors.test_btc_api_id ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.test_btc_api_id}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>ETH Api ID<span className="text-danger">*</span></label>
                                <input type="text" name="eth_api_id" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "eth_api_id"
                                )}`}
                                    {...formik.getFieldProps("eth_api_id")}
                                    placeholder="ETH Api ID" />
                                {formik.touched.eth_api_id && formik.errors.eth_api_id ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.eth_api_id}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>USDT Api ID<span className="text-danger">*</span></label>
                                <input type="text" name="usdt_api_id" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "usdt_api_id"
                                )}`}
                                    {...formik.getFieldProps("usdt_api_id")}
                                    placeholder="USDT Api ID" />
                                {formik.touched.usdt_api_id && formik.errors.usdt_api_id ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.usdt_api_id}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Merchant Key<span className="text-danger">*</span></label>
                                <input type="text" name="merchant_key" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "merchant_key"
                                )}`}
                                    {...formik.getFieldProps("merchant_key")}
                                    placeholder="Merchant Key" />
                                {formik.touched.merchant_key && formik.errors.merchant_key ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.merchant_key}
                                    </div>
                                ) : null}
                            </div>
                            <FormControl component="fieldset">
                            <label>Test Mode<span className="text-danger">*</span></label>
                                <RadioGroup aria-label="Test Mode" name="testMode" {...formik.getFieldProps("testMode")}>
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>

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