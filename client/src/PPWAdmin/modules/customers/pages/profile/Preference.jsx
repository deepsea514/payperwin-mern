import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { RegionDropdown } from 'react-country-region-selector';
import { getCustomerPreference, updateCustomerPreference } from "../../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../../helpers/getInputClasses";
import { Preloader, ThreeDots } from 'react-preloader-icon';

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

    render() {
        const { initialValues, Schema, saving, isError, isSuccess, loading } = this.state;
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
                onSubmit={this.savePreference}
            >
                {
                    (formik) => (
                        <form
                            className="card card-custom card-stretch"
                            onSubmit={(e) => formik.handleSubmit(e)}
                        >
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
                                    <button
                                        type="submit"
                                        className="btn btn-success mr-2"
                                        disabled={
                                            formik.isSubmitting || (formik.touched && !formik.isValid)
                                        }
                                    >
                                        Save Changes
                                        {formik.isSubmitting}
                                    </button>
                                </div>
                            </div>
                            {/* end::Header */}
                            {/* begin::Form */}
                            <div>
                                {/* begin::Body */}
                                <div className="card-body ml-10">
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
                                                <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                                                <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                                                <option value="-10:00">(GMT -10:00) Hawaii</option>
                                                <option value="-09:50">(GMT -09:30) Taiohae</option>
                                                <option value="-09:00">(GMT -09:00) Alaska</option>
                                                <option value="-08:00">(GMT -08:00) Pacific Standard Time (US &amp; Canada)</option>
                                                <option value="-07:00">(GMT -07:00) Mountain Time (US &amp; Canada)</option>
                                                <option value="-06:00">(GMT -06:00) Central Time (US &amp; Canada), Mexico City</option>
                                                <option value="-05:00">(GMT -05:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                                <option value="-04:50">(GMT -04:30) Caracas</option>
                                                <option value="-04:00">(GMT -04:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                                <option value="-03:50">(GMT -03:30) Newfoundland</option>
                                                <option value="-03:00">(GMT -03:00) Brazil, Buenos Aires, Georgetown</option>
                                                <option value="-02:00">(GMT -02:00) Mid-Atlantic</option>
                                                <option value="-01:00">(GMT -01:00) Azores, Cape Verde Islands</option>
                                                <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                                                <option value="+01:00">(GMT +01:00) Brussels, Copenhagen, Madrid, Paris</option>
                                                <option value="+02:00">(GMT +02:00) Kaliningrad, South Africa</option>
                                                <option value="+03:00">(GMT +03:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                                                <option value="+03:50">(GMT +03:30) Tehran</option>
                                                <option value="+04:00">(GMT +04:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                                                <option value="+04:50">(GMT +04:30) Kabul</option>
                                                <option value="+05:00">(GMT +05:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                                                <option value="+05:50">(GMT +05:30) Bombay, Calcutta, Madras, New Delhi</option>
                                                <option value="+05:75">(GMT +05:45) Kathmandu, Pokhara</option>
                                                <option value="+06:00">(GMT +06:00) Almaty, Dhaka, Colombo</option>
                                                <option value="+06:50">(GMT +06:30) Yangon, Mandalay</option>
                                                <option value="+07:00">(GMT +07:00) Bangkok, Hanoi, Jakarta</option>
                                                <option value="+08:00">(GMT +08:00) Beijing, Perth, Singapore, Hong Kong</option>
                                                <option value="+08:75">(GMT +08:45) Eucla</option>
                                                <option value="+09:00">(GMT +09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                                                <option value="+09:50">(GMT +09:30) Adelaide, Darwin</option>
                                                <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                                                <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                                                <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                                                <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                                                <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                                                <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                                                <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                                                <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
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
                                {/* end::Body */}
                            </div>
                            {/* end::Form */}
                        </form >
                    )
                }

            </Formik>)
    }


}

export default Preference;
