import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getAddon, setAddon } from "../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class TicketEvolution extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialValues: null,
            ticektSchema: Yup.object().shape({
                api_token: Yup.string()
                    .required("Api Token is required"),
                api_secret: Yup.string()
                    .required("Api Secret is required"),
                brokerage_id: Yup.string()
                    .required("Brokerage Id is required"),
                office_id: Yup.string()
                    .required("Office Id is required")
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
        getAddon('ticketevolution')
            .then(({ data }) => {
                if (data) {
                    this.setState({ initialValues: data.value, loading: false });
                } else {
                    this.setState({
                        initialValues: {
                            api_token: "",
                            api_secret: "",
                            brokerage_id: brokerage_id,
                            office_id: ""
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
        setAddon('ticketevolution', values)
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
        const { loading, initialValues, ticektSchema, isError, isSuccess } = this.state;
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between">
                    <h3>Ticket Evolution</h3>
                    <img src="/images/third-party/ticket-evolution.png" style={{ display: 'block', height: '40px', width: 'auto' }} />
                </div>
                {loading && <center className="mt-5"><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} /></center>}
                {!loading && initialValues == null && <h1>No data available</h1>}
                {!loading && initialValues && <Formik
                    validationSchema={ticektSchema}
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
                                <label>Api Token<span className="text-danger">*</span></label>
                                <input type="text" name="api_token" className={`form-control ${getInputClasses(formik, "api_token")}`}
                                    {...formik.getFieldProps("api_token")}
                                    placeholder="Ticket Evo Api Token" />
                                {formik.touched.api_token && formik.errors.api_token ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.api_token}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Api Secret<span className="text-danger">*</span></label>
                                <input type="text" name="api_secret" className={`form-control ${getInputClasses(formik, "api_secret")}`}
                                    {...formik.getFieldProps("api_secret")}
                                    placeholder="Ticket Evo Api Secret" />
                                {formik.touched.api_secret && formik.errors.api_secret ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.api_secret}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Brokerage Id<span className="text-danger">*</span></label>
                                <input type="text" name="brokerage_id" className={`form-control ${getInputClasses(formik, "brokerage_id")}`}
                                    {...formik.getFieldProps("brokerage_id")}
                                    placeholder="Brokerage Id" />
                                {formik.touched.brokerage_id && formik.errors.brokerage_id ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.brokerage_id}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Office Id<span className="text-danger">*</span></label>
                                <input type="text" name="office_id" className={`form-control ${getInputClasses(formik, "office_id")}`}
                                    {...formik.getFieldProps("office_id")}
                                    placeholder="Office Id" />
                                {formik.touched.office_id && formik.errors.office_id ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.office_id}
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