import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormControl, FormControlLabel, RadioGroup, Radio, Button } from "@material-ui/core";
import { Form, InputGroup } from "react-bootstrap";
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import { FormattedMessage } from 'react-intl';
import { changePassword, enable2FA } from '../redux/services';

class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enable_2fa: 'false',
            errors: {},
            touched: {
                oldPassword: false,
                password: false,
                cPassword: false,
            },
            oldPassword: '',
            password: '',
            cPassword: '',
            showOldPass: false,
            showPass: false,
            showPassConfirm: false,
            passwordChangeSuccess: false
        }
    }

    componentDidMount() {
        const title = 'Account Security';
        setTitle({ pageTitle: title })
    }

    getSnapshotBeforeUpdate(prevProps) {
        const { user } = this.props;
        return { enable_2fa: user ? true : false };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot.enable_2fa) {
            const { user } = this.props;
            const enable_2fa = user.roles.enable_2fa == true ? 'true' : 'false';
            if (prevState.enable_2fa != enable_2fa) {
                this.setState({ enable_2fa });
            }
        }
    }

    handle2FAChange = (evt) => {
        const { getUser } = this.props;
        const value = evt.target.value;
        this.setState({ enable_2fa: value });
        enable2FA(value)
            .then(() => {
                getUser();
            });
    }

    handleDirty = (e) => {
        // Handle Validation on touch
        const { errors } = this.state;
        const { name } = e.target;
        registrationValidation.validateField(name, this.state, { tags: ['changePassword'] }).then((result) => {
            const errorsStateChange = { ...errors, server: undefined };
            if (result === true) {
                errorsStateChange[name] = undefined;
            } else {
                errorsStateChange[name] = result;
            }
            this.setState({ errors: errorsStateChange });
        });
    }

    handleChange = (e) => {
        const { touched } = this.state;
        this.setState({
            [e.target.name]: e.target.value,
            touched: { ...touched, [e.target.name]: true, }
        });
        this.handleDirty(e);
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        const { getUser } = this.props;
        const { errors } = this.state;
        this.setState({ passwordChangeSuccess: false });
        registrationValidation.validateFields(this.state, { tags: ['changePassword'] })
            .then((result) => {
                if (result === true) {
                    const { oldPassword, password } = this.state;
                    changePassword(oldPassword, password)
                        .then((/* { data } */) => {
                            getUser();
                            this.setState({ passwordChangeSuccess: true });
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

    render() {
        const {
            enable_2fa,
            showOldPass,
            showPass,
            showPassConfirm,
            errors,
            passwordChangeSuccess,
            oldPassword,
            password,
            cPassword
        } = this.state;
        return (
            <div className="col-in">
                <h1 className="main-heading-in"><FormattedMessage id="COMPONENTS.PASSWORD.SECURITY" /></h1>
                <div className="main-cnt">
                    <div className="row">
                        <div className="col-12">
                            <div className="scrity mt-3 tab-card">
                                {/* <div className="card-header tab-card-header">
                                    <ul className="nav nav-tabs card-header-tabs" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link" id="one-tab" data-toggle="tab" href="#one" role="tab" aria-controls="One" aria-selected="true">PASSWORD AND SECURITY</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="two-tab" data-toggle="tab" href="#two" role="tab" aria-controls="Two" aria-selected="false">LAST LOGINS</a>
                                        </li>
                                    </ul>
                                </div> */}

                                <div className="tab-content">
                                    <div className="tab-pane fade show active p-3" id="one" role="tabpanel" aria-labelledby="one-tab">
                                        <form onSubmit={this.handleSubmit}>
                                            <h4 className="h4"><FormattedMessage id="PAGES.SECURITY.PASSWORD" /></h4>
                                            <Form.Group>
                                                <Form.Label><FormattedMessage id="PAGES.SECURITY.CURRENTPASSWORD" /></Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type={showOldPass ? "text" : "password"}
                                                        name="oldPassword"
                                                        value={oldPassword}
                                                        onChange={this.handleChange}
                                                        onBlur={this.handleDirty}
                                                        placeholder="Enter Old Password"
                                                        isInvalid={errors.oldPassword !== undefined}
                                                        required
                                                    />
                                                    <Button variant="text" color="secondary" onClick={() => this.setState({ showOldPass: !showOldPass })}>
                                                        <i className={showOldPass ? "far fa-eye" : "far fa-eye-slash"} />
                                                    </Button>
                                                </InputGroup>
                                                {errors.oldPassword ? <div className="registration-feedback">{errors.oldPassword}</div> : null}
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label><FormattedMessage id="PAGES.SECURITY.NEWPASSWORD" /></Form.Label>
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
                                                    <Button variant="text" color="secondary" onClick={() => this.setState({ showPass: !showPass })}>
                                                        <i className={showPass ? "far fa-eye" : "far fa-eye-slash"} />
                                                    </Button>
                                                </InputGroup>
                                                {errors.password ? <div className="registration-feedback">{errors.password}</div> : null}
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label><FormattedMessage id="PAGES.SECURITY.CONFIRMPASSWORD" /></Form.Label>
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
                                                    <Button variant="text" color="secondary" onClick={() => this.setState({ showPassConfirm: !showPassConfirm })}>
                                                        <i className={showPassConfirm ? "far fa-eye" : "far fa-eye-slash"} />
                                                    </Button>
                                                </InputGroup>
                                                {errors.cPassword ? <div className="registration-feedback">{errors.cPassword}</div> : null}
                                            </Form.Group>

                                            {errors.server ? <div className="form-error">{errors.server}</div> : null}
                                            {passwordChangeSuccess ? <div className="form-error text-success">Password changed successfully.</div> : null}
                                            <button type="submit" className="form-button">SAVE</button>
                                        </form>

                                        <br />
                                        <br />

                                        <h4 className="h4"><FormattedMessage id="PAGES.SECURITY.ENABLE2FA" /></h4>
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label="gender" name="gender1" value={enable_2fa} onChange={this.handle2FAChange}>
                                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="false" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                        {/* <h4 className="h4">SECURITY QUESTION AND ANSWER</h4>
                                            <div className="form-group">
                                                <label>Security question</label>
                                                <input type="text"
                                                    name="tkd"
                                                    placeholder="Tickets"
                                                    className="form-control" />
                                                <i
                                                    className="fas fa-check"></i>
                                                <i className="fa fa-info-circle"
                                                    aria-hidden="true"></i>
                                            </div>

                                            <div className="form-group">
                                                <label>Security Answer</label>
                                                <input type="text"
                                                    name="tkd"
                                                    placeholder="Tickets"
                                                    className="form-control" />
                                                <i
                                                    className="fas fa-check"></i>
                                                <i className="fa fa-info-circle"
                                                    aria-hidden="true"></i>
                                            </div>

                                            <button type="submit"
                                                className="btn-smt">save</button> */}
                                    </div>
                                    <div className="login-d tab-pane fade p-3"
                                        id="two" role="tabpanel"
                                        aria-labelledby="two-tab">
                                        <h4 className="h4">SUCCESSFUL LOGINS</h4>
                                        <div className="row bord-b">
                                            <div className="col-sm-8">Date and Time</div>

                                            <div className="col-sm-4">IP Address</div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-8">
                                                Thursday, April 30,
                                                2020, 16:57
                                            </div>

                                            <div className="col-sm-4">
                                                103.214.119.44
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-8">
                                                Thursday, April 30,
                                                2020, 10:22
                                            </div>

                                            <div className="col-sm-4">
                                                103.214.119.12
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-8">
                                                Thursday, April 30,
                                                2020, 09:57
                                            </div>
                                            <div className="col-sm-4">
                                                51.79.70.147
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Security;