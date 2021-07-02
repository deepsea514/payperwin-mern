import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getAddon, setAddon } from "../redux/services";
import SVG from "react-inlinesvg";

export default class PinnacleSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialValues: null,
            pinnacleSandboxSchema: Yup.object().shape({
                sandboxUrl: Yup.string()
                    .required("Sandbox Url is required"),
                agentCode: Yup.string()
                    .required("Agent Code is required"),
                agentKey: Yup.string()
                    .required("Agent Key is required"),
                secretKey: Yup.string()
                    .required("Secret Key is required"),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
        getAddon('pinnacle sandbox')
            .then(({ data }) => {
                if (data) {
                    this.setState({ initialValues: data.value, loading: false });
                } else {
                    this.setState({
                        initialValues: {
                            sandboxUrl: "",
                            agentCode: "",
                            agentKey: "",
                            secretKey: "",
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
        setAddon('pinnacle sandbox', values)
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
        const { loading, initialValues, pinnacleSandboxSchema, isError, isSuccess } = this.state;
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between">
                    <h3>Pinnacle Sandbox</h3>
                    <img src="/images/pinnacle sandbox.png" style={{ display: 'block', height: '40px', width: 'auto' }} />
                </div>
                {loading && <center className="mt-5"><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} /></center>}
                {!loading && initialValues == null && <h1>No data available</h1>}
                {!loading && initialValues && <Formik
                    validationSchema={pinnacleSandboxSchema}
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
                                <label>Pinnacle Sandbox Url<span className="text-danger">*</span></label>
                                <input type="text" name="sandboxUrl" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "sandboxUrl"
                                )}`}
                                    {...formik.getFieldProps("sandboxUrl")}
                                    placeholder="Pinnacle Api Host" />
                                {formik.touched.sandboxUrl && formik.errors.sandboxUrl ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.sandboxUrl}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Agent Code<span className="text-danger">*</span></label>
                                <input type="text" name="agentCode" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "agentCode"
                                )}`}
                                    {...formik.getFieldProps("agentCode")}
                                    placeholder="Agent Code" />
                                {formik.touched.agentCode && formik.errors.agentCode ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.agentCode}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Agent Key<span className="text-danger">*</span></label>
                                <input type="text" name="agentKey" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "agentKey"
                                )}`}
                                    {...formik.getFieldProps("agentKey")}
                                    placeholder="Agent Key" />
                                {formik.touched.agentKey && formik.errors.agentKey ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.agentKey}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Secret Key<span className="text-danger">*</span></label>
                                <input type="text" name="secretKey" className={`form-control ${this.getInputClasses(
                                    formik,
                                    "secretKey"
                                )}`}
                                    {...formik.getFieldProps("secretKey")}
                                    placeholder="Secret Key" />
                                {formik.touched.secretKey && formik.errors.secretKey ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.secretKey}
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