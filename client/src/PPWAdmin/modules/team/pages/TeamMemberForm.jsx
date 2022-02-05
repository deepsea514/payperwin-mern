import React, { createRef } from "react"
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import "react-datepicker/dist/react-datepicker.css";
import { createMember, getMember, updateMember } from "../redux/services";
import Resizer from "react-image-file-resizer";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import JoditEditor from "jodit-react";
import _env from '../../../../env.json';
const appUrl = _env.appUrl;

class TeamMemberForm extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params: { id } } } = props;
        this.state = {
            member_id: id ? id : null,
            loading: false,
            initialValues: id ? null : {
                photo: '',
                name: '',
                position: '',
                shortDescription: '',
                fullDescription: '',
                priority: '',
            },
            memberSchema: Yup.object().shape({
                photo: Yup.string()
                    .required("You should upload photo"),
                name: Yup.string()
                    .required("Name is required."),
                position: Yup.string()
                    .required("Position is required."),
                shortDescription: Yup.string()
                    .required("Short Description is required."),
                fullDescription: Yup.string()
                    .required("Full Description is required."),
                priority: Yup.number()
                    .required("Priority is required."),
            }),
            isError: false,
            isSuccess: false,
        }
        this.photoRef = createRef();
    }

    componentDidMount() {
        const { member_id } = this.state;
        if (member_id) {
            this.setState({ loading: true });
            getMember(member_id)
                .then(({ data }) => {
                    this.setState({
                        loading: false,
                        initialValues: {
                            photo: data.photo,
                            name: data.name,
                            position: data.position,
                            shortDescription: data.shortDescription,
                            fullDescription: data.fullDescription,
                            priority: data.priority,
                        }
                    })
                })
                .catch(() => {
                    this.setState({
                        loading: false,
                        initialValues: null
                    })
                })
        }
    }

    onSubmit = (values, formik) => {
        const { member_id: member_id } = this.state;
        if (member_id) {
            this.onUpdateMember(values, formik);
        } else {
            this.onCreateMember(values, formik);
        }
    }

    onCreateMember = (values, formik) => {
        const { history } = this.props;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        createMember(values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    history.push("/");
                }, 2000);
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    onUpdateMember = (values, formik) => {
        const { member_id: member_id } = this.state;
        const { history } = this.props;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        updateMember(member_id, values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    history.push("/");
                }, 2000);
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    clickUploadButton = () => {
        this.photoRef.current.click();
    }

    handleFileUpload = async (e, formik) => {
        const file = e.target.files[0];
        const image = await this.resizeFile(file);
        formik.setFieldValue('photo', image);
    }

    resizeFile = (file) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file, 600, 600, "png", 300, 0,
                (uri) => resolve(uri),
                "base64", 600, 600
            );
        });
    }

    render() {
        const {
            initialValues, memberSchema,
            isError, isSuccess,
            member_id: member_id, loading
        } = this.state;

        const config = {
            readonly: false,
            height: 350,
            enableDragAndDropFileToEditor: true,
            spellcheck: true,
            uploader: {
                insertImageAsBase64URI: true
            },
        };

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">{member_id ? 'Update an Article' : 'Create a New Article'}</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            {!loading && !initialValues && <center>
                                <h2>No Available data.</h2>
                            </center>}
                            {loading && <center>
                                <Preloader use={ThreeDots}
                                    size={100}
                                    strokeWidth={10}
                                    strokeColor="#F0AD4E"
                                    duration={800} />
                            </center>}
                            {initialValues && <Formik
                                validationSchema={memberSchema}
                                initialValues={initialValues}
                                onSubmit={this.onSubmit}>
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
                                                    Successfully Created.
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
                                                <button type="button" className="btn btn-success mr-2" onClick={this.clickUploadButton}>Upload Photo</button>
                                                <input ref={this.photoRef}
                                                    className={`form-control ${getInputClasses(formik, "photo")}`}
                                                    onChange={(e) => this.handleFileUpload(e, formik)} type="file"
                                                    style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" />
                                                {formik.touched.photo && formik.errors.photo ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.photo}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                {formik.values.photo && <img src={formik.values.photo.startsWith('data:image/') ?
                                                    formik.values.photo :
                                                    `${appUrl}${formik.values.photo}`}
                                                    style={{ width: '300px', height: 'auto', display: 'block' }} />}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Name<span className="text-danger">*</span></label>
                                                <input type="text" name="name"
                                                    className={`form-control ${getInputClasses(formik, "name")}`}
                                                    {...formik.getFieldProps("name")}
                                                    placeholder="Name" />
                                                {formik.touched.name && formik.errors.name ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.name}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>Position<span className="text-danger">*</span></label>
                                                <input type="text" name="position"
                                                    className={`form-control ${getInputClasses(formik, "position")}`}
                                                    {...formik.getFieldProps("position")}
                                                    placeholder="Position" />
                                                {formik.touched.position && formik.errors.position ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.position}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Short Description<span className="text-danger">*</span></label>
                                                <textarea type="text" name="shortDescription"
                                                    className={`form-control ${getInputClasses(formik, "shortDescription")}`}
                                                    rows={2}
                                                    {...formik.getFieldProps("shortDescription")}
                                                    placeholder="Short Description" />
                                                {formik.touched.shortDescription && formik.errors.shortDescription ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.shortDescription}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Full Description<span className="text-danger">*</span></label>
                                                <JoditEditor
                                                    config={config}
                                                    name="fullDescription"
                                                    tabIndex={1} // tabIndex of textarea
                                                    {...formik.getFieldProps("fullDescription")}
                                                    {...{
                                                        onChange: (fullDescription) => {
                                                            formik.setFieldError("fullDescription", false);
                                                            formik.setFieldTouched("fullDescription", true);
                                                            formik.setFieldValue("fullDescription", fullDescription);
                                                        },
                                                        onBlur: (fullDescription) => {
                                                            formik.setFieldError("fullDescription", false);
                                                            formik.setFieldTouched("fullDescription", true);
                                                            // formik.setFieldValue("fullDescription", fullDescription);
                                                        }
                                                    }}
                                                />
                                                {formik.touched.fullDescription && formik.errors.fullDescription ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.fullDescription}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Priority<span className="text-danger">*</span></label>
                                                <input type="number" name="priority"
                                                    className={`form-control ${getInputClasses(formik, "priority")}`}
                                                    {...formik.getFieldProps("priority")}
                                                    placeholder="Priority" />
                                                {formik.touched.priority && formik.errors.priority ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.priority}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Publish</button>
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

export default TeamMemberForm;