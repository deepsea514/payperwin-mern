import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { getCustomerDetail, updateCustomer } from "../../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../../helpers/getInputClasses";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import config from '../../../../../../../config.json';
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";


class CustomerTier extends React.Component {
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
                maxBetLimitTier: Yup.string()
                    .required("You shuld select Tier ."),
            })
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getCustomerDetail(id)
            .then(({ data }) => {
                this.setState({
                    loading: false, initialValues: {
                        maxBetLimitTier: data && data.maxBetLimitTier ? data.maxBetLimitTier : '2000',
                    }
                });
            })
            .catch(() => {
                this.setState({ loading: false, initialValues: null });
            })
    }

    saveCustomerTier = (values, formik) => {
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
                onSubmit={this.saveCustomerTier}>
                {(formik) => (
                    <form
                        className="card card-custom card-stretch"
                        onSubmit={(e) => formik.handleSubmit(e)}>
                        {saving && <ModalProgressBar />}

                        {/* begin::Header */}
                        <div className="card-header py-3">
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">
                                    Customer Tier
                                </h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Update Customer Maximum Bet Limit Tier
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
                                    Maximum Bet Limit
                                    </label>
                                    <div className="col-lg-9 col-xl-6">
                                        <select
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(formik, "maxBetLimitTier")}`}
                                            name="maxBetLimitTier"
                                            readOnly
                                            {...formik.getFieldProps("maxBetLimitTier")}
                                        >
                                        <option value="2000">Tier 0 (max. $2,000)</option>
                                        <option value="3000">Tier 1 (max. $3,000)</option>
                                        <option value="5000">Tier 2 (max. $5,000)</option>
                                        <option value="10000">Tier 3 (max. $10,000)</option>
                                        </select>
                                        {formik.touched.maxBetLimitTier && formik.errors.maxBetLimitTier ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.maxBetLimitTier}
                                            </div>
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

export default CustomerTier;
