import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import {
    Grid, Select, Button, Card, CardContent, Input, OutlinedInput, Typography, FormLabel,
    CardHeader, TextField, MenuItem, InputLabel, FormControl, Stepper, Step, StepLabel,
    RadioGroup, FormControlLabel, Radio, Checkbox
} from '@material-ui/core';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import { setTitle } from '../libs/documentTitleBuilder';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import StepConnector from '@material-ui/core/StepConnector';
import clsx from 'clsx';

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
        email: false,
        password: false,
        cPassword: false,

        title: true,
        username: false,
        firstname: false,
        lastname: false,
        dateofbirth: false,

        currency: false,
        address: false,
        address2: false,
        city: false,
        postalcode: false,
        phone: false,

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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDirty = this.handleDirty.bind(this);
        this.recaptchaCallback = this.recaptchaCallback.bind(this);
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Sign Up' });
    }

    handleChange(e) {
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
                const currency = CountryInfo.find(country => e.target.value == country.country).currency;
                this.setState({
                    currency,
                    touched: { ...touched, currency: true, }
                });
            default:
                this.setState({
                    [e.target.name]: e.target.value,
                    touched: { ...touched, [e.target.name]: true, }
                });
        }
        this.handleDirty(e);
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
                    const url = `${serverUrl}/register`;
                    axios({
                        method: 'post',
                        url,
                        data: {
                            username, email, password, firstname, lastname,
                            country, currency, title, dateofbirth,
                            address, address2, city, postalcode, phone,
                            securityquiz, securityans, vipcode,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }).then((/* { data } */) => {
                        getUser();
                        history.replace({ pathname: '/' });
                    }).catch((err) => {
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
            country, email, password, cPassword,
            title, username, firstname, lastname, dateofbirth,
            currency, address, address2, city, postalcode, phone,
            securityquiz, securityans, vipcode, agreeTerms, agreePrivacy,
            rcptchVerified,
            errors,
        } = this.state;
        switch (activeStep) {
            case 0:
                return <>
                    <FormControl variant="standard" fullWidth margin="normal" required
                        error={errors.country !== undefined}>
                        <InputLabel htmlFor="country-select">Country</InputLabel>
                        <Select
                            name="country"
                            value={country}
                            onChange={this.handleChange}
                            onBlur={this.handleDirty}
                            input={
                                <Input
                                    label="Country *"
                                    name="country"
                                    id="country-select"
                                />
                            }
                        >
                            {CountryInfo.map((country) => <MenuItem key={country.country} value={country.country}>{country.country}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.email !== undefined}
                        helperText={errors.email}
                        margin="normal"
                        type="email"
                        fullWidth
                        // variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.password !== undefined}
                        helperText={errors.password}
                        margin="normal"
                        type="password"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Password Confirmation"
                        name="cPassword"
                        value={cPassword}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.cPassword !== undefined}
                        helperText={errors.cPassword}
                        margin="normal"
                        type="password"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
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
                    <TextField
                        label="Username"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.username !== undefined}
                        helperText={errors.username}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="First Name"
                        name="firstname"
                        value={firstname}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.firstname !== undefined}
                        helperText={errors.firstname}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Last Name"
                        name="lastname"
                        value={lastname}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.lastname !== undefined}
                        helperText={errors.lastname}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        variant="outlined"
                        label="Birthday"
                        type="date"
                        value={dateofbirth}
                        name="dateofbirth"
                        margin="normal"
                        onBlur={this.handleDirty}
                        onChange={this.handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        required
                    />
                </>;
            case 2:
                return <>
                    <TextField
                        label="Country"
                        name="country"
                        value={country}
                        margin="normal"
                        type="text"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        InputProps={{
                            readOnly: true,
                        }}
                        required
                    />
                    <TextField
                        label="Currency"
                        name="currency"
                        value={currency}
                        error={errors.currency !== undefined}
                        helperText={errors.currency}
                        margin="normal"
                        type="text"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        InputProps={{
                            readOnly: true,
                        }}
                        required
                    />
                    <TextField
                        label="Home Address"
                        name="address"
                        value={address}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.address !== undefined}
                        helperText={errors.address}
                        margin="normal"
                        type="address"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Home Address line 2 (Optional)"
                        name="address2"
                        value={address2}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.address2 !== undefined}
                        helperText={errors.address2}
                        margin="normal"
                        type="address2"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                    />
                    <TextField
                        label="City"
                        name="city"
                        value={city}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.city !== undefined}
                        helperText={errors.city}
                        margin="normal"
                        type="city"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Postal Code"
                        name="postalcode"
                        value={postalcode}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.postalcode !== undefined}
                        helperText={errors.postalcode}
                        margin="normal"
                        type="postalcode"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Contact Number"
                        name="phone"
                        value={phone}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.phone !== undefined}
                        helperText={errors.phone}
                        margin="normal"
                        type="phone"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                </>;
            case 3:
                return <>
                    <TextField
                        label="Security Question"
                        name="securityquiz"
                        value={securityquiz}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.securityquiz !== undefined}
                        helperText={errors.securityquiz}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Security Answer"
                        name="securityans"
                        value={securityans}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.securityans !== undefined}
                        helperText={errors.securityans}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="How did you know about us? Do you have a VIP code?(optional)"
                        name="vipcode"
                        value={vipcode}
                        onChange={this.handleChange}
                        onBlur={this.handleDirty}
                        error={errors.vipcode !== undefined}
                        helperText={errors.vipcode}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                    />
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
                                    &nbsp;<Link to={'/terms-and-condition'}>Terms And Conditions</Link>&nbsp;
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
                                <span>I have read and agree to Pinnacle's
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
            <div className="content">
                <Grid container justify="center">
                    <Grid item xs={12} sm={10} md={10} lg={10}>
                        <Card style={{ backgroundColor: '#ffffff' }}>
                            <CardHeader
                                style={{ textAlign: 'center' }}
                                title="Registration"
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