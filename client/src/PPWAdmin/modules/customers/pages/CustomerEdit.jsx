import React from "react";
import { connect } from "react-redux";
import * as customers from "../redux/reducers";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import { getCustomerDetail, updateCustomer } from "../redux/services";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { Formik } from "formik";
import { RegionDropdown } from 'react-country-region-selector';

class CustomerEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            isSuccess: false,
            isError: false,
            loading: false,
            customer: null,
            customerSchema: Yup.object().shape({
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
        const { id } = this.state;
        this.setState({ loading: true });
        getCustomerDetail(id)
            .then(({ data: customer }) => {
                this.setState({
                    customer, loading: false, initialValues: {
                        firstname: customer.firstname ? customer.firstname : "",
                        lastname: customer.lastname ? customer.lastname : "",
                        country: customer.country ? customer.country : "",
                        address: customer.address ? customer.address : "",
                        region: customer.region ? customer.region : "",
                        phone: customer.phone ? customer.phone : "",
                        email: customer.email ? customer.email : "",
                        currency: customer.currency ? customer.currency : "",
                    }
                });
            })
            .catch(err => {
                this.setState({ customer: null, loading: false });
            });
    }

    onSubmit = (values, formik) => {
        const { id } = this.state;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        updateCustomer(id, values)
            .then(() => {
                this.setState({ isSuccess: true });
            }).catch((error) => {
                console.log(error);
                this.setState({ isError: true });
            }).finally(() => {
                formik.setSubmitting(false)
            });
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
        const { customer, loading, customerSchema, initialValues, isError, isSuccess } = this.state;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    {!loading && customer == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}
                    {!loading && customer && <Formik
                        validationSchema={customerSchema}
                        initialValues={initialValues}
                        onSubmit={this.onSubmit}
                    >
                        {(formik) => {
                            return <form onSubmit={formik.handleSubmit}>
                                <div className="card card-custom gutter-b">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <h3 className="card-label">Customer Edit</h3>
                                        </div>
                                    </div>
                                    <div className="card-body">
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
                                                <label>First Name<span className="text-danger">*</span></label>
                                                <input type="text" name="firstname" className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "firstname"
                                                )}`}
                                                    {...formik.getFieldProps("firstname")}
                                                    placeholder="First Name" />
                                                {formik.touched.firstname && formik.errors.firstname ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.firstname}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>Last Name<span className="text-danger">*</span></label>
                                                <input type="text" name="lastname" className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "lastname"
                                                )}`}
                                                    {...formik.getFieldProps("lastname")}
                                                    placeholder="Last Name" />
                                                {formik.touched.lastname && formik.errors.lastname ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.lastname}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Email<span className="text-danger">*</span></label>
                                                <input type="text" name="email" className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "email"
                                                )}`}
                                                    {...formik.getFieldProps("email")}
                                                    placeholder="Email" />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.email}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>Phone<span className="text-danger">*</span></label>
                                                <input type="text" name="phone" className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "phone"
                                                )}`}
                                                    {...formik.getFieldProps("phone")}
                                                    placeholder="Phone" />
                                                {formik.touched.phone && formik.errors.phone ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.phone}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-group form-row">
                                            <div className="col">
                                                <label>Country<span className="text-danger">*</span></label>
                                                <input type="text" name="country" readOnly className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "country"
                                                )}`}
                                                    {...formik.getFieldProps("country")}
                                                    placeholder="Country" />
                                            </div>
                                            <div className="col">
                                                <label>Region<span className="text-danger">*</span></label>
                                                <RegionDropdown className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "region"
                                                )}`}
                                                    {...formik.getFieldProps("region")}
                                                    valueType="short"
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
                                        </div>
                                        <div className="form-group">
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
                                        <div className="form-group form-row">
                                            <div className="col">
                                                <label>Currency<span className="text-danger">*</span></label>
                                                <input type="text" name="currency" readOnly className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "currency"
                                                )}`}
                                                    {...formik.getFieldProps("currency")}
                                                    placeholder="Currency" />
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Submit</button>
                                        <Link to="/" className="btn btn-secondary">Cancel</Link>
                                    </div>
                                </div>
                            </form>
                        }}
                    </Formik>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, customers.actions)(CustomerEdit)