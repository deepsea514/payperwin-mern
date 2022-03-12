import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import {
    Grid, Button, Card, CardContent, CardHeader, Stepper, Step, StepLabel,
    FormControlLabel, Checkbox, RadioGroup, Radio
} from '@material-ui/core';
import { Form, InputGroup } from "react-bootstrap";
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import { setTitle } from '../libs/documentTitleBuilder';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import StepConnector from '@material-ui/core/StepConnector';
import dateformat from "dateformat";
import clsx from 'clsx';
import { RegionDropdown } from 'react-country-region-selector';
import _ from 'lodash';
import GoogleLogin from "react-google-login";
import CustomDatePicker from '../components/customDatePicker';
import { FormattedMessage } from 'react-intl';
import config from '../../../config.json';
import { googleRegister, register, visitAffiliate } from '../redux/services';
const CountryInfo = config.CountryInfo;

const useStyles = (theme) => ({
    root: {
        width: '100%',
    },
    formContent: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    formbutton: {
        marginTop: theme.spacing(3),
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
});

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
        zIndex: 0,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
});

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons = {
        1: <span>1</span>,
        2: <span>2</span>,
        3: <span>3</span>,
        4: <span>4</span>,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

class Registration extends Component {
    constructor(props) {
        super(props);
        const { search } = window.location;
        const params = new URLSearchParams(search);
        const invite = params.get('invite');
        const referrer = params.get('referrer');

        const initState = {
            country: 'Canada',
            region: '',
            email: '',
            password: '',
            cPassword: '',

            title: 'Mr',
            firstname: '',
            lastname: '',
            dateofbirth: '',

            currency: 'CAD',
            address: '',
            address2: '',
            city: '',
            postalcode: '',
            phone: '',
            pro_mode: 'false',

            securityquiz: '',
            securityans: '',
            referral_code: referrer ? referrer : (invite ? invite : ''),
            agreeTerms: false,
            agreePrivacy: false,
            rcptchVerified: false,

            errors: {},
            touched: {
                country: true,
                region: false,
                email: false,
                password: false,
                cPassword: false,

                title: true,
                firstname: false,
                lastname: false,
                dateofbirth: true,

                currency: true,

                // securityquiz: false,
                // securityans: false,
                referral_code: false,
            },
            activeStep: 0,
            steps: ['1', '2'],
            showPass: false,
            showPassConfirm: false,
        };
        this.state = {
            ...initState,
            invite: invite,
            referrer: referrer,
        };

        if (referrer) {
            visitAffiliate(referrer).then(() => { }).catch(() => { })
        }
    }

    componentDidMount() {
        const title = 'Registration';
        setTitle({ pageTitle: title })
    }

    handleChange = (e) => {
        const { touched } = this.state;
        let isReturn = false;
        switch (e.target.name) {
            case "agreeTerms":
            case "agreePrivacy":
                this.setState({
                    [e.target.name]: e.target.checked,
                    touched: { ...touched, [e.target.name]: true, }
                });
                break;
            case "country":
                const country = CountryInfo.find(country => e.target.value == country.country);
                if (country) {
                    const currency = country.currency;
                    this.setState({
                        country: e.target.value,
                        currency,
                        region: '',
                        touched: { ...touched, country: true, currency: true, region: false }
                    });
                }
                break;
            case "referral_code":
                isReturn = true;
            default:
                this.setState({
                    [e.target.name]: e.target.value,
                    touched: { ...touched, [e.target.name]: true, }
                });
                if (isReturn) return;
        }
        this.handleDirty(e);
    }

    handleChangeSpec = async (field, value) => {
        const { touched } = this.state;
        await this.setState({
            [field]: value,
            touched: { ...touched, [field]: true, }
        });

        const { errors } = this.state;
        registrationValidation.validateField(field, this.state, { tags: ['registration'] }).then((result) => {
            const errorsStateChange = { ...errors, server: undefined };
            if (result === true) {
                errorsStateChange[field] = undefined;
            } else {
                errorsStateChange[field] = result;
            }
            this.setState({ errors: errorsStateChange });
        });
    }

    handleSubmit = () => {
        const { getUser, history } = this.props;
        const { rcptchVerified, errors } = this.state;
        if (window.recaptchaSiteKey && !rcptchVerified) {
            this.setState({ errors: { ...errors, recaptcha: 'You must complete captcha' } });
            return;
        }
        registrationValidation.validateFields(this.state, { tags: ['registration'] })
            .then((result) => {
                if (result === true) {
                    const { email, password, firstname, lastname, country, currency, region,
                        title, dateofbirth, referral_code, invite, pro_mode, referrer } = this.state;

                    register({
                        email, password, firstname, lastname, region,
                        country, currency, title, dateofbirth: dateformat(dateofbirth, "yyyy-mm-dd"),
                        referral_code, invite, pro_mode, referrer
                    })
                        .then((/* { data } */) => {
                            getUser();
                            history.replace({ pathname: '/' });
                        })
                        .catch((err) => {
                            if (err.response) {
                                const { data } = err.response;
                                if (data.error) {
                                    this.setState({ errors: { ...errors, server: data.error } });
                                }
                            }
                        });
                } else {
                    this.setState({
                        errors: result,
                    });
                }
            })
            .catch((err) => {
                this.setState({ errors: err });
            });
    }

    handleDirty = (e) => {
        // Handle Validation on touch
        const { errors } = this.state;
        const { name, value } = e.target;
        registrationValidation.validateField(name, { ...this.state, [name]: value }, { tags: ['registration'] }).then((result) => {
            const errorsStateChange = { ...errors, server: undefined };
            if (result === true) {
                errorsStateChange[name] = undefined;
            } else {
                errorsStateChange[name] = result;
            }
            this.setState({ errors: errorsStateChange });
        });
    }

    recaptchaCallback = () => {
        const { errors } = this.state;
        this.setState({ rcptchVerified: true, errors: { ...errors, recaptcha: undefined } });
    }

    getStepContent = (activeStep) => {
        const {
            country, email, password, cPassword, region,
            firstname, lastname, dateofbirth, pro_mode,
            agreeTerms, agreePrivacy, referral_code,
            errors, showPass, showPassConfirm
        } = this.state;

        switch (activeStep) {
            case 0:
                return <>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.PROFILE.COUNTRY" /></Form.Label>
                        <Form.Control
                            as="select"
                            name="country"
                            value={country}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            required
                            isInvalid={errors.country !== undefined}
                        >
                            <option value="">Please Choose Country...</option>
                            {CountryInfo.map((country) => <option key={country.country} value={country.country}>{country.country}</option>)}
                        </Form.Control>
                        {errors.country ? <div className="registration-feedback">{errors.country}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.PROFILE.REGION" /></Form.Label>
                        <RegionDropdown className="form-control"
                            country={country}
                            value={region}
                            name="region"
                            onChange={(val) => this.handleChangeSpec('region', val)}
                            valueType="short"
                        />
                        {errors.region ? <div className="registration-feedback">{errors.region}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.PROFILE.EMAIL" /></Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            isInvalid={errors.email !== undefined}
                            required
                        />
                        {errors.email ? <div className="registration-feedback">{errors.email}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.REGISTRATION.PASSWORD" /></Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPass ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                onBlur={this.handleDirty}
                                placeholder="Enter Password"
                                isInvalid={errors.password !== undefined}
                                required
                            />
                            <Button variant="text" color="primary" onClick={() => this.setState({ showPass: !showPass })}>
                                <i className={showPass ? "far fa-eye" : "far fa-eye-slash"} />
                            </Button>
                        </InputGroup>
                        {errors.password ? <div className="registration-feedback">{errors.password}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.REGISTRATION.PASSWORDCONFIRM" /></Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassConfirm ? "text" : "password"}
                                name="cPassword"
                                value={cPassword}
                                onChange={this.handleChange}
                                onBlur={this.handleDirty}
                                placeholder="Confirm Password"
                                isInvalid={errors.cPassword !== undefined}
                                required
                            />
                            <Button variant="text" color="primary" onClick={() => this.setState({ showPassConfirm: !showPassConfirm })}>
                                <i className={showPassConfirm ? "far fa-eye" : "far fa-eye-slash"} />
                            </Button>
                        </InputGroup>
                        {errors.cPassword ? <div className="registration-feedback">{errors.cPassword}</div> : null}
                    </Form.Group>
                </>;
            case 1:
                return <>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.PROFILE.FIRSTNAME" /></Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={firstname}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter First Name"
                            isInvalid={errors.firstname !== undefined}
                            required
                        />
                        {errors.firstname ? <div className="registration-feedback">{errors.firstname}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.PROFILE.LASTNAME" /></Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={lastname}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Last Name"
                            isInvalid={errors.lastname !== undefined}
                            required
                        />
                        {errors.lastname ? <div className="registration-feedback">{errors.lastname}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}><FormattedMessage id="PAGES.PROFILE.BIRTHDAY" /></Form.Label>
                        <CustomDatePicker
                            name="dateofbirth"
                            className="form-control"
                            wrapperClassName="input-group"
                            selected={dateofbirth}
                            onChange={(val) => this.handleChangeSpec('dateofbirth', val)}
                            placeholder="Enter Birthday"
                            isInvalid={errors.dateofbirth !== undefined}
                            required
                        />
                        {errors.dateofbirth ? <div className="registration-feedback">{errors.dateofbirth}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}>Customized Betting Experience</Form.Label>
                        <p>
                            If you are new to betting we will display the site in the BASIC VIEW, this provides a simplified betting experience.
                            Don't worry you can change your view anytime on the website. <br />
                            For those experienced with betting we recommend our PRO VIEW, this view has a available odds.
                        </p>
                        <RadioGroup row
                            aria-label="view"
                            name="pro_mode"
                            value={pro_mode}
                            onChange={(evt) => {
                                this.setState({ pro_mode: evt.target.value })
                            }}>
                            <FormControlLabel style={{ color: '#FFF' }} value="true" control={<Radio readOnly />} label="Pro View" />
                            <FormControlLabel style={{ color: '#FFF' }} value="false" control={<Radio readOnly />} label="Basic View" />
                        </RadioGroup>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label style={{ color: '#FFF' }}>Referral / Promotion Code (optional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="referral_code"
                            value={referral_code}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Referral Code"
                            isInvalid={errors.referral_code !== undefined}
                        />
                        {errors.referral_code ? <div className="registration-feedback">{errors.referral_code}</div> : null}
                    </Form.Group>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={agreeTerms}
                                onChange={this.handleChange}
                                name="agreeTerms"
                                color="primary"
                            />
                        }
                        margin="normal"
                        labelPlacement="end"
                        label={
                            <div>
                                <span className='text-white'>
                                    <FormattedMessage id="PAGES.REGISTRATION.AGREETERMS" values={{
                                        termslink: <Link to={'/terms-and-conditions'}><FormattedMessage id="PAGES.SELFEXCLUSION.TERMS" /></Link>,
                                        rulelink: <Link to={'/betting-rules'}><FormattedMessage id="COMPONENTS.BETTING.RULES" /></Link>
                                    }} />
                                </span>
                            </div>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={agreePrivacy}
                                onChange={this.handleChange}
                                name="agreePrivacy"
                                color="primary"
                            />
                        }
                        margin="normal"
                        labelPlacement="end"
                        label={
                            <div>
                                <span className='text-white'>
                                    <FormattedMessage id="PAGES.REGISTRATION.AGREEPRIVACY" values={{ privacylink: <Link to={'/privacy-policy'}><FormattedMessage id="COMPONENTS.PRIVACY_POLICY" /></Link> }} />
                                </span>
                            </div>
                        }
                    />
                    {/* {window.recaptchaSiteKey ? <Recaptcha
                        sitekey={window.recaptchaSiteKey}
                        render="explicit"
                        verifyCallback={this.recaptchaCallback}
                        onloadCallback={() => true}
                    /> : null}
                    {errors.recaptcha ? <div className="form-error">{errors.recaptcha}</div> : null} */}
                </>;
            case 2:
                return <>
                    {/* <Form.Group>
                        <Form.Label>Home Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={address}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Home Address"
                            isInvalid={errors.address !== undefined}
                            required
                        />
                        {errors.address ? <div className="registration-feedback">{errors.address}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Home Address line 2 (Optional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="address2"
                            value={address2}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Home Address 2"
                            isInvalid={errors.address2 !== undefined}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Home City</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={city}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Home City"
                            isInvalid={errors.city !== undefined}
                            required
                        />
                        {errors.city ? <div className="registration-feedback">{errors.city}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="postalcode"
                            value={postalcode}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Postal Code"
                            isInvalid={errors.postalcode !== undefined}
                            required
                        />
                        {errors.postalcode ? <div className="registration-feedback">{errors.postalcode}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Contact Number</Form.Label>
                        <PhoneInput
                            type="text"
                            name="phone"
                            containerClass="input-group"
                            inputClass="form-control"
                            dropdownClass="input-group-append"
                            value={phone}
                            onChange={(phone) => this.setState({ phone })}
                            onBlur={this.handleDirty}
                            placeholder="Enter Contact Number"
                            isInvalid={errors.phone !== undefined}
                            required
                        />
                        {errors.phone ? <div className="registration-feedback">{errors.phone}</div> : null}
                    </Form.Group> */}
                </>;
            case 3:
                return <>
                    {/* <Form.Group>
                        <Form.Label>Security Question</Form.Label>
                        <Form.Control
                            type="text"
                            name="securityquiz"
                            value={securityquiz}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Security Question"
                            isInvalid={errors.securityquiz !== undefined}
                            required
                        />
                        {errors.securityquiz ? <div className="registration-feedback">{errors.securityquiz}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Security Answer</Form.Label>
                        <Form.Control
                            type="text"
                            name="securityans"
                            value={securityans}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Security Answer"
                            isInvalid={errors.securityans !== undefined}
                            required
                        />
                        {errors.securityans ? <div className="registration-feedback">{errors.securityans}</div> : null}
                    </Form.Group> */}

                </>;
            default:
                return 'Unknown step';
        }
    }

    checkDisabled = () => {
        const { agreeTerms, agreePrivacy, errors, activeStep, touched } = this.state;
        switch (activeStep) {
            case 0:
                if ((errors.country || !touched.country) ||
                    (errors.region || !touched.region) ||
                    (errors.email || !touched.email) ||
                    (errors.password || !touched.password) ||
                    (errors.cPassword || !touched.cPassword))
                    return true;
                return false;
            case 1:
                if ((errors.title || !touched.title) ||
                    (errors.firstname || !touched.firstname) ||
                    (errors.lastname || !touched.lastname) ||
                    (errors.dateofbirth || !touched.dateofbirth) ||
                    !agreeTerms || !agreePrivacy
                )
                    return true;
                return false;
            case 2:
                // if ((errors.address || !touched.address) ||
                //     (errors.city || !touched.city) ||
                //     (errors.postalcode || !touched.postalcode) ||
                //     (errors.phone || !touched.phone))
                // return true;
                return false;
            case 3:
                // if ((errors.securityquiz || !touched.securityquiz) ||
                //     (errors.securityans || !touched.securityans) ||
                //     !agreeTerms || !agreePrivacy)
                if (!agreeTerms || !agreePrivacy)
                    return true;
                return false;
            default:
                return true;
        }
    }

    handleNext = () => {
        const { activeStep, steps } = this.state;
        if (activeStep == steps.length - 1) {
            this.handleSubmit();
        }
        else {
            this.setState({ activeStep: activeStep + 1 });
        }
    };

    handleBack = () => {
        const { activeStep } = this.state;
        this.setState({ activeStep: activeStep - 1 });
    };

    handleReset = () => {
        this.setState({ activeStep: 0 });
    };

    handleGoogleSignupFail = (googleData) => {
        const { errors } = this.state;
        this.setState({ errors: { ...errors, server: googleData.error } });
    }

    handleGoogleSignup = (googleData) => {
        const { errors, invite, referrer } = this.state;
        const { getUser, history } = this.props;
        googleRegister(googleData.tokenId, invite, referrer)
            .then(() => {
                getUser();
                history.replace({ pathname: '/' });
            })
            .catch((err) => {
                if (err.response) {
                    const { data } = err.response;
                    if (data.error) {
                        this.setState({ errors: { ...errors, server: data.error } });
                    }
                }
            });
    }

    render() {
        const { classes } = this.props;
        const { activeStep, steps, errors } = this.state;

        return (
            <div className="content pb-5">
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={8} lg={6}>
                        <Card style={{ backgroundColor: '#1d1d1d' }}>
                            <CardHeader
                                style={{ textAlign: 'center', color: '#FFF' }}
                                title="Create Account"
                            />
                            <CardContent>
                                <div className={classes.root}>
                                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} style={{ backgroundColor: '#1d1d1d' }}>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel StepIconComponent={ColorlibStepIcon}>{ }</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    <div className={classes.formContent}>
                                        <div>
                                            {this.getStepContent(activeStep)}
                                            {errors.server ? <div className="form-error">{errors.server}</div> : null}
                                            <div className={classes.formbutton}>
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={this.handleBack}
                                                    variant="contained"
                                                    color="default"
                                                    className={classes.button}>
                                                    Back
                                                </Button>
                                                <Button
                                                    disabled={this.checkDisabled()}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleNext}
                                                    className={classes.button}
                                                >
                                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                </Button>
                                            </div>
                                        </div>
                                        <GoogleLogin
                                            clientId={config.googleClientID}
                                            buttonText="Sign up with Google"
                                            onSuccess={this.handleGoogleSignup}
                                            onFailure={this.handleGoogleSignupFail}
                                            cookiePolicy={'single_host_origin'}
                                            className="fullWidthButton ellipsis mediumButton dead-center mt-4"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(Registration));

Registration.propTypes = {
    getUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};