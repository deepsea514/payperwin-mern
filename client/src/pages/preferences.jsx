import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import * as Yup from "yup";
import SVG from "react-inlinesvg";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { setPreferences } from "../redux/services";
import timeHelper from "../helpers/timehelper";
import { getInputClasses } from "../helpers/getInputClasses";
import { FormControl, FormControlLabel, RadioGroup, Radio, Checkbox } from "@material-ui/core";
import { Link } from "react-router-dom";
import config from '../../../config.json';
import { FormattedMessage, injectIntl } from 'react-intl';
const TimeZones = config.TimeZones;
const isDstObserved = config.isDstObserved;

const initial_notification_settings = {
    win_confirmation: { email: true, sms: true },
    lose_confirmation: { email: false, sms: false },
    wager_matched: { email: true, sms: true },
    bet_accepted: { email: true, sms: true },
    no_match_found: { email: true, sms: true },
    bet_forward_reminder: { email: true, sms: true },
    deposit_confirmation: { email: true, sms: true },
    withdraw_confirmation: { email: true, sms: true },
    other: { email: true, sms: true },
}

class Preferences extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submitSuccess: false,
            submitError: false,
        }
    }

    componentDidMount() {
        const title = 'Preferences';
        setTitle({ pageTitle: title });
    }

    onSubmit = (values, formik) => {
        const { setPreference: setPreferenceReducer } = this.props;
        setPreferences(values)
            .then(() => {
                this.setState({ submitSuccess: true });
                setPreferenceReducer(values);
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ submitError: true });
                formik.setSubmitting(false);
            })
    }

    getTimeZoneOptions = () => {
        return TimeZones.map(timezone => {
            if (isDstObserved && timezone.dst) {
                return <option key={timezone.value} value={timezone.value}>GMT ({timeHelper.getDSTTimeOffset(timezone.time)}) {timezone.name}</option>
            }
            return <option key={timezone.value} value={timezone.value}>GMT ({timezone.time}) {timezone.name}</option>
        });
    }

    render() {
        const {
            oddsFormat,
            lang,
            dateFormat,
            timezone,
            notification_settings,
            user,
            intl
        } = this.props;

        const initialValues = {
            oddsFormat,
            lang,
            dateFormat,
            timezone,
            notification_settings: notification_settings ? {
                win_confirmation: notification_settings.win_confirmation ? notification_settings.win_confirmation : { email: true, sms: true },
                lose_confirmation: notification_settings.lose_confirmation ? notification_settings.lose_confirmation : { email: false, sms: false },
                wager_matched: notification_settings.wager_matched ? notification_settings.wager_matched : { email: true, sms: true },
                bet_accepted: notification_settings.bet_accepted ? notification_settings.bet_accepted : { email: true, sms: true },
                no_match_found: notification_settings.no_match_found ? notification_settings.no_match_found : { email: true, sms: true },
                bet_forward_reminder: notification_settings.bet_forward_reminder ? notification_settings.bet_forward_reminder : { email: true, sms: true },
                deposit_confirmation: notification_settings.deposit_confirmation ? notification_settings.deposit_confirmation : { email: true, sms: true },
                withdraw_confirmation: notification_settings.withdraw_confirmation ? notification_settings.withdraw_confirmation : { email: true, sms: true },
                other: notification_settings.other ? notification_settings.other : { email: true, sms: true },
            } : initial_notification_settings
        };

        const preferenceSchema = Yup.object().shape({
            oddsFormat: Yup.string()
                .required("You shuld select Odds Format."),
            timezone: Yup.string()
                .required("You shuld select Timezone."),
            dateFormat: Yup.string()
                .required("You shuld select Date Format."),
            lang: Yup.string()
                .required("You shuld select Language."),
            notification_settings: Yup.object().shape({
                win_confirmation: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
                lose_confirmation: Yup.object().shape({
                    email: Yup.bool().default(false),
                    sms: Yup.bool().default(false),
                }),
                wager_matched: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
                bet_accepted: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
                no_match_found: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
                bet_forward_reminder: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
                deposit_confirmation: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
                withdraw_confirmation: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
                other: Yup.object().shape({
                    email: Yup.bool().default(true),
                    sms: Yup.bool().default(true),
                }),
            })
        });

        const { submitSuccess, submitError } = this.state;

        return (
            <React.Fragment>
                <div className="col-in prfnce">
                    <h1 className="main-heading-in"><FormattedMessage id="COMPONENTS.PREFERENCES" /></h1>
                    <div className="main-cnt mx-2">
                        {user && timezone && <Formik
                            initialValues={initialValues}
                            validationSchema={preferenceSchema}
                            onSubmit={this.onSubmit}>
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit}>
                                    {submitError && (
                                        <div className="alert alert-custom alert-light-danger fade show mb-10"
                                            role="alert">
                                            <div className="alert-icon">
                                                <span className="svg-icon svg-icon-3x svg-icon-danger">
                                                    <SVG src={"/media/svg/icons/Code/Info-circle.svg"} />
                                                </span>
                                            </div>
                                            <div className="alert-text font-weight-bold">
                                                <FormattedMessage id="PAGES.AUTOBET.CANNOT_SAVE" />
                                            </div>
                                            <div className="alert-close" onClick={() => this.setState({ submitError: false })}>
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
                                    {submitSuccess && (
                                        <div
                                            className="alert alert-custom alert-light-success fade show mb-10"
                                            role="alert">
                                            <div className="alert-icon">
                                                <span className="svg-icon svg-icon-3x svg-icon-success">
                                                    <SVG src={"/media/svg/icons/Code/Info-circle.svg"} />
                                                </span>
                                            </div>
                                            <div className="alert-text font-weight-bold">
                                                <FormattedMessage id="PAGES.AUTOBET.SAVED" />
                                            </div>
                                            <div className="alert-close" onClick={() => this.setState({ submitSuccess: false })}>
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
                                    <div className="preference-group p-3">
                                        <h3> <FormattedMessage id="PAGES.PREFERENCES.DESIPAY" /></h3>
                                        <br />

                                        {/* <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.PREFERENCES.ODDSDISPLAY" /></Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="oddsFormat"
                                                placeholder=""
                                                required
                                                className={`form-control ${getInputClasses(formik, "oddsFormat")}`}
                                                {...formik.getFieldProps("oddsFormat")}>
                                                <option value="american">{intl.formatMessage({ id: 'COMPONENTS.AMERICAN.ODDS' })}</option>
                                                <option value="decimal">{intl.formatMessage({ id: 'COMPONENTS.DECIMAL.ODDS' })}</option>
                                            </Form.Control>
                                            {formik.touched.oddsFormat && formik.errors.oddsFormat ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.oddsFormat}
                                                </div>
                                            ) : null}
                                        </Form.Group> */}

                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.PREFERENCES.DATEDISPLAY" /></Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="dateFormat"
                                                placeholder=""
                                                required
                                                className={`form-control ${getInputClasses(formik, "dateFormat")}`}
                                                {...formik.getFieldProps("dateFormat")}>
                                                <option value="DD-MM-YYYY"> DD-MM-YYYY</option>
                                            </Form.Control>
                                            {formik.touched.dateFormat && formik.errors.dateFormat ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.dateFormat}
                                                </div>
                                            ) : null}
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.PREFERENCES.DETAULTTIMEZONE" /></Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="timezone"
                                                placeholder=""
                                                required
                                                className={`form-control ${getInputClasses(formik, "timezone")}`}
                                                {...formik.getFieldProps("timezone")}>
                                                <option value="">...Select Timezone</option>
                                                {this.getTimeZoneOptions()}
                                            </Form.Control>
                                            {formik.touched.timezone && formik.errors.timezone ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.timezone}
                                                </div>
                                            ) : null}
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.PREFERENCES.LANGUAGE" /></Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="lang"
                                                placeholder=""
                                                required
                                                className={`form-control ${getInputClasses(formik, "lang")}`}
                                                {...formik.getFieldProps("lang")}>
                                                <option value="en"> English</option>
                                            </Form.Control>
                                            {formik.touched.lang && formik.errors.lang ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.lang}
                                                </div>
                                            ) : null}
                                        </Form.Group>

                                    </div>
                                    <br />

                                    <div className="preference-group p-3">
                                        <h3> COMMUNICATION PREFERENCES</h3>
                                        <br />
                                        <p>Choose how you would prefer to receive important notifications</p>
                                        {!user.roles.phone_verified && <p>Your phone number needs to be verified before you can opt into SMS notifications. <Link to="/phone-verification"><b>Click here to verify your phone number.</b></Link></p>}
                                        <table className="deposit-withdraw-table">
                                            <thead>
                                                <tr className="titles" style={{ display: "table-row" }}>
                                                    <th></th>
                                                    <th><center>Email</center></th>
                                                    <th><center>SMS</center></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="gray-cell">
                                                        Win Confirmation
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.win_confirmation.email}
                                                                {...formik.getFieldProps("notification_settings.win_confirmation.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.win_confirmation.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.win_confirmation.sms}
                                                                {...formik.getFieldProps("notification_settings.win_confirmation.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.win_confirmation.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="gray-cell">
                                                        Lose Confirmation
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.lose_confirmation.email}
                                                                {...formik.getFieldProps("notification_settings.lose_confirmation.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.lose_confirmation.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.lose_confirmation.sms}
                                                                {...formik.getFieldProps("notification_settings.lose_confirmation.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.lose_confirmation.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="gray-cell">
                                                        Wager Matched
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.wager_matched.email}
                                                                {...formik.getFieldProps("notification_settings.wager_matched.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.wager_matched.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.wager_matched.sms}
                                                                {...formik.getFieldProps("notification_settings.wager_matched.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.wager_matched.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="gray-cell">
                                                        No Match Found
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.no_match_found.email}
                                                                {...formik.getFieldProps("notification_settings.no_match_found.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.no_match_found.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.no_match_found.sms}
                                                                {...formik.getFieldProps("notification_settings.no_match_found.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.no_match_found.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="gray-cell">
                                                        Bet Forward Reminder
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.bet_forward_reminder.email}
                                                                {...formik.getFieldProps("notification_settings.bet_forward_reminder.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.bet_forward_reminder.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.bet_forward_reminder.sms}
                                                                {...formik.getFieldProps("notification_settings.bet_forward_reminder.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.bet_forward_reminder.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="gray-cell">
                                                        Deposit Confirmation
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.deposit_confirmation.email}
                                                                {...formik.getFieldProps("notification_settings.deposit_confirmation.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.deposit_confirmation.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.deposit_confirmation.sms}
                                                                {...formik.getFieldProps("notification_settings.deposit_confirmation.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.deposit_confirmation.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="gray-cell">
                                                        Withdraw Confirmation
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.withdraw_confirmation.email}
                                                                {...formik.getFieldProps("notification_settings.withdraw_confirmation.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.withdraw_confirmation.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.withdraw_confirmation.sms}
                                                                {...formik.getFieldProps("notification_settings.withdraw_confirmation.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.withdraw_confirmation.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="gray-cell">
                                                        Others
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.other.email}
                                                                {...formik.getFieldProps("notification_settings.other.email")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.other.email", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                    <td className="gray-cell">
                                                        <center>
                                                            <Checkbox
                                                                checked={formik.values.notification_settings.other.sms}
                                                                {...formik.getFieldProps("notification_settings.other.sms")}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("notification_settings.other.sms", e.target.checked);
                                                                }}
                                                                color="primary"
                                                            />
                                                        </center>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <button type="submit" className="clr-blue btn-smt">Save </button>
                                </form>
                            )}
                        </Formik>}
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
    notification_settings: state.frontend.notification_settings
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(Preferences))