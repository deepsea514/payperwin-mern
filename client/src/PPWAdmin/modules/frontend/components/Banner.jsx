import React, { Component } from 'react';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import { getFrontendInfo, saveFrontendInfo } from '../redux/services';
import { getInputClasses } from "../../../../helpers/getInputClasses";
import { Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import _env from '../../../../env.json';
const serverUrl = _env.appUrl;

export default class Banner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues: null,
            loading: false,
            bannerSchema: Yup.object().shape({
                file: Yup.mixed(),
                link_url: Yup.mixed().required(),
                show: Yup.mixed(),
            }),
            isError: false,
            isSuccess: false,
            image_url: null,
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        getFrontendInfo('banner')
            .then(({ data }) => {
                this.setState({
                    loading: false,
                    initialValues: data ?
                        { path: data.value.path, link_url: data.value.link_url, show: data.value.show, clicked: data.value.clicked } :
                        { path: '', link_url: '', show: false },
                    image_url: data.value.path ? `${serverUrl}/static/${data.value.path}` : null,
                });
            })
            .catch(() => {
                this.setState({ loading: false, initialValues: { file: null, link_url: '', show: true, clicked: 0 } });
            })
    }

    onSubmit = (values, formik) => {
        this.setState({ isSuccess: false, isError: false });
        let data = new FormData();
        values.file && data.append('file', values.file, values.file.name);
        data.append('path', values.path);
        data.append('link_url', values.link_url);
        data.append('show', values.show);
        data.append('clicked', values.clicked);
        saveFrontendInfo('banner', data)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    readImageFile = (file) => {
        var reader = new FileReader();
        const _this = this;
        reader.onload = function (e) {
            _this.setState({ image_url: e.target.result })
        }
        reader.readAsDataURL(file);
    }

    render() {
        const { initialValues, bannerSchema, loading, isError, isSuccess, image_url } = this.state;
        return (
            <>
                <h3>Banner.</h3>
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}
                {!loading && initialValues && <Formik
                    validationSchema={bannerSchema}
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
                            <div className='row'>
                                <div className="col-5">
                                    <div className="form-group">
                                        <label>Banner<span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            name="file"
                                            className={`form-control ${getInputClasses(formik, "file")}`}
                                            onChange={(evt) => {
                                                formik.setFieldTouched('file', true);
                                                formik.setFieldValue('file', evt.target.files[0]);
                                                this.readImageFile(evt.target.files[0]);
                                            }}
                                            accept="image/x-png,image/gif,image/jpeg"
                                        />
                                        {formik.touched.file && formik.errors.file ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.file}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Link URL<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="link_url"
                                            className={`form-control ${getInputClasses(formik, "link_url")}`}
                                            {...formik.getFieldProps('link_url')}
                                        />
                                        {formik.touched.link_url && formik.errors.link_url ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.link_url}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <FormControlLabel control={<Switch
                                            checked={formik.values.show == "true"}
                                            onChange={(evt) => {
                                                formik.setFieldTouched('show', true);
                                                formik.setFieldValue('show', evt.target.checked ? "true" : "false")
                                            }}
                                            value="show"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            disabled={formik.isSubmitting}
                                            name="show"
                                        />} label="Show Banner" />
                                    </div>
                                    <div className="form-row">
                                        <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Save</button>
                                    </div>
                                </div>
                                <div className='col-7'>
                                    <img src={image_url}
                                        style={{ width: 'auto', height: 'auto', display: 'block' }} />
                                </div>
                            </div>
                        </form>
                    }}
                </Formik>}
            </>
        )
    }
}