import React from "react"
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import { getMetaTagDetail, updateMetaTagDetail } from "../redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";

class EditMetaTags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meta_tag: null,
            loading: false,
            metaSchema: Yup.object().shape({
                title: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Title is required."),
                description: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .required("Subject is required."),
                keywords: Yup.string()
                    .required("Keywords are required."),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        const { match: { params: { title } } } = this.props;
        getMetaTagDetail(title)
            .then(({ data }) => {
                if (data) {
                    this.setState({ loading: false, meta_tag: data });
                } else {
                    this.setState({
                        loading: false,
                        meta_tag: {
                            title: '',
                            description: '',
                            keywords: ''
                        }
                    });
                }
            })
            .catch(() => {
                this.setState({ loading: false, meta_tag: null });
            });
    }

    onSubmit = (values, formik) => {
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        const { match: { params: { title } } } = this.props;
        updateMetaTagDetail(title, values)
            .then(() => {
                this.setState({ isSuccess: true });
            }).catch((error) => {
                this.setState({ isError: true });
            }).finally(() => {
                formik.setSubmitting(false)
            });
    }

    render() {
        const { meta_tag, loading, metaSchema, isError, isSuccess } = this.state;
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
                                <h3 className="card-label">Edit Meta Tags</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            {!loading && meta_tag == null && <h1>No data available</h1>}
                            {loading && <center className="mt-5"><Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} /></center>}
                            {!loading && meta_tag && <Formik
                                validationSchema={metaSchema}
                                initialValues={meta_tag}
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

                                        <div className="form-group">
                                            <label>Title<span className="text-danger">*</span></label>
                                            <input type="text" name="title"
                                                className={`form-control ${getInputClasses(formik, "title")}`}
                                                {...formik.getFieldProps("title")}
                                                placeholder="Meta Title" />
                                            {formik.touched.title && formik.errors.title ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.title}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Description<span className="text-danger">*</span></label>
                                            <textarea type="text" name="description"
                                                className={`form-control ${getInputClasses(formik, "description")}`}
                                                {...formik.getFieldProps("description")}
                                                rows={6}
                                                placeholder="Meta Description" />
                                            {formik.touched.description && formik.errors.description ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.description}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Keywords<span className="text-danger">*</span></label>
                                            <textarea type="text" name="keywords"
                                                className={`form-control ${getInputClasses(formik, "keywords")}`}
                                                {...formik.getFieldProps("keywords")}
                                                rows={6}
                                                placeholder="Meta keywords" />
                                            {formik.touched.keywords && formik.errors.keywords ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.keywords}
                                                </div>
                                            ) : null}
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

export default EditMetaTags;