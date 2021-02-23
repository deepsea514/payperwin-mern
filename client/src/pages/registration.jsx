import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
    Grid, Select, Button, Card, CardContent, OutlinedInput,
    CardHeader, TextField, MenuItem, InputLabel, FormControl
} from '@material-ui/core';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import { setTitle } from '../libs/documentTitleBuilder';
const config = require('../../../config.json');
const serverUrl = config.appUrl;
const CountryInfo = config.CountryInfo;

const Form = ({
    username, // eslint-disable-line react/prop-types
    email, // eslint-disable-line react/prop-types
    firstname, // eslint-disable-line react/prop-types
    lastname, // eslint-disable-line react/prop-types
    country, // eslint-disable-line react/prop-types
    currency, // eslint-disable-line react/prop-types
    password, // eslint-disable-line react/prop-types
    cPassword, // eslint-disable-line react/prop-types
    errors, // eslint-disable-line react/prop-types
    handleChange, // eslint-disable-line react/prop-types
    handleSubmit, // eslint-disable-line react/prop-types
    handleDirty, // eslint-disable-line react/prop-types
    recaptchaCallback, // eslint-disable-line react/prop-types
    CountryInfo, // eslint-disable-line react/prop-types
}) => (
    <Grid container justify="center">
        <Grid item xs={12} sm={7} md={7} lg={7}>
            <Card style={{ backgroundColor: '#e0e0e0' }}>
                <CardHeader
                    style={{ textAlign: 'center' }}
                    title="Sign Up"
                />
                <CardContent style={{ backgroundColor: '#f5f5f5' }}>
                    <TextField
                        label="Username"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        onBlur={handleDirty}
                        error={errors.username !== undefined}
                        helperText={errors.username}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleDirty}
                        error={errors.email !== undefined}
                        helperText={errors.email}
                        margin="normal"
                        type="email"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="First Name"
                        name="firstname"
                        value={firstname}
                        onChange={handleChange}
                        onBlur={handleDirty}
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
                        onChange={handleChange}
                        onBlur={handleDirty}
                        error={errors.lastname !== undefined}
                        helperText={errors.lastname}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    <FormControl variant="outlined" fullWidth margin="normal" required
                        error={errors.country !== undefined}>
                        <InputLabel htmlFor="country-select">Country</InputLabel>
                        <Select
                            name="country"
                            value={country}
                            onChange={handleChange}
                            onBlur={handleDirty}
                            input={
                                <OutlinedInput
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
                        label="Currency"
                        name="currency"
                        value={currency}
                        onChange={handleChange}
                        onBlur={handleDirty}
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
                        label="Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        onBlur={handleDirty}
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
                        onChange={handleChange}
                        onBlur={handleDirty}
                        error={errors.cPassword !== undefined}
                        helperText={errors.cPassword}
                        margin="normal"
                        type="password"
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        required
                    />
                    {
                        window.recaptchaSiteKey ? <Recaptcha
                            sitekey={window.recaptchaSiteKey}
                            render="explicit"
                            verifyCallback={recaptchaCallback}
                            onloadCallback={() => true}
                        /> : null
                    }
                    {errors.recaptcha ? <div className="form-error">{errors.recaptcha}</div> : null}
                    {errors.server ? <div className="form-error">{errors.server}</div> : null}
                    <Button
                        className="mt-3"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

const initState = {
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    country: '',
    currency: '',
    password: '',
    cPassword: '',
    rcptchVerified: false,
    errors: {},
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
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name == "country") {
            const currency = CountryInfo.find(country => e.target.value == country.country).currency;
            this.setState({ currency });
        }
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
                    const { username, email, password, firstname, lastname, country, currency } = this.state;
                    const url = `${serverUrl}/register`;
                    axios({
                        method: 'post',
                        url,
                        data: {
                            username,
                            email,
                            password,
                            firstname,
                            lastname,
                            country,
                            currency
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

    render() {
        return (
            <div className="content">
                <Form
                    {...this.state}
                    CountryInfo={CountryInfo}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    handleDirty={this.handleDirty}
                    recaptchaCallback={this.recaptchaCallback}
                />
            </div>
        );
    }
}

export default withRouter(Registration);

Registration.propTypes = {
    getUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};
