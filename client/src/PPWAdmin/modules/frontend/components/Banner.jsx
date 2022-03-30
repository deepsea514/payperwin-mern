import React, { Component } from 'react';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import { getFrontendInfo, saveFrontendInfo, searchSports } from '../redux/services';
import { getInputClasses } from "../../../../helpers/getInputClasses";
import { Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import { Form } from 'react-bootstrap';

export default class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues: null,
            loading: false,
            messageSchema: Yup.object().shape({
                message: Yup.string(),
                show: Yup.boolean(),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });

        getFrontendInfo('message')
            .then(({ data }) => {
                this.setState({
                    loading: false,
                    initialValues: data ?
                        { message: data.value.message, show: data.value.show } :
                        { message: '', show: false }
                });
            })
            .catch(() => {
                this.setState({ loading: false, initialValues: null });
            })
    }

    onSubmit = (values, formik) => {
        this.setState({ isSuccess: false, isError: false });
        saveFrontendInfo('message', values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    render() {
        const { initialValues, messageSchema, loading, isError, isSuccess, isSubmitting } = this.state;
        return (
            <>
                <h3>Message.</h3>
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}
                {!loading && !initialValues && <center>
                    <h4>No available Data.</h4>
                </center>}
                {!loading && initialValues && <Formik
                    validationSchema={messageSchema}
                    initialValues={initialValues}
                    onSubmit={this.onSubmit}>
                    {(formik) => {
                        return <form onSubmit={formik.handleSubmit}>
                            {isError && (
                                <div
                                    className="alert alert-custom alert-light-danger fade show mb-10"
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
                                            <span aria-hidden="true"><i className="ki ki-close" /></span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {isSuccess && (
                                <div
                                    className="alert alert-custom alert-light-success fade show mb-10"
                                    role="alert">
                                    <div className="alert-icon">
                                        <span className="svg-icon svg-icon-3x svg-icon-success">
                                            <SVG src={"/media/svg/icons/Code/Info-circle.svg"} />
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
                                            aria-label="Close">
                                            <span aria-hidden="true"><i className="ki ki-close" /></span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Message<span className="text-danger">*</span></label>
                                <textarea type="text" name="message"
                                    className={`form-control ${getInputClasses(formik, "message")}`}
                                    {...formik.getFieldProps("message")}
                                    placeholder="Please input message"
                                    rows={3} />
                                {formik.touched.message && formik.errors.message ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.message}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <FormControlLabel control={<Switch
                                    checked={formik.values.show ? formik.values.show : false}
                                    onChange={(evt) => {
                                        formik.setFieldTouched('show', true);
                                        formik.setFieldValue('show', evt.target.checked)
                                    }}
                                    value="show"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    disabled={formik.isSubmitting}
                                    name="show"
                                />} label="Show Message" />
                            </div>
                            <div className="form-row">
                                <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Save</button>
                            </div>
                        </form>
                    }}
                </Formik>}
            </>
        )
    }
}