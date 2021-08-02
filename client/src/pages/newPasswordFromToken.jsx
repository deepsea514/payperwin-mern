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
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import { setMeta } from '../libs/documentTitleBuilder';
import DocumentMeta from 'react-document-meta';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

const Form = ({
    password, // eslint-disable-line react/prop-types
    cPassword, // eslint-disable-line react/prop-types
    errors, // eslint-disable-line react/prop-types
    handleChange, // eslint-disable-line react/prop-types
    handleSubmit, // eslint-disable-line react/prop-types
    handleDirty, // eslint-disable-line react/prop-types
    message, // eslint-disable-line react/prop-types
}) => (
    <Grid container justify="center">
        <Grid item xs={12} sm={7} md={7} lg={7}>
            <Card style={{ backgroundColor: '#e0e0e0' }}>
                <CardHeader
                    style={{ textAlign: 'center' }}
                    title="Change Password"
                />
                <CardContent style={{ backgroundColor: '#f5f5f5' }}>
                    <TextField
                        label="New Password"
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
                    <TextField
                        label="New Password Confirmation"
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
                        required
                    />
                    {errors.server ? <div className="form-error">{errors.server}</div> : null}
                    {message ? <div className="form-message">{message}</div> : null}
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    </Grid>
);

const initState = {
    password: '',
    cPassword: '',
    errors: {},
    message: '',
    metaData: null
};

class NewPasswordFromToken extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initState };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDirty = this.handleDirty.bind(this);
    }

    componentDidMount() {
        const title = 'New Password';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit() {
        const { location: { search: queryParams }, history } = this.props;
        const { errors } = this.state;
        registrationValidation.validateFields(this.state)
            .then((result) => {
                if (result === true) {
                    const { password } = this.state;
                    const url = `${serverUrl}/newPasswordFromToken${queryParams}`;
                    axios({
                        method: 'post',
                        url,
                        data: {
                            password,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }).then(({ data }) => {
                        if (data) {
                            this.setState({ ...initState, message: data });
                            setTimeout(() => {
                                history.replace({ pathname: '/login' });
                            }, 2000);
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
            this.setState({ errors: errorsStateChange, message: undefined });
        });
    }

    render() {
        const { metaData } = this.state;
        return (
            <div className="content">
                {metaData && <DocumentMeta {...metaData} />}
                <Form
                    {...this.state}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    handleDirty={this.handleDirty}
                />
            </div>
        );
    }
}

export default NewPasswordFromToken;

NewPasswordFromToken.propTypes = {
    // match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};
