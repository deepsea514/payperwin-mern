import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getAddon, setAddon } from "../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class TheRundown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialValues: null,
            rundownSchema: Yup.object().shape({
                rundownApiHost: Yup.string()
                    .required("TheRundown Api Host is required"),
                rundownXRapidapiKey: Yup.string()
                    .required("TheRundown XRapid Api Key is required"),
                rundownXRapidapiHost: Yup.string()
                    .required("TheRundown XRapid Api Host is required"),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
        getAddon('rundown')
            .then(({ data }) => {
                if (data) {
                    this.setState({ initialValues: data.value, loading: false });
                } else {
                    this.setState({
                        initialValues: {
                            rundownApiHost: "",
                            rundownXRapidapiKey: "",
                            rundownXRapidapiHost: "",
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
        setAddon('rundown', values)
            .then(() => {
                this.setState({ isSuccess: true })
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ isError: true })
                formik.setSubmitting(false);
            })
    }

    render() {
        const { loading, initialValues, rundownSchema, isError, isSuccess } = this.state;
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between">
                    <h3>TheRundown</h3>
                    <img src="/images/therundown.png" style={{ display: 'block', height: '40px', width: 'auto' }} />
                </div>
                {loading && <center className="mt-5"><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} /></center>}
                {!loading && initialValues == null && <h1>No data available</h1>}
                {!loading && initialValues && <Formik
                    validationSchema={rundownSchema}
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
                                <label>The Rundown Api Host<span className="text-danger">*</span></label>
                                <input type="text" name="rundownApiHost" className={`form-control ${getInputClasses(formik, "rundownApiHost")}`}
                                    {...formik.getFieldProps("rundownApiHost")}
                                    placeholder="The Rundown Api Host" />
                                {formik.touched.rundownApiHost && formik.errors.rundownApiHost ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.rundownApiHost}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>The Rundown XRapid Api Key<span className="text-danger">*</span></label>
                                <input type="text" name="rundownXRapidapiKey" className={`form-control ${getInputClasses(formik, "rundownXRapidapiKey")}`}
                                    {...formik.getFieldProps("rundownXRapidapiKey")}
                                    placeholder="The Rundown XRapid Api Key" />
                                {formik.touched.rundownXRapidapiKey && formik.errors.rundownXRapidapiKey ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.rundownXRapidapiKey}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>The Rundown XRapid Api Host<span className="text-danger">*</span></label>
                                <input type="text" name="rundownXRapidapiHost" className={`form-control ${getInputClasses(formik, "rundownXRapidapiHost")}`}
                                    {...formik.getFieldProps("rundownXRapidapiHost")}
                                    placeholder="The Rundown XRapid Api Host" />
                                {formik.touched.rundownXRapidapiHost && formik.errors.rundownXRapidapiHost ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.rundownXRapidapiHost}
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