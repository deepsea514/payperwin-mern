import React from "react"
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import JoditEditor from "jodit-react";
import { editMessageDraft, getMessageDraft } from "../redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import config from "../../../../../../config.json";
const CountryInfo = config.CountryInfo;

const years = _.range(1950, (new Date()).getFullYear() + 1, 1);
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

class EditMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: null,
            loading: false,
            messageSchema: Yup.object().shape({
                title: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Title is required."),
                type: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Type is required."),
                content: Yup.string()
                    .required("Content is required."),
                is_greater_balance: Yup.bool(),
                greater_balance: Yup.number(),
                is_last_online_before: Yup.bool(),
                last_online_before: Yup.date(),
                is_last_online_after: Yup.bool(),
                last_online_after: Yup.date(),
                is_wager_more: Yup.bool(),
                wager_more: Yup.number(),
                is_user_from: Yup.bool(),
                user_from: Yup.string(),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        const { match: { params: { id } } } = this.props;
        this.setState({ loading: true });
        getMessageDraft(id)
            .then(({ data: message }) => {
                this.setState({
                    loading: false,
                    initialValues: message ? {
                        title: message.title,
                        type: message.type,
                        content: message.content,
                        is_greater_balance: message.is_greater_balance,
                        greater_balance: message.greater_balance,
                        is_last_online_before: message.is_last_online_before,
                        last_online_before: message.last_online_before,
                        is_last_online_after: message.is_last_online_after,
                        last_online_after: message.last_online_after,
                        is_wager_more: message.is_wager_more,
                        wager_more: message.wager_more,
                        is_user_from: message.is_user_from,
                        user_from: message.user_from,
                    } : null
                });
            })
            .catch(() => {
                this.setState({ loading: false, initialValues: null })
            })
    }

    validateMessage = (values, formik) => {
        const { is_greater_balance, greater_balance,
            is_last_online_before, last_online_before,
            is_last_online_after, last_online_after,
            is_wager_more, wager_more,
            is_user_from, user_from, } = values;
        let valid = true;
        if (is_user_from && !user_from) {
            formik.setFieldError('user_from', "You should select a country");
            valid = false;
        }
        return valid;
    }

    onSubmit = (values, formik) => {
        const { match: { params: { id } }, history } = this.props;
        if (!this.validateMessage(values, formik)) {
            formik.setSubmitting(false);
            return;
        }
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        editMessageDraft(id, { ...values, publish: true })
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

    onSaveDraft = (values, formik) => {
        const { match: { params: { id } }, history } = this.props;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        editMessageDraft(id, { ...values, publish: false })
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

    render() {
        const { initialValues, messageSchema, isError, isSuccess, loading } = this.state;
        const config = {
            readonly: false,
            height: 350
        };
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Create a New Message</h3>
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
                            {!loading && initialValues && <Formik
                                validationSchema={messageSchema}
                                initialValues={initialValues}
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
                                                <label>Type<span className="text-danger">*</span></label>
                                                <select type="text" name="type"
                                                    className={`form-control ${getInputClasses(formik, "type")}`}
                                                    {...formik.getFieldProps("type")}>
                                                    <option value="internal">Internally</option>
                                                    <option value="mail">By Mail</option>
                                                </select>
                                                {formik.touched.type && formik.errors.type ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.type}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Content<span className="text-danger">*</span></label>
                                                <JoditEditor
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
                                        <h4>Send Message to:</h4>
                                        {/* <div className="form-row form-group">
                                            <div className="col-6">
                                                <input type="checkbox" id="is_last_online_before" name="is_last_online_before" {...formik.getFieldProps("is_last_online_before")} />
                                                <label htmlFor="is_last_online_before"> &nbsp;&nbsp;Users last online date is before </label>
                                                <CustomDatePicker
                                                    name="last_online_before"
                                                    className="form-control"
                                                    wrapperClassName="input-group"
                                                    selected={formik.values.last_online_before}
                                                    onChange={(val) => {
                                                        formik.setFieldError("last_online_before", false);
                                                        formik.setFieldTouched("last_online_before", true);
                                                        formik.setFieldValue("last_online_before", val);
                                                    }}
                                                    placeholder=""
                                                    isInvalid={formik.errors.last_online_before !== undefined}
                                                    required
                                                />
                                                {formik.touched.last_online_before && formik.errors.last_online_before ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.last_online_before}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col-6">
                                                <input type="checkbox" id="is_last_online_after" name="is_last_online_after" {...formik.getFieldProps("is_last_online_after")} />
                                                <label htmlFor="is_last_online_after"> &nbsp;&nbsp;Or Users last online date is after </label>
                                                <CustomDatePicker
                                                    name="last_online_after"
                                                    className="form-control"
                                                    wrapperClassName="input-group"
                                                    selected={formik.values.last_online_after}
                                                    onChange={(val) => {
                                                        formik.setFieldError("last_online_after", false);
                                                        formik.setFieldTouched("last_online_after", true);
                                                        formik.setFieldValue("last_online_after", val);
                                                    }}
                                                    placeholder=""
                                                    isInvalid={formik.errors.last_online_after !== undefined}
                                                    required
                                                />
                                                {formik.touched.last_online_after && formik.errors.last_online_after ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.last_online_after}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div> */}
                                        <div className="form-row form-group">
                                            <div className="col-6">
                                                <input type="checkbox" id="is_greater_balance" name="is_greater_balance" {...formik.getFieldProps("is_greater_balance")} />
                                                <label htmlFor="is_greater_balance"> &nbsp;&nbsp;Users with balance is greater than </label>
                                                <input type="text" name="greater_balance"
                                                    className={`form-control ${getInputClasses(formik, "greater_balance")}`}
                                                    type="text"
                                                    {...formik.getFieldProps("greater_balance")}
                                                    placeholder="" />
                                                {formik.touched.greater_balance && formik.errors.greater_balance ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.greater_balance}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col-6">
                                                <input type="checkbox" id="is_user_from" name="is_user_from" {...formik.getFieldProps("is_user_from")} />
                                                <label htmlFor="is_user_from"> &nbsp;&nbsp;Or Users from </label>
                                                <select name="title"
                                                    className={`form-control ${getInputClasses(formik, "user_from")}`}
                                                    {...formik.getFieldProps("user_from")}
                                                >
                                                    <option value=''>Select Country</option>
                                                    {CountryInfo.map(({ country }) => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </select>
                                                {formik.touched.user_from && formik.errors.user_from ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.user_from}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col-6">
                                                <input type="checkbox" id="is_wager_more" />
                                                <label htmlFor="is_wager_more"> &nbsp;&nbsp;Or Users who has wagered more than </label>
                                                <input type="text" name="wager_more"
                                                    className={`form-control ${getInputClasses(formik, "wager_more")}`}
                                                    {...formik.getFieldProps("wager_more")}
                                                    placeholder="" />
                                                {formik.touched.wager_more && formik.errors.wager_more ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.wager_more}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Publish</button>
                                            <button className="btn btn-success mr-2" disabled={formik.isSubmitting} onClick={() => this.onSaveDraft(formik.values, formik)}>Save as a Draft</button>
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

export default EditMessage;