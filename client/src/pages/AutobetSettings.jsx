import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import * as Yup from "yup";
import { Formik } from "formik";
import { Form, Button } from "react-bootstrap";
import { getInputClasses } from "../helpers/getInputClasses";
import { FormControl, FormControlLabel, RadioGroup, Radio, Checkbox } from "@material-ui/core";
import { Link } from "react-router-dom";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import axios from 'axios';
import SVG from "react-inlinesvg";

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

const sideOptions = [
    { value: 'Underdog', label: 'Underdog' },
    { value: 'Favorite', label: 'Favorite' },
]

const betTypeOptions = [
    { value: 'Moneyline', label: 'Moneyline' },
    { value: 'Spreads', label: 'Spreads' },
    { value: 'Over/Under', label: 'Over/Under' },
]

class AutobetSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submitSuccess: false,
            submitError: false,
            initialValues: null,
            autobetSchema: Yup.object().shape({
                rollOver: Yup.boolean().default(false),
                budget: Yup.number()
                    .moreThan(0, "Budget should be more than 0")
                    .required("Budget field is required"),
                maxRisk: Yup.number()
                    .moreThan(0, "Max Risk should be more than 0")
                    .required("Max Risk field is required."),
                sports: Yup.array().of(Yup.object()),
                side: Yup.array().of(Yup.object())
                    .min(1, "Please choose at least a Side."),
                betType: Yup.array().of(Yup.object())
                    .min(1, "Please choose at least a Bet Type."),
            }),
            loadingSports: false,
        }
    }

    componentDidMount() {
        const { user } = this.props;
        setTitle({ pageTitle: 'Autobet Settings' });
        if (user) {
            if (!user.autobet) {
                history.push('/');
            } else {
                this.setState({
                    initialValues: {
                        rollOver: user.autobet.rollOver,
                        budget: user.autobet.budget,
                        maxRisk: user.autobet.maxRisk,
                        sports: user.autobet.sports.map(sport => ({ value: sport, label: sport })),
                        side: user.autobet.side.map(side => ({ value: side, label: side })),
                        betType: user.autobet.betType.map(betType => ({ value: betType, label: betType }))
                    }
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { user, history } = this.props;
        const { user: prevUser } = prevProps;
        if (user) {
            if (!user.autobet) {
                return history.push('/');
            }
            if (!prevUser) {
                this.setState({
                    initialValues: {
                        rollOver: user.autobet.rollOver,
                        budget: user.autobet.budget,
                        maxRisk: user.autobet.maxRisk,
                        sports: user.autobet.sports.map(sport => ({ value: sport, label: sport })),
                        side: user.autobet.side.map(side => ({ value: side, label: side })),
                        betType: user.autobet.betType.map(betType => ({ value: betType, label: betType }))
                    }
                });
            }
        }
    }

    getSports = (name, cb) => {
        this.setState({ loadingSports: true });
        axios.get(`${serverUrl}/searchsports?name=${name}`).then(({ data }) => {
            cb(data);
            this.setState({ loadingSports: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingSports: false });
        })
    }

    onSubmit = (values, formik) => {
        this.setState({ submitError: false, submitSuccess: false, });
        const newValues = {
            rollOver: values.rollOver,
            budget: values.budget,
            maxRisk: values.maxRisk,
            sports: values.sports.map(sport => sport.value),
            side: values.side.map(side => side.value),
            betType: values.betType.map(betType => betType.value),
        }
        axios.post(`${serverUrl}/autobet/settings`, newValues, { withCredentials: true })
            .then(() => {
                this.setState({ submitSuccess: true });
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ submitError: true });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { initialValues, autobetSchema, loadingSports, submitSuccess, submitError } = this.state;
        return (
            <React.Fragment>
                <div className="col-in">
                    <h1 className="main-heading-in">Autobet Settings</h1>
                    <div className="main-cnt mx-2 p-3">
                        {initialValues && <Formik
                            initialValues={initialValues}
                            validationSchema={autobetSchema}
                            onSubmit={this.onSubmit}>
                            {
                                (formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
                                        {submitError && (
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
                                                    Can't save settings
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ submitError: false })}>
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
                                        {submitSuccess && (
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
                                                    Successfully Saved.
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ submitSuccess: false })}>
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
                                            <div className="col-md-12">
                                                <input type="checkbox" id="rollOver" name="rollOver" {...formik.getFieldProps("rollOver")} />
                                                <label htmlFor="rollOver" style={{ display: 'initial' }}> &nbsp;&nbsp;Roll over wins into the daily budget</label>
                                                {formik.touched.rollOver && formik.errors.rollOver ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.rollOver}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>Daily Max Budget<span className="text-danger">*</span></label>
                                                <input name="budget" placeholder="Enter Budget"
                                                    className={`form-control ${getInputClasses(formik, "budget")}`}
                                                    {...formik.getFieldProps("budget")}
                                                />
                                                {formik.touched.budget && formik.errors.budget ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.budget}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Max.Risk (per bet)<span className="text-danger">*</span></label>
                                                <input name="maxRisk" placeholder="Enter Max.Risk"
                                                    className={`form-control ${getInputClasses(formik, "maxRisk")}`}
                                                    {...formik.getFieldProps("maxRisk")}
                                                />
                                                {formik.touched.maxRisk && formik.errors.maxRisk ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.maxRisk}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Sports to exclude<span className="text-danger">*</span></label>
                                            <AsyncSelect
                                                className={`basic-single ${getInputClasses(formik, "sports")}`}
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                isMulti
                                                name="sports"
                                                loadOptions={this.getSports}
                                                noOptionsMessage={() => "No Sports"}
                                                value={formik.values.sports}
                                                isLoading={loadingSports}
                                                {...formik.getFieldProps("sports")}
                                                {...{
                                                    onChange: (sports) => {
                                                        if (!sports) return;
                                                        formik.setFieldValue("sports", sports);
                                                        formik.setFieldTouched("sports", true);
                                                        formik.setFieldError("sports", false);
                                                    },

                                                }}
                                            />
                                            {formik.touched.sports && formik.errors.sports ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.sports}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Side<span className="text-danger">*</span></label>
                                            <Select
                                                className={`basic-single ${getInputClasses(formik, "side")}`}
                                                classNamePrefix="select"
                                                isMulti
                                                name="side"
                                                options={sideOptions}
                                                value={formik.values.side}
                                                {...formik.getFieldProps("side")}
                                                {...{
                                                    onChange: (side) => {
                                                        if (!side) return;
                                                        formik.setFieldValue("side", side);
                                                        formik.setFieldTouched("side", true);
                                                        formik.setFieldError("side", false);
                                                    },

                                                }}
                                            />
                                            {formik.touched.side && formik.errors.side ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.side}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Bet Type<span className="text-danger">*</span></label>
                                            <Select
                                                className={`basic-single ${getInputClasses(formik, "betType")}`}
                                                classNamePrefix="select"
                                                isMulti
                                                name="betType"
                                                options={betTypeOptions}
                                                value={formik.values.betType}
                                                {...formik.getFieldProps("betType")}
                                                {...{
                                                    onChange: (betType) => {
                                                        if (!betType) return;
                                                        formik.setFieldValue("betType", betType);
                                                        formik.setFieldTouched("betType", true);
                                                        formik.setFieldError("betType", false);
                                                    },

                                                }}
                                            />
                                            {formik.touched.betType && formik.errors.betType ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.betType}
                                                </div>
                                            ) : null}
                                        </div>
                                        <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                            Save
                                        </Button>
                                    </form>
                                }
                            }
                        </Formik>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AutobetSettings;