import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import {
    Grid, Button, Card, CardContent, FormLabel,
    CardHeader, FormControl, Stepper, Step, StepLabel,
    RadioGroup, FormControlLabel, Radio, Checkbox
} from '@material-ui/core';
import { Form } from "react-bootstrap";
import axios from 'axios';
import Recaptcha from 'react-recaptcha';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import { setTitle } from '../libs/documentTitleBuilder';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import StepConnector from '@material-ui/core/StepConnector';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateformat from "dateformat";
import clsx from 'clsx';
import { RegionDropdown } from 'react-country-region-selector';

const config = require('../../../config.json');
const serverUrl = config.appUrl;
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

const initState = {
    country: '',
    region: '',
    email: '',
    password: '',
    cPassword: '',

    title: 'Mr',
    username: '',
    firstname: '',
    lastname: '',
    dateofbirth: '',

    currency: '',
    address: '',
    address2: '',
    city: '',
    postalcode: '',
    phone: '',

    securityquiz: '',
    securityans: '',
    vipcode: '',
    agreeTerms: false,
    agreePrivacy: false,
    rcptchVerified: false,

    errors: {},
    touched: {
        country: false,
        region: false,
        email: false,
        password: false,
        cPassword: false,

        title: true,
        username: false,
        firstname: false,
        lastname: false,
        dateofbirth: true,

        currency: true,
        address: false,
        address2: false,
        city: false,
        postalcode: false,
        phone: true,

        securityquiz: false,
        securityans: false,
        vipcode: false,
    },
    activeStep: 0,
    steps: ['', '', '', ''],
};

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initState };
        // this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDirty = this.handleDirty.bind(this);
        this.recaptchaCallback = this.recaptchaCallback.bind(this);
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Sign Up' });
    }

    handleChange = (e) => {
        const { touched } = this.state;
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
                        currency,
                        region: '',
                        touched: { ...touched, currency: true, region: false }
                    });
                }
            default:
                this.setState({
                    [e.target.name]: e.target.value,
                    touched: { ...touched, [e.target.name]: true, }
                });
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

    handleSubmit() {
        const { getUser, history } = this.props;
        const { rcptchVerified, errors } = this.state;
        if (window.recaptchaSiteKey && !rcptchVerified) {
            this.setState({ errors: { ...errors, recaptcha: 'You must complete captcha' } });
            return;
        }
        registrationValidation.validateFields(this.state, { tags: ['registration'] })
            .then((result) => {

                if (result === true) {
                    const { username, email, password, firstname, lastname, country, currency,
                        title, dateofbirth, address, address2, city, postalcode, phone,
                        securityquiz, securityans, vipcode } = this.state;
                    axios.post(`${serverUrl}/register`,
                        {
                            username, email, password, firstname, lastname,
                            country, currency, title, dateofbirth: dateformat(dateofbirth, "yyyy-mm-dd"),
                            address, address2, city, postalcode, phone,
                            securityquiz, securityans, vipcode,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true,
                        }
                    )
                        .then((/* { data } */) => {
                            console.log("success");
                            getUser();
                            history.replace({ pathname: '/' });
                        })
                        .catch((err) => {
                            console.log(err);
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

    handleDirty(e) {
        // Handle Validation on touch
        const { errors } = this.state;
        const { name } = e.target;
        registrationValidation.validateField(name, this.state, { tags: ['registration'] }).then((result) => {
            const errorsStateChange = { ...errors, server: undefined };
            if (result === true) {
                errorsStateChange[name] = undefined;
            } else {
                errorsStateChange[name] = result;
            }
            this.setState({ errors: errorsStateChange });
        });
    }

    recaptchaCallback(/* response */) {
        const { errors } = this.state;
        this.setState({ rcptchVerified: true, errors: { ...errors, recaptcha: undefined } });
    }

    getStepContent = (activeStep) => {
        const {
            country, email, password, cPassword, region,
            title, username, firstname, lastname, dateofbirth,
            currency, address, address2, city, postalcode, phone,
            securityquiz, securityans, vipcode, agreeTerms, agreePrivacy,
            rcptchVerified,
            errors,
        } = this.state;
        switch (activeStep) {
            case 0:
                return <>
                    <Form.Group>
                        <Form.Label>Country</Form.Label>
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
                        <Form.Label>Region</Form.Label>
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
                        <Form.Label>Email address</Form.Label>
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
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Password"
                            isInvalid={errors.password !== undefined}
                            required
                        />
                        {errors.password ? <div className="registration-feedback">{errors.password}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control
                            type="password"
                            name="cPassword"
                            value={cPassword}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Confirm Password"
                            isInvalid={errors.cPassword !== undefined}
                            required
                        />
                        {errors.cPassword ? <div className="registration-feedback">{errors.cPassword}</div> : null}
                    </Form.Group>
                </>;
            case 1:
                return <>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Title</FormLabel>
                        <RadioGroup row aria-label="gender" name="title" value={title} onChange={this.handleChange}>
                            <FormControlLabel value="Mr" control={<Radio />} label="Mr" />
                            <FormControlLabel value="Ms" control={<Radio />} label="Ms" />
                        </RadioGroup>
                    </FormControl>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={username}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter Username"
                            isInvalid={errors.username !== undefined}
                            required
                        />
                        {errors.username ? <div className="registration-feedback">{errors.username}</div> : null}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
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
                        <Form.Label>Last Name</Form.Label>
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
                        <Form.Label>Birthday</Form.Label>
                        <DatePicker
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
                </>;
            case 2:
                return <>
                    <Form.Group>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            name="country"
                            value={country}
                            required
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Currency</Form.Label>
                        <Form.Control
                            type="text"
                            name="currency"
                            value={currency}
                            required
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group>
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
                    </Form.Group>
                </>;
            case 3:
                return <>
                    <Form.Group>
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
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>How did you know about us? Do you have a VIP code?(optional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="vipcode"
                            value={vipcode}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            placeholder="Enter VIP Code"
                            isInvalid={errors.vipcode !== undefined}
                        />
                        {errors.vipcode ? <div className="registration-feedback">{errors.vipcode}</div> : null}
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
                                <span>I am at least 18 years of age (or the legal age applicable for my jurisdiction)
                                and have read and agreed to PayperWin's
                                    &nbsp;<Link to={'/terms-and-conditions'}>Terms And Conditions</Link>&nbsp;
                                    and
                                    &nbsp;<Link to={'/betting-rules'}>Betting Rules.</Link>&nbsp;</span>
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
                                <span>I have read and agree to PayPerWin's
                                    &nbsp;<Link to={'/privacy-policy'}>Privacy Policy</Link>
                                    .</span>
                            </div>
                        }
                    />
                    {
                        window.recaptchaSiteKey ? <Recaptcha
                            sitekey={window.recaptchaSiteKey}
                            render="explicit"
                            verifyCallback={this.recaptchaCallback}
                            onloadCallback={() => true}
                        /> : null
                    }
                    {errors.recaptcha ? <div className="form-error">{errors.recaptcha}</div> : null}
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
                    (errors.username || !touched.username) ||
                    (errors.firstname || !touched.firstname) ||
                    (errors.lastname || !touched.lastname) ||
                    (errors.dateofbirth || !touched.dateofbirth))
                    return true;
                return false;
            case 2:
                if ((errors.address || !touched.address) ||
                    (errors.city || !touched.city) ||
                    (errors.postalcode || !touched.postalcode) ||
                    (errors.phone || !touched.phone))
                    return true;
                return false;
            case 3:
                if ((errors.securityquiz || !touched.securityquiz) ||
                    (errors.securityans || !touched.securityans) ||
                    !agreeTerms || !agreePrivacy)
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

    render() {
        const { classes } = this.props;
        const { activeStep, steps, errors } = this.state;

        return (
            <div className="content pb-5">
                <Grid container justify="center">
                    <Grid item xs={12} sm={10} md={8} lg={6}>
                        <Card style={{ backgroundColor: '#ffffff' }}>
                            <CardHeader
                                style={{ textAlign: 'center' }}
                                title="Create Account"
                            />
                            <CardContent>
                                <div className={classes.root}>
                                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
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