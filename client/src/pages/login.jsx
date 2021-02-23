import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';
import { Link, withRouter } from 'react-router-dom';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import UserContext from '../contexts/userContext';
import { setTitle } from '../libs/documentTitleBuilder';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

const Form = ({
    username, // eslint-disable-line react/prop-types
    password, // eslint-disable-line react/prop-types
    errors, // eslint-disable-line react/prop-types
    handleChange, // eslint-disable-line react/prop-types
    handleSubmit, // eslint-disable-line react/prop-types
    handleDirty, // eslint-disable-line react/prop-types
    recaptchaCallback, // eslint-disable-line react/prop-types
    pathNameLoginOrChat,
    closeModal,
}) => (
    <Grid container justify="center">
        <Grid item xs={12} sm={7} md={7} lg={7}>
            <Card style={{ backgroundColor: '#e0e0e0' }}>
                <CardHeader
                    style={{ textAlign: 'center' }}
                    title="Login"
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
                        variant="contained"
                        className="mt-3"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <div className="login-recovery">
                        <Link to="/usernameRecovery" onClick={closeModal}>
                            Forgot Username
                    </Link>{' '}
                        <Link to="/passwordRecovery" onClick={closeModal}>
                            Forgot Password
                    </Link>{' '}
                        <br />
                        <br />
                    - OR -
                    <br />
                    Don't have an account?
                    <Link to="/SignUp" onClick={closeModal} className="sign-up-button">
                            Sign Up
                    </Link>{' '}
                    </div>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

const initState = {
    username: '',
    password: '',
    rcptchVerified: false,
    errors: {},
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initState };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDirty = this.handleDirty.bind(this);
        this.recaptchaCallback = this.recaptchaCallback.bind(this);
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Login' });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(userContextValue) {
        const { history, location: { pathname }, closeModal } = this.props;
        const { getUser } = userContextValue;
        const { rcptchVerified, errors } = this.state;
        if (window.recaptchaSiteKey && !rcptchVerified) {
            this.setState({ errors: { ...errors, recaptcha: 'You must complete captcha' } });
            return;
        }

        registrationValidation.validateFields(this.state)
            .then((result) => {
                if (result === true) {
                    const { username, password } = this.state;
                    const url = `${serverUrl}/login`;
                    axios({
                        method: 'post',
                        url,
                        data: {
                            username,
                            password,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }).then((/* { data } */) => {
                        getUser();
                        if (pathname === '/login') {
                            history.replace({ pathname: '/' });
                        }
                        if (closeModal) {
                            closeModal();
                        }
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
        const { errors } = this.state;
        const { name } = e.target;
        registrationValidation.validateField(name, this.state).then((result) => {
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
        const { location: { pathname }, closeModal } = this.props;
        return (
            <UserContext.Consumer>
                {
                    userContextValue => (
                        <div className="content">
                            <Form
                                {...this.state}
                                handleChange={this.handleChange}
                                handleSubmit={() => this.handleSubmit(userContextValue)}
                                handleDirty={this.handleDirty}
                                recaptchaCallback={this.recaptchaCallback}
                                pathNameLoginOrChat={pathname === '/login' || pathname === '/chat/'}
                                closeModal={closeModal}
                            />

                        </div>
                    )
                }
            </UserContext.Consumer>
        );
    }
}

export default withRouter(Login);

Login.propTypes = {
    // match: PropTypes.object.isRequired,
    // location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};
