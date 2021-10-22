import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { getCustomerPreference, updateCustomerPreference } from "../../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../../helpers/getInputClasses";
import timeHelper from "../../../../../helpers/timehelper";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import config from '../../../../../../../config.json';
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";
const TimeZones = config.TimeZones;
const isDstObserved = config.isDstObserved;

class Preference extends React.Component {
    constructor(props) {
        super(props);
        const { customer } = props;
        this.state = {
            id: customer._id,
            saving: false,
            isError: false,
            isSuccess: false,
            initialValues: null,
            loading: false,
            Schema: Yup.object().shape({
                oddsFormat: Yup.string()
                    .required("You shuld select Odds Format."),
                timezone: Yup.string()
                    .required("You shuld select Timezone."),
                dateFormat: Yup.string()
                    .required("You shuld select Date Format."),
                lang: Yup.string()
                    .required("You shuld select Language."),
            })
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getCustomerPreference(id)
            .then(({ data }) => {
                this.setState({
                    loading: false, initialValues: {
                        oddsFormat: data && data.oddsFormat ? data.oddsFormat : 'american',
                        lang: data && data.lang ? data.lang : 'en',
                        dateFormat: data && data.dateFormat ? data.dateFormat : 'DD-MM-YYYY',
                        timezone: data && data.timezone ? data.timezone : '+00:00',
                    }
                });
            })
            .catch(() => {
                this.setState({ loading: false, initialValues: null });
            })
    }

    savePreference = (values, formik) => {
        this.setState({ saving: true, isSuccess: false, isError: false });
        const { id } = this.state;
        updateCustomerPreference(id, values).then(() => {
            formik.setSubmitting(false);
            this.setState({ saving: false, isSuccess: true });
        }).catch(() => {
            formik.setSubmitting(false);
            this.setState({ saving: false, isError: true });
        })
    };

    getTimeZoneOptions = () => {
        return TimeZones.map(timezone => {
            if (isDstObserved && timezone.dst) {
                return <option key={timezone.value} value={timezone.value}>GMT ({timeHelper.getDSTTimeOffset(timezone.time)}) {timezone.name}</option>
            }
            return <option key={timezone.value} value={timezone.value}>GMT ({timezone.time}) {timezone.name}</option>
        });
    }

    render() {
        const { initialValues, Schema, saving, isError, isSuccess, loading, id } = this.state;
        if (loading)
            return <center><Preloader use={ThreeDots}
                size={100}
                strokeWidth={10}
                strokeColor="#F0AD4E"
                duration={800} /></center>
        if (!initialValues)
            return <h3>No data available.</h3>
        return (
            <Formik
                initialValues={initialValues}
                validationSchema={Schema}
                onSubmit={this.savePreference}>
                {(formik) => (
                    <form
                        className="card card-custom card-stretch"
                        onSubmit={(e) => formik.handleSubmit(e)}>
                        {saving && <ModalProgressBar />}

                        {/* begin::Header */}
                        <div className="card-header py-3">
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">
                                    Preference
                                </h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Update Customer Preference
                                </span>
                            </div>
                            <div className="card-toolbar">
                                <Dropdown className="dropdown-inline" drop="down" alignRight>
                                    <Dropdown.Toggle
                                        id="dropdown-toggle-top2"
                                        variant="transparent"
                                        className="btn btn-light-primary btn-sm font-weight-bolder dropdown-toggle">
                                        View:
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                        <DropdownMenuCustomer id={id} />
                                    </Dropdown.Menu>
                                </Dropdown>
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
                                        Odds display format
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <select
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "oddsFormat")}`}
                                            name="oddsFormat"
                                            readOnly
                                            {...formik.getFieldProps("oddsFormat")}
                                        >
                                            <option value="american"> American Odds</option>
                                            <option value="decimal"> Decimal Odds</option>
                                        </select>
                                        {formik.touched.oddsFormat && formik.errors.oddsFormat ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.oddsFormat}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Default Date format
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <select
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "dateFormat")}`}
                                            name="dateFormat"
                                            {...formik.getFieldProps("dateFormat")}
                                        >
                                            <option value="DD-MM-YYYY"> DD-MM-YYYY</option>
                                        </select>
                                        {formik.touched.dateFormat && formik.errors.dateFormat ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.dateFormat}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Default time zone
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <select
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "timezone")}`}
                                            name="timezone"
                                            {...formik.getFieldProps("timezone")}
                                        >
                                            <option value="">...Select Timezone</option>
                                            {this.getTimeZoneOptions()}
                                        </select>
                                        {formik.touched.timezone && formik.errors.timezone ? (
                                            <div className="invalid-feedback">{formik.errors.timezone}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Language
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <select
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "lang")}`}
                                            name="lang"
                                            {...formik.getFieldProps("lang")}
                                        >
                                            <option value="en"> English</option>
                                        </select>
                                        {formik.touched.lang && formik.errors.lang ? (
                                            <div className="invalid-feedback">{formik.errors.lang}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
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
                    </form >
                )}
            </Formik>
        )
    }
}

export default Preference;
