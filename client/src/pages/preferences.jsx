
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import * as Yup from "yup";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import axios from 'axios';
import { setPreferences } from "../redux/services";

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Preferences extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submitSuccess: false,
            submitError: false,
        }
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

    onSubmit = (values, formik) => {
        const { setPreference } = this.props;
        setPreferences()
            .then(() => {
                this.setState({ submitSuccess: true });
                setPreference(values);
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ submitError: true });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { oddsFormat, lang, dateFormat, timezone } = this.props;
        const initialValues = { oddsFormat, lang, dateFormat, timezone };

        const preferenceSchema = Yup.object().shape({
            oddsFormat: Yup.string()
                .required("You shuld select Odds Format."),
            timezone: Yup.string()
                .required("You shuld select Timezone."),
            dateFormat: Yup.string()
                .required("You shuld select Date Format."),
            lang: Yup.string()
                .required("You shuld select Language."),
        });
        setTitle({ pageTitle: 'Preferences' });
        return (
            <React.Fragment>
                <div className="col-in prfnce">
                    <h1 className="main-heading-in">Preferences</h1>
                    <div className="main-cnt">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={preferenceSchema}
                            onSubmit={this.onSubmit}>
                            {
                                (formik) => (
                                    <form onSubmit={formik.handleSubmit}>
                                        <h3> DISPLAY PREFERENCES</h3>

                                        <Form.Group>
                                            <Form.Label>Odds display format</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="oddsFormat"
                                                placeholder=""
                                                required
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "oddsFormat"
                                                )}`}
                                                {...formik.getFieldProps("oddsFormat")}
                                            >
                                                <option value="american"> American Odds</option>
                                                <option value="decimal"> Decimal Odds</option>
                                            </Form.Control>
                                            {formik.touched.oddsFormat && formik.errors.oddsFormat ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.oddsFormat}
                                                </div>
                                            ) : null}
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Default Date format</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="dateFormat"
                                                placeholder=""
                                                required
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "dateFormat"
                                                )}`}
                                                {...formik.getFieldProps("dateFormat")}
                                            >
                                                <option value="DD-MM-YYYY"> DD-MM-YYYY</option>
                                            </Form.Control>
                                            {formik.touched.dateFormat && formik.errors.dateFormat ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.dateFormat}
                                                </div>
                                            ) : null}
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Default time zone</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="timezone"
                                                placeholder=""
                                                required
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "timezone"
                                                )}`}
                                                {...formik.getFieldProps("timezone")}
                                            >
                                                <option value="-10:00">(GMT -10:00) Hawaii</option>
                                                <option value="-09:50">(GMT -9:30) Taiohae</option>
                                                <option value="-09:00">(GMT -9:00) Alaska</option>
                                                <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                                                <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                                                <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                                                <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                                <option value="-04:50">(GMT -4:30) Caracas</option>
                                                <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                                <option value="-03:50">(GMT -3:30) Newfoundland</option>
                                            </Form.Control>
                                            {formik.touched.timezone && formik.errors.timezone ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.timezone}
                                                </div>
                                            ) : null}
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Language</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="lang"
                                                placeholder=""
                                                required
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "lang"
                                                )}`}
                                                {...formik.getFieldProps("lang")}
                                            >
                                                <option value="en"> English</option>
                                            </Form.Control>
                                            {formik.touched.lang && formik.errors.lang ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.lang}
                                                </div>
                                            ) : null}
                                        </Form.Group>

                                        <button type="submit" className="clr-blue btn-smt">Save </button>
                                    </form>
                                )
                            }
                        </Formik>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    oddsFormat: state.frontend.oddsFormat,
    lang: state.frontend.lang,
    dateFormat: state.frontend.dateFormat,
    timezone: state.frontend.timezone,
});

export default connect(mapStateToProps, frontend.actions)(Preferences)