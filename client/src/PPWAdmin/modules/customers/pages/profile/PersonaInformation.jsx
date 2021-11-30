import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { RegionDropdown } from 'react-country-region-selector';
import { updateCustomer } from "../../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../../helpers/getInputClasses";
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";
import CustomDatePicker from "../../../../../components/customDatePicker";

class PersonaInformation extends React.Component {
    constructor(props) {
        super(props);
        const { customer } = props;
        this.state = {
            id: customer._id,
            saving: false,
            isError: false,
            isSuccess: false,
            initialValues: {
                username: customer.username ? customer.username : "",
                firstname: customer.firstname ? customer.firstname : "",
                lastname: customer.lastname ? customer.lastname : "",
                email: customer.email ? customer.email : "",
                country: customer.country ? customer.country : "",
                address: customer.address ? customer.address : "",
                region: customer.region ? customer.region : "",
                phone: customer.phone ? customer.phone : "",
                currency: customer.currency ? customer.currency : "",
                dateofbirth: customer.dateofbirth ? new Date(customer.dateofbirth) : new Date(),
            },
            Schema: Yup.object().shape({
                username: Yup.string().required("User name is required"),
                firstname: Yup.string().required("First name is required"),
                lastname: Yup.string().required("Last name is required"),
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required"),
                country: Yup.string(),
                phone: Yup.string().required("Phone is required"),
                address: Yup.string(),
                region: Yup.string(),
                phone: Yup.string(),
                currency: Yup.string(),
                dateofbirth: Yup.date()
            })
        }
    }
    // Methods
    saveCustomer = (values, formik) => {
        this.setState({ saving: true, isSuccess: false, isError: false });
        const { id } = this.state;
        updateCustomer(id, values).then(() => {
            formik.setSubmitting(false);
            this.setState({ saving: false, isSuccess: true });
        }).catch(() => {
            formik.setSubmitting(false);
            this.setState({ saving: false, isError: true });
        })
    };

    render() {
        const { initialValues, Schema, saving, isError, isSuccess, id } = this.state;

        return (
            <Formik initialValues={initialValues}
                validationSchema={Schema}
                onSubmit={this.saveCustomer}>
                {(formik) => (
                    <form className="card card-custom card-stretch"
                        onSubmit={(e) => formik.handleSubmit(e)}>
                        {saving && <ModalProgressBar />}

                        {/* begin::Header */}
                        <div className="card-header py-3">
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">
                                    Customer Information
                                </h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Update Customer informaiton
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
                                        User Name
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="First name"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "username")}`}
                                            name="username"
                                            readOnly
                                            {...formik.getFieldProps("username")}
                                        />
                                        {formik.touched.username && formik.errors.username ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.username}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        First Name
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="First name"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "firstname")}`}
                                            name="firstname"
                                            {...formik.getFieldProps("firstname")}
                                        />
                                        {formik.touched.firstname && formik.errors.firstname ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.firstname}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Last Name
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="Last name"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "lastname")}`}
                                            name="lastname"
                                            {...formik.getFieldProps("lastname")}
                                        />
                                        {formik.touched.lastname && formik.errors.lastname ? (
                                            <div className="invalid-feedback">{formik.errors.lastname}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Email
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            readOnly
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "email")}`}
                                            name="email"
                                            {...formik.getFieldProps("email")}
                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="invalid-feedback">{formik.errors.email}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Country
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            readOnly
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "country")}`}
                                            name="country"
                                            {...formik.getFieldProps("country")}
                                        />
                                        {formik.touched.country && formik.errors.country ? (
                                            <div className="invalid-feedback">{formik.errors.country}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Address
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="City, Province/State"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "address")}`}
                                            name="address"
                                            {...formik.getFieldProps("address")}
                                        />
                                        {formik.touched.address && formik.errors.address ? (
                                            <div className="invalid-feedback">{formik.errors.address}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Region
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <RegionDropdown
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "region")}`}
                                            name="region"
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
                                            <div className="invalid-feedback">{formik.errors.region}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Phone
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="Phone"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "phone")}`}
                                            name="phone"
                                            {...formik.getFieldProps("phone")}
                                        />
                                        {formik.touched.phone && formik.errors.phone ? (
                                            <div className="invalid-feedback">{formik.errors.phone}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Currency
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input
                                            type="text"
                                            placeholder="Currency"
                                            readOnly
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "currency")}`}
                                            name="currency"
                                            {...formik.getFieldProps("currency")}
                                        />
                                        {formik.touched.currency && formik.errors.currency ? (
                                            <div className="invalid-feedback">{formik.errors.currency}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="text-left col-xl-3 col-lg-3 col-form-label">
                                        Date Of Birth
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <CustomDatePicker
                                            name="dateofbirth"
                                            className="form-control form-control-lg form-control-solid"
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
                                        />
                                        {formik.touched.dateofbirth && formik.errors.dateofbirth ? (
                                            <div className="invalid-feedback">{formik.errors.dateofbirth}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            {/* end::Body */}
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
                        {/* end::Form */}
                    </form >
                )}
            </Formik>
        )
    }
}

export default PersonaInformation;
