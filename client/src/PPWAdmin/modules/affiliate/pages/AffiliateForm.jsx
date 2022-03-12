import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import { createAffiliate, getAffiliate, updateAffiliate } from "../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import { Link } from "react-router-dom";
import { Preloader, ThreeDots } from 'react-preloader-icon';

class AffiliateForm extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params: { id } } } = props;
        this.state = {
            id: id,
            saving: false,
            loading: false,
            isError: false,
            isSuccess: false,
            initialValues: id ? null : {
                email: "",
                company: "",
                password: "",
                note: "",
                status: "active",
            },
            Schema: Yup.object().shape({
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required"),
                company: Yup.string().required("Company name is required"),
                password: id ? Yup.string() : Yup.string().required("Password is required"),
                note: Yup.string(),
                status: Yup.string(),
            })
        }
    }

    componentDidMount() {
        const { id } = this.state;
        if (id) {
            this.setState({ loading: true });
            getAffiliate(id)
                .then(({ data }) => {
                    this.setState({
                        loading: false,
                        initialValues: data ? {
                            email: data.email,
                            company: data.company,
                            note: data.note,
                            status: data.status,
                        } : null
                    });
                })
                .catch(error => {
                    this.setState({ loading: false, initialValues: null });
                })
        }
    }

    // Methods
    onSubmit = (values, formik) => {
        const { id } = this.state;
        const { history } = this.props;
        this.setState({ saving: true, isSuccess: false, isError: false });
        (id ? updateAffiliate(id, values) : createAffiliate(values)).then(({ data }) => {
            const { success } = data;
            formik.setSubmitting(false);
            this.setState({ saving: false, [success ? 'isSuccess' : 'isError']: true });
            if (success) {
                setTimeout(() => history.push('/'), 3000);
            }
        }).catch(() => {
            formik.setSubmitting(false);
            this.setState({ saving: false, isError: true });
        })
    };

    render() {
        const { initialValues, loading, Schema, saving, isError, isSuccess, id } = this.state;

        return (
            <div className="container">
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}
                {!loading && !initialValues && <center>
                    <h3>No Data Available.</h3>
                </center>}
                {initialValues && <Formik initialValues={initialValues}
                    validationSchema={Schema}
                    onSubmit={this.onSubmit}>
                    {(formik) => (
                        <form className="card card-custom card-stretch"
                            onSubmit={(e) => formik.handleSubmit(e)}>
                            {saving && <ModalProgressBar />}

                            {/* begin::Header */}
                            <div className="card-header py-3">
                                <div className="card-title align-items-start flex-column">
                                    <h3 className="card-label font-weight-bolder text-dark">
                                        Create Affiliate
                                    </h3>
                                </div>
                                <div className="card-toolbar">
                                    <Link to="/" className="btn btn-success">Back</Link>
                                </div>
                            </div>
                            {/* end::Header */}
                            {/* begin::Form */}
                            <div>
                                {/* begin::Body */}
                                <div className="card-body ml-10">
                                    {isError && (
                                        <div className="alert alert-custom alert-light-danger fade show mb-10"
                                            role="alert">
                                            <div className="alert-icon">
                                                <span className="svg-icon svg-icon-3x svg-icon-danger">
                                                    <SVG src={"/media/svg/icons/Code/Info-circle.svg"} />
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
                                                    aria-label="Close">
                                                    <span aria-hidden="true">
                                                        <i className="ki ki-close"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {isSuccess && (
                                        <div className="alert alert-custom alert-light-success fade show mb-10"
                                            role="alert">
                                            <div className="alert-icon">
                                                <span className="svg-icon svg-icon-3x svg-icon-success">
                                                    <SVG src={"/media/svg/icons/Code/Info-circle.svg"} />
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
                                                    aria-label="Close">
                                                    <span aria-hidden="true">
                                                        <i className="ki ki-close"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group row">
                                        <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                            Email
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <input
                                                type="text"
                                                placeholder="Email"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "email")}`}
                                                name="email"
                                                {...formik.getFieldProps("email")}
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <div className="invalid-feedback">{formik.errors.email}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                            Company Name
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <input
                                                type="text"
                                                placeholder="Company"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "company")}`}
                                                name="company"
                                                {...formik.getFieldProps("company")}
                                            />
                                            {formik.touched.company && formik.errors.company ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.company}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                            Password
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "password")}`}
                                                name="password"
                                                {...formik.getFieldProps("password")}
                                            />
                                            {formik.touched.password && formik.errors.password ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.password}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                            Note
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <textarea
                                                placeholder="Note"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "note")}`}
                                                name="note"
                                                {...formik.getFieldProps("note")}
                                            />
                                            {formik.touched.note && formik.errors.note ? (
                                                <div className="invalid-feedback">{formik.errors.note}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                            Status
                                        </label>
                                        <div className="col-lg-9 col-xl-6">
                                            <select
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "lastname")}`}
                                                name="status"
                                                {...formik.getFieldProps("status")}
                                            >
                                                <option value="active">Active</option>
                                                <option value={"inactive"}>Inactive</option>
                                            </select>
                                            {formik.touched.status && formik.errors.status ? (
                                                <div className="invalid-feedback">{formik.errors.status}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                {/* end::Body */}
                                <div className="card-footer float-left">
                                    <button
                                        type="submit"
                                        className="btn btn-success mr-2"
                                        disabled={formik.isSubmitting || (formik.touched && !formik.isValid)}>
                                        Save Changes
                                        {formik.isSubmitting}
                                    </button>
                                </div>
                            </div>
                            {/* end::Form */}
                        </form >
                    )}
                </Formik>}
            </div>
        )
    }
}

export default AffiliateForm;
