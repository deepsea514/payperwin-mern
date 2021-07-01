import React, { Component } from 'react';
import axios from 'axios';
import { setMeta } from '../libs/documentTitleBuilder';
import * as Yup from "yup";
import { Formik } from "formik";
import { RegionDropdown } from 'react-country-region-selector';
// import SVG from "react-inlinesvg";
import { Button, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DocumentMeta from 'react-document-meta';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            profileData: null,
            isSuccess: false,
            isError: false,
            metaData: null,
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
                    .required("Region is required."),
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
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })

        const url = `${serverUrl}/profile`;
        this.setState({ loading: true });
        axios.get(url, { withCredentials: true }).then(({ data: profile }) => {
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
        }).finally(() => {
            this.setState({ loading: false });
        })
    }

    saveProfile = (values, formik) => {
        formik.setSubmitting(true);
        this.setState({ isError: false, isSuccess: false });
        const url = `${serverUrl}/profile`;
        axios.post(url, values, { withCredentials: true })
            .then(() => {
                this.setState({ isSuccess: true });
                formik.setSubmitting(false);
            }).catch(() => {
                this.setState({ isError: true });
                formik.setSubmitting(false);
            })
    }

    // sendVerificationEmail = (email) => {
        // const url = `${serverUrl}/sendVerificationEmail`;
        // axios(
        //     {
        //         method: 'post',
        //         url,
        //         data: JSON.stringify({ email }),
        //         withCredentials: true,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     },
        // );
        // this.setState({ emailSent: true });
    // }

    getInputClasses = (formik, fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }
        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }
        return "";
    };

    render() {
        const { loading, profileData, profileSchema, initialValues, isSuccess, isError, metaData } = this.state;
        if (loading)
            return (<div>Loading...</div>);
        if (profileData == null) {
            return (<div>No data available</div>);
        }
        return (
            <div className="col-in bg-color-box pad10">
                {metaData && <DocumentMeta {...metaData} />}
                <h1 className="main-heading-in">Personal details</h1>
                <div className="main-cnt">
                    <Formik
                        validationSchema={profileSchema}
                        initialValues={initialValues}
                        onSubmit={this.saveProfile}
                    >
                        {
                            (formik) => (
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <FormControl component="fieldset">
                                                <label>Title <span className="text-danger">*</span></label>
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
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>User Name <span className="text-danger">*</span></label>
                                            <input type="text" placeholder="User Name"
                                                name="username"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "username"
                                                )}`}
                                                {...formik.getFieldProps("username")}
                                                readOnly
                                            />
                                            {formik.touched.username && formik.errors.username ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.username}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>First Name <span className="text-danger">*</span></label>
                                            <input type="text" placeholder="First Name"
                                                name="firstname"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "firstname"
                                                )}`}
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
                                            <label>Last Name <span className="text-danger">*</span></label>
                                            <input type="text" placeholder="Last Name"
                                                name="lastname"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "lastname"
                                                )}`}
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
                                            <label>Email <span className="text-danger">*</span></label>
                                            <input type="email" placeholder="Email"
                                                name="email"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "email"
                                                )}`}
                                                {...formik.getFieldProps("email")}
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.email}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>Birthday <span className="text-danger">*</span></label>
                                            <DatePicker
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
                                                placeholder="Enter Birthday"
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
                                            <label>Country <span className="text-danger">*</span></label>
                                            <input type="country" placeholder="Country" readOnly
                                                name="country"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "country"
                                                )}`}
                                                {...formik.getFieldProps("country")}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>Currency <span className="text-danger">*</span></label>
                                            <input type="currency" placeholder="Currency" readOnly
                                                name="currency"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "currency"
                                                )}`}
                                                {...formik.getFieldProps("currency")}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>Region <span className="text-danger">*</span></label>
                                            <RegionDropdown className={`form-control ${this.getInputClasses(
                                                formik,
                                                "region"
                                            )}`}
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
                                            <label>City <span className="text-danger">*</span></label>
                                            <input type="city" placeholder="City"
                                                name="city"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "city"
                                                )}`}
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
                                            <label>Address <span className="text-danger">*</span></label>
                                            <input type="text" name="address" className={`form-control ${this.getInputClasses(
                                                formik,
                                                "address"
                                            )}`}
                                                {...formik.getFieldProps("address")}
                                                placeholder="Address" />
                                            {formik.touched.address && formik.errors.address ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.address}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>Address 2</label>
                                            <input type="text" name="address2" className={`form-control ${this.getInputClasses(
                                                formik,
                                                "address2"
                                            )}`}
                                                {...formik.getFieldProps("address2")}
                                                placeholder="Address 2" />
                                            {formik.touched.address2 && formik.errors.address2 ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.address2}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>Postal Code <span className="text-danger">*</span></label>
                                            <input type="text" name="postalcode" className={`form-control ${this.getInputClasses(
                                                formik,
                                                "postalcode"
                                            )}`}
                                                {...formik.getFieldProps("postalcode")}
                                                placeholder="Postal Code" />
                                            {formik.touched.postalcode && formik.errors.postalcode ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.postalcode}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6 col-sm-12 col-12">
                                            <label>Phone Number <span className="text-danger">*</span></label>
                                            <PhoneInput
                                                type="text"
                                                name="phone"
                                                placeholder="Enter Phone Number"
                                                containerClass="input-group"
                                                dropdownClass="input-group-append"
                                                inputClass={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "phone"
                                                )}`}
                                                required
                                                value={formik.values.phone}
                                                {...formik.getFieldProps("phone")}
                                                {...{
                                                    onChange: (phone) => {
                                                        formik.setFieldTouched('phone', true);
                                                        formik.setFieldValue('phone', phone);
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
                                        Save
                                    </Button>
                                </form>
                            )
                        }
                    </Formik>
                </div>
            </div >
        );
    }
}
