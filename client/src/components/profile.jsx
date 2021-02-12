import React, { Component } from 'react';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder';
import * as Yup from "yup";
import { Formik } from "formik";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
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
            profileSchema: Yup.object().shape({
                firstname: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("First Name is required."),
                lastname: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Last Name is required."),
                country: Yup.string()
                    .min(1, "Country is required.")
                    .required("Country is required."),
                address: Yup.string()
                    .min(1, "Address is required.")
                    .required("Address is required."),
                region: Yup.string()
                    .min(1, "Region is required.")
                    .required("Region is required."),
                phone: Yup.string()
                    .min(3, "Minimum 7 symbols")
                    .required("Phone is required."),
                email: Yup.string()
                    .email("Wrong email format")
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Email is required."),
                currency: Yup.string()
                    .min(1, "Currency is required.")
                    .required("Currency is required.")
            }),
            initialValues: null,
        }
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Personal Details' });
        const url = `${serverUrl}/profile`;
        this.setState({ loading: true });
        axios.get(url, { withCredentials: true }).then(({ data: profile }) => {
            const initialValues = {
                firstname: profile.firstname ? profile.firstname : "",
                lastname: profile.lastname ? profile.lastname : "",
                country: profile.country ? profile.country : "",
                address: profile.address ? profile.address : "",
                region: profile.region ? profile.region : "",
                phone: profile.phone ? profile.phone : "",
                email: profile.email ? profile.email : "",
                currency: profile.currency ? profile.currency : "",
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

    sendVerificationEmail = (email) => {
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
    }

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
        const { loading, profileData, profileSchema, initialValues, isSuccess, isError } = this.state;
        if (loading)
            return (<div>Loading...</div>);
        if (profileData == null) {
            return (<div>No data available</div>);
        }
        return (
            <div className="col-in bg-color-box pad10">
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
                                    {/* {isError && (
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
                                    )} */}

                                    <div className="form-group">
                                        <label>First Name<span className="text-danger">*</span></label>
                                        <input type="text" placeholder="First Name"
                                            name="firstname"
                                            className={`form-control ${this.getInputClasses(
                                                formik,
                                                "firstname"
                                            )}`}
                                            {...formik.getFieldProps("firstname")}
                                        />
                                        {formik.touched.firstname && formik.errors.firstname ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.firstname}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name<span className="text-danger">*</span></label>
                                        <input type="text" placeholder="Last Name"
                                            name="lastname"
                                            className={`form-control ${this.getInputClasses(
                                                formik,
                                                "lastname"
                                            )}`}
                                            {...formik.getFieldProps("lastname")}
                                        />
                                        {formik.touched.lastname && formik.errors.lastname ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.lastname}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group mar30">
                                        <label>Email<span className="text-danger">*</span></label>
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
                                    <div className="form-group">
                                        <label>Country<span className="text-danger">*</span></label>
                                        <input type="country" placeholder="Country" readOnly
                                            name="country"
                                            className={`form-control ${this.getInputClasses(
                                                formik,
                                                "country"
                                            )}`}
                                            {...formik.getFieldProps("country")}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Currency<span className="text-danger">*</span></label>
                                        <input type="currency" placeholder="Currency" readOnly
                                            name="currency"
                                            className={`form-control ${this.getInputClasses(
                                                formik,
                                                "currency"
                                            )}`}
                                            {...formik.getFieldProps("currency")}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Region<span className="text-danger">*</span></label>
                                        <RegionDropdown className={`form-control ${this.getInputClasses(
                                            formik,
                                            "region"
                                        )}`}
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
                                    <div className="form-group mar30">
                                        <label>Address<span className="text-danger">*</span></label>
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
                                    <button type="submit" className="btn-smt" disabled={formik.isSubmitting}>Save</button>
                                </form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        );
    }
}
