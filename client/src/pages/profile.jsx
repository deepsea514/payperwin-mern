import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import * as Yup from "yup";
import { Formik } from "formik";
import { RegionDropdown } from 'react-country-region-selector';
import SVG from "react-inlinesvg";
import { Button, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getInputClasses } from "../helpers/getInputClasses";
import CustomDatePicker from '../components/customDatePicker';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getProfile, postProfile } from '../redux/services';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            profileData: null,
            isSuccess: false,
            isError: false,
            profileSchema: Yup.object().shape({
                username: Yup.string()
                    .required("Username is required"),
                title: Yup.string()
                    .required("Title is required"),
                firstname: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("First Name is required."),
                lastname: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Last Name is required."),
                dateofbirth: Yup.date()
                    .required("Birthday is required"),
                country: Yup.string()
                    .min(1, "Country is required.")
                    .required("Country is required."),
                address: Yup.string()
                    .min(1, "Address is required.")
                    .required("Address is required."),
                region: Yup.string()
                    .required("Province is required."),
                phone: Yup.string()
                    .min(7, "Minimum 7 symbols")
                    .required("Phone is required."),
                email: Yup.string()
                    .email("Wrong email format")
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Email is required."),
                currency: Yup.string()
                    .required("Currency is required."),
                address2: Yup.string(),
                city: Yup.string()
                    .required('City is required.'),
                postalcode: Yup.string()
                    .required("Postal Code is required."),
            }),
            initialValues: null,
        }
    }

    componentDidMount() {
        const title = 'Account Detail';
        setTitle({ pageTitle: title })

        this.setState({ loading: true });
        getProfile()
            .then(({ data: profile }) => {
                const initialValues = {
                    username: profile.username ? profile.username : "",
                    title: profile.title ? profile.title : "",
                    firstname: profile.firstname ? profile.firstname : "",
                    lastname: profile.lastname ? profile.lastname : "",
                    email: profile.email ? profile.email : "",
                    dateofbirth: profile.dateofbirth ? new Date(profile.dateofbirth) : "",

                    country: profile.country ? profile.country : "",
                    currency: profile.currency ? profile.currency : "",
                    region: profile.region ? profile.region : "",
                    city: profile.city ? profile.city : "",
                    address: profile.address ? profile.address : "",
                    address2: profile.address2 ? profile.address2 : "",
                    postalcode: profile.postalcode ? profile.postalcode : "",
                    phone: profile.phone ? profile.phone : "",
                }
                this.setState({ profileData: profile, initialValues });
            })
            .finally(() => {
                this.setState({ loading: false });
            })
    }

    saveProfile = (values, formik) => {
        formik.setSubmitting(true);
        this.setState({ isError: false, isSuccess: false });
        postProfile(values)
            .then(() => {
                this.setState({ isSuccess: true });
                formik.setSubmitting(false);
            }).catch(() => {
                this.setState({ isError: true });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { loading, profileData, profileSchema, initialValues } = this.state;
        if (loading)
            return (<div><FormattedMessage id="PAGES.LINE.LOADING" /></div>);
        if (profileData == null) {
            return (<div><FormattedMessage id="PAGES.NODATA.AVAILABLE" /></div>);
        }
        return (
            <div className="col-in bg-color-box pad10">
                <h1 className="main-heading-in"><FormattedMessage id="COMPONENTS.PERSONAL.DETAILS" /></h1>
                <div className="main-cnt">
                    <Formik
                        validationSchema={profileSchema}
                        initialValues={initialValues}
                        onSubmit={this.saveProfile}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <FormControl component="fieldset">
                                            <label><FormattedMessage id="PAGES.PROFILE.TITLE" /> <span className="text-danger">*</span></label>
                                            <RadioGroup
                                                row
                                                aria-label="gender"
                                                name="title"
                                                value={formik.values.title}
                                                {...formik.getFieldProps("title")}>
                                                <FormControlLabel value="Mr" control={<Radio readOnly />} label="Mr" />
                                                <FormControlLabel value="Ms" control={<Radio readOnly />} label="Ms" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.FIRSTNAME" /> <span className="text-danger">*</span></label>
                                        <input type="text" placeholder=""
                                            name="firstname"
                                            className={`form-control ${getInputClasses(formik, "firstname")}`}
                                            {...formik.getFieldProps("firstname")}
                                            readOnly
                                        />
                                        {formik.touched.firstname && formik.errors.firstname ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.firstname}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.LASTNAME" /> <span className="text-danger">*</span></label>
                                        <input type="text" placeholder=""
                                            name="lastname"
                                            className={`form-control ${getInputClasses(formik, "lastname")}`}
                                            {...formik.getFieldProps("lastname")}
                                            readOnly
                                        />
                                        {formik.touched.lastname && formik.errors.lastname ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.lastname}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.EMAIL" /> <span className="text-danger">*</span></label>
                                        <input type="email" placeholder=""
                                            name="email"
                                            className={`form-control ${getInputClasses(formik, "email")}`}
                                            {...formik.getFieldProps("email")}
                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.email}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.BIRTHDAY" /> <span className="text-danger">*</span></label>
                                        <CustomDatePicker
                                            name="dateofbirth"
                                            className="form-control"
                                            wrapperClassName="input-group"
                                            selected={formik.values.dateofbirth}
                                            {...formik.getFieldProps("dateofbirth")}
                                            {...{
                                                onChange: (dateofbirth) => {
                                                    formik.setFieldError("dateofbirth", false);
                                                    formik.setFieldTouched("dateofbirth", true);
                                                    formik.setFieldValue("dateofbirth", dateofbirth);
                                                },
                                            }}
                                            isInvalid={formik.errors.dateofbirth !== undefined}
                                            required
                                            readOnly
                                        />
                                        {formik.touched.dateofbirth && formik.errors.dateofbirth ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.dateofbirth}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.COUNTRY" /> <span className="text-danger">*</span></label>
                                        <input type="country" placeholder="" readOnly
                                            name="country"
                                            className={`form-control ${getInputClasses(formik, "country")}`}
                                            {...formik.getFieldProps("country")}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label>Currency <span className="text-danger">*</span></label>
                                        <input type="currency" placeholder="" readOnly
                                            name="currency"
                                            className={`form-control ${getInputClasses(formik, "currency")}`}
                                            {...formik.getFieldProps("currency")}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.REGION" /> <span className="text-danger">*</span></label>
                                        <RegionDropdown className={`form-control ${getInputClasses(formik, "region")}`}
                                            valueType="short"
                                            {...formik.getFieldProps("region")}
                                            country={formik.values.country}
                                            {...{
                                                onChange: (region) => {
                                                    formik.setFieldError("region", false);
                                                    formik.setFieldTouched("region", true);
                                                    formik.setFieldValue("region", region);
                                                },
                                                onBlur: (region) => {
                                                    formik.setFieldError("region", false);
                                                    formik.setFieldTouched("region", true);
                                                    formik.setFieldValue("region", region);
                                                }
                                            }}
                                        />
                                        {formik.touched.region && formik.errors.region ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.region}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.CITY" /> <span className="text-danger">*</span></label>
                                        <input type="city" placeholder=""
                                            name="city"
                                            className={`form-control ${getInputClasses(formik, "city")}`}
                                            {...formik.getFieldProps("city")}
                                        />
                                        {formik.touched.city && formik.errors.city ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.city}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.ADDRESS" /> <span className="text-danger">*</span></label>
                                        <input type="text" name="address" className={`form-control ${getInputClasses(formik, "address")}`}
                                            {...formik.getFieldProps("address")}
                                            placeholder="" />
                                        {formik.touched.address && formik.errors.address ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.address}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.ADDRESS2" /></label>
                                        <input type="text" name="address2" className={`form-control ${getInputClasses(formik, "address2")}`}
                                            {...formik.getFieldProps("address2")}
                                            placeholder="" />
                                        {formik.touched.address2 && formik.errors.address2 ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.address2}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.POSTALCODE" /> <span className="text-danger">*</span></label>
                                        <input type="text" name="postalcode" className={`form-control ${getInputClasses(formik, "postalcode")}`}
                                            {...formik.getFieldProps("postalcode")}
                                            placeholder="" />
                                        {formik.touched.postalcode && formik.errors.postalcode ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.postalcode}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12 col-12">
                                        <label><FormattedMessage id="PAGES.PROFILE.PHONE" /> <span className="text-danger">*</span></label>
                                        <PhoneInput
                                            type="text"
                                            name="phone"
                                            country="us"
                                            placeholder=""
                                            containerClass="input-group"
                                            dropdownClass="input-group-append"
                                            inputClass={`form-control ${getInputClasses(formik, "phone")}`}
                                            required
                                            value={formik.values.phone}
                                            {...formik.getFieldProps("phone")}
                                            {...{
                                                onChange: (value, data, event, formattedValue) => {
                                                    formik.setFieldTouched('phone', true);
                                                    formik.setFieldValue('phone', formattedValue);
                                                },
                                                onBlur: () => {
                                                    formik.setFieldTouched('phone', true);
                                                }
                                            }}
                                        />

                                        {formik.touched.phone && formik.errors.phone ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.phone}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <Button
                                    disabled={formik.isSubmitting}
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                >
                                    <FormattedMessage id="PAGES.SECURITY.SAVE" />
                                </Button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div >
        );
    }
}
