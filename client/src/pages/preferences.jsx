import React, { Component } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import * as Yup from "yup";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { setPreferences } from "../redux/services";
import DocumentMeta from 'react-document-meta';
import { getInputClasses } from "../helpers/getInputClasses";
import { FormControl, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import { Link } from "react-router-dom";

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Preferences extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submitSuccess: false,
            submitError: false,
            metaData: null,
        }
    }

    componentDidMount() {
        const title = 'Preferences';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
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

    render() {
        const {
            oddsFormat,
            lang,
            dateFormat,
            timezone,
            display_mode,
            notify_email,
            notify_phone,
            user
        } = this.props;

        const initialValues = {
            oddsFormat,
            lang,
            dateFormat,
            timezone,
            display_mode: display_mode ? display_mode : 'light',
            notify_email: notify_email ? notify_email : 'yes',
            notify_phone: notify_phone ? notify_phone : 'no',
        };
        const { metaData } = this.state;

        const preferenceSchema = Yup.object().shape({
            oddsFormat: Yup.string()
                .required("You shuld select Odds Format."),
            timezone: Yup.string()
                .required("You shuld select Timezone."),
            dateFormat: Yup.string()
                .required("You shuld select Date Format."),
            lang: Yup.string()
                .required("You shuld select Language."),
            display_mode: Yup.string(),
            notify_email: Yup.string(),
            notify_phone: Yup.string(),
        });

        return (
            <React.Fragment>
                {metaData && <DocumentMeta {...metaData} />}
                <div className="col-in prfnce">
                    <h1 className="main-heading-in">Preferences</h1>
                    <div className="main-cnt mx-2">
                        {user && timezone && <Formik
                            initialValues={initialValues}
                            validationSchema={preferenceSchema}
                            onSubmit={this.onSubmit}>
                            {
                                (formik) => (
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="preference-group p-3">
                                            <h3> DISPLAY PREFERENCES</h3>
                                            <br />

                                            <Form.Group>
                                                <Form.Label>Odds display format</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="oddsFormat"
                                                    placeholder=""
                                                    required
                                                    className={`form-control ${getInputClasses(formik, "oddsFormat")}`}
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
                                                    className={`form-control ${getInputClasses(formik, "dateFormat")}`}
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
                                                    className={`form-control ${getInputClasses(formik, "timezone")}`}
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
                                                    className={`form-control ${getInputClasses(formik, "lang")}`}
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

                                            <Form.Group>
                                                <Form.Label>Display Mode</Form.Label>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        name="display_mode"
                                                        row
                                                        {...formik.getFieldProps("display_mode")}
                                                    >
                                                        <FormControlLabel value="light" control={<Radio />} label="Light Mode" />
                                                        <FormControlLabel value="dark" control={<Radio />} label="Dark Mode" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Form.Group>
                                        </div>
                                        <br />

                                        <div className="preference-group p-3">
                                            <h3> MARKETING PREFERENCES</h3>
                                            <br />
                                            <p>Choose how you would prefer to be informed about our promotions and our latest news.</p>

                                            <Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        name="notify_email"
                                                        row
                                                        {...formik.getFieldProps("notify_email")}
                                                    >
                                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Phone</Form.Label>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        name="notify_phone"
                                                        row
                                                        {...formik.getFieldProps("notify_phone")}
                                                    >
                                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                                    </RadioGroup>
                                                </FormControl>
                                                {!user.roles.phone_verified && <p>You should verify your phone number to get message with SMS. <Link to="/phone-verification"><b>Click here to verify your phone number.</b></Link></p>}
                                            </Form.Group>
                                        </div>

                                        <button type="submit" className="clr-blue btn-smt">Save </button>
                                    </form>
                                )
                            }
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
    display_mode: state.frontend.display_mode,
    notify_email: state.frontend.notify_email,
    notify_phone: state.frontend.notify_phone,
});

export default connect(mapStateToProps, frontend.actions)(Preferences)