import React from "react"
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import JoditEditor from "jodit-react";
import { createEmailTemplate } from "../redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";

class CreateEmailTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: {
                title: '',
                subject: '',
                content: '',
            },
            loading: false,
            emailSchema: Yup.object().shape({
                title: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Title is required."),
                subject: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Subject is required."),
                content: Yup.string()
                    .required("Content is required."),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
    }

    onSubmit = (values, formik) => {
        const { history } = this.props;
        this.setState({ isSuccess: false, isError: false });
        createEmailTemplate(values)
            .then(() => {
                this.setState({ isSuccess: true });
                history.push("/");
            }).catch((error) => {
                this.setState({ isError: true });
            }).finally(() => {
                formik.setSubmitting(false)
            });
    }

    render() {
        const { email, loading, emailSchema, isError, isSuccess } = this.state;
        const config = {
            readonly: false,
            height: 200
        };
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Add Email Template</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            {!loading && email == null && <h1>No data available</h1>}
                            {loading && <center className="mt-5"><Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} /></center>}
                            {!loading && email && <Formik
                                validationSchema={emailSchema}
                                initialValues={email}
                                onSubmit={this.onSubmit}
                            >
                                {(formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
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

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Title<span className="text-danger">*</span></label>
                                                <input type="text" name="title"
                                                    className={`form-control ${getInputClasses(formik, "title")}`}
                                                    {...formik.getFieldProps("title")}
                                                    placeholder="Title" />
                                                {formik.touched.title && formik.errors.title ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.title}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>Subject<span className="text-danger">*</span></label>
                                                <input type="text" name="subject"
                                                    className={`form-control ${getInputClasses(formik, "subject")}`}
                                                    {...formik.getFieldProps("subject")}
                                                    placeholder="Subject" />
                                                {formik.touched.subject && formik.errors.subject ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.subject}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Content<span className="text-danger">*</span></label>
                                                <JoditEditor
                                                    // ref={editor}
                                                    config={config}
                                                    name="content"
                                                    tabIndex={1} // tabIndex of textarea
                                                    {...formik.getFieldProps("content")}
                                                    {...{
                                                        onChange: (content) => {
                                                            formik.setFieldError("content", false);
                                                            formik.setFieldTouched("content", true);
                                                            formik.setFieldValue("content", content);
                                                        },
                                                        onBlur: (content) => {
                                                            formik.setFieldError("content", false);
                                                            formik.setFieldTouched("content", true);
                                                            // formik.setFieldValue("content", content);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Submit</button>
                                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                                        </div>
                                    </form>
                                }}
                            </Formik>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateEmailTemplate;