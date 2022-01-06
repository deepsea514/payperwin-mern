import React from "react";
import GoogleLogin from "react-google-login";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import Recaptcha from 'react-recaptcha';
import config from '../../../config.json';
import { FormattedMessage, injectIntl } from 'react-intl';
import { googleLogin, login } from "../redux/services";
const recaptchaSiteKey = config.recaptchaSiteKey;

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        const { intl } = props;
        this.state = {
            initialValues: {
                email: '',
                password: '',
            },
            rcptchVerified: false,
            loginSchema: Yup.object().shape({
                email: Yup.string()
                    .email(intl.formatMessage({ id: 'PAGES.PROFILE.WTONGEMAIL' }))
                    .required(intl.formatMessage({ id: 'PAGES.PROFILE.EMAILREQUIRED' })),
                password: Yup.string()
                    .required(intl.formatMessage({ id: 'PAGES.PROFILE.PASSWORDREQUIRED' })),
            }),
            errors: {},
            passType: 'password',
        }
    }

    handleGoogleLoginFail = (googleData) => {
    }

    handleGoogleLogin = (googleData) => {
        const { closeModal, require2FAAction, getUser, loginFailed, setLoginFailedAction } = this.props;
        const { errors, rcptchVerified } = this.state;

        if (loginFailed >= 5 && !rcptchVerified) {
            this.setState({ errors: { ...errors, recaptcha: "You should complete Recaptcha." } });
            return;
        }

        googleLogin(googleData.tokenId)
            .then(({ data }) => {
                if (data._2fa_required == false) {
                    getUser();
                } else {
                    require2FAAction();
                }
                setLoginFailedAction(0);
                closeModal();
            }).catch((err) => {
                if (err.response) {
                    const { data } = err.response;
                    if (data.error) {
                        this.setState({ errors: { ...errors, server: data.error } });
                    }
                }
                setLoginFailedAction(loginFailed + 1);
            });
    }

    handleLogin = (values, formik) => {
        const { closeModal, require2FAAction, getUser, loginFailed, setLoginFailedAction, history } = this.props;
        const { errors, rcptchVerified } = this.state;

        if (loginFailed >= 5 && !rcptchVerified) {
            this.setState({ errors: { ...errors, recaptcha: "You should complete Recaptcha." } });
            formik.setSubmitting(false);
            return;
        }

        login(values)
            .then(({ data }) => {
                if (data._2fa_required == false) {
                    getUser((user) => {
                        if (user.autobet) {
                            history.push('autobet-dashboard');
                        }
                    });
                } else {
                    require2FAAction();
                }
                formik.setSubmitting(false);
                setLoginFailedAction(0);
                closeModal();
            }).catch((err) => {
                if (err.response) {
                    const { data } = err.response;
                    if (data.error) {
                        this.setState({ errors: { ...errors, server: data.error } });
                    }
                }
                formik.setSubmitting(false);
                setLoginFailedAction(loginFailed + 1)
            });
    }

    goTo = (pathname) => {
        const { closeModal, history } = this.props;
        closeModal();
        history.push(pathname);
    }

    recaptchaCallback = (response) => {
        const { errors } = this.state;
        this.setState({ rcptchVerified: true, errors: { ...errors, recaptcha: undefined } });
    }

    render() {
        const { closeModal, forgotPassword, loginFailed, intl } = this.props;
        const { initialValues, loginSchema, errors, passType } = this.state;

        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={closeModal} />
                <div className="dead-center login_modal_container">
                    <div className="contentBlock_modal overflow-hidden dead-center login_modal_content">
                        <div className="login_modal_main">
                            <div className="login_modal_context">
                                <div className="login_modal_leftbar">
                                    <i className="fal fa-times float-right" style={{ cursor: 'pointer', fontSize: '22px' }} onClick={closeModal} />
                                    <h1 className="loginTitle"><span><FormattedMessage id="COMPONENTS.LOGIN" /></span></h1>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={loginSchema}
                                        onSubmit={this.handleLogin}>
                                        {(formik) => {
                                            return <form onSubmit={formik.handleSubmit}>
                                                <div className="loginFormWrapper">
                                                    <div className="formField medium primary">
                                                        <label className="formFieldLabel"><span><FormattedMessage id="PAGES.PROFILE.EMAIL" /></span></label>
                                                        <div className="formElementWrap">
                                                            <div className="leftIcon">
                                                                <i fill="currentColor" style={{ display: 'inline-block' }}>
                                                                    <svg fill="currentColor" height="16" width="16" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                                                                    </svg>
                                                                </i>
                                                            </div>
                                                            <input
                                                                maxLength="200"
                                                                type="email"
                                                                name="email"
                                                                placeholder="Email"
                                                                className="formElement"
                                                                autoComplete="off"
                                                                {...formik.getFieldProps("email")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="formField medium primary">
                                                        <label className="formFieldLabel"><span><FormattedMessage id="PAGES.REGISTRATION.PASSWORD" /></span></label>
                                                        <div className="formElementWrap">
                                                            <div className="leftIcon">
                                                                <i fill="currentColor" style={{ display: 'inline-block' }}>
                                                                    <svg fill="currentColor" height="16" width="16" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"> </path>
                                                                    </svg>
                                                                </i>
                                                            </div>
                                                            <input
                                                                maxLength="200"
                                                                type={passType}
                                                                name="password"
                                                                placeholder="Password"
                                                                className="formElement"
                                                                autoComplete="off"
                                                                {...formik.getFieldProps("password")}
                                                            />
                                                            <div className="leftIcon cursor-pointer" style={{ minWidth: '30px' }} onClick={() => this.setState({ passType: passType == 'password' ? 'text' : 'password' })}>
                                                                <i fill="currentColor" className={passType == 'password' ? "fas fa-eye" : "fas fa-eye-slash"} style={{ minWidth: '30px' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="loginForgotPasswordWrapper">
                                                        <span><FormattedMessage id="COMPONENTS.FORGOT.PASSWORD" values={{ password: <a onClick={forgotPassword} style={{ cursor: 'pointer', textDecoration: 'underline' }}><span style={{ textDecoration: 'underline', cursor: 'pointer' }}><span><FormattedMessage id="PAGES.REGISTRATION.PASSWORD" /></span></span></a> }} />?</span>
                                                    </p>
                                                    {errors.server ? <div className="form-error">{errors.server}</div>
                                                        : errors.email ? <div className="form-error">{errors.email}</div>
                                                            : errors.password ? <div className="form-error">{errors.password}</div> : null
                                                    }
                                                    {loginFailed >= 5 && <Recaptcha
                                                        className="fullWidthButton"
                                                        sitekey={recaptchaSiteKey}
                                                        render="explicit"
                                                        verifyCallback={this.recaptchaCallback}
                                                        onloadCallback={() => true} />}
                                                    {errors.recaptcha ? <div className="form-error">{errors.recaptcha}</div> : null}
                                                    <div>
                                                        <button
                                                            className="loginButton fullWidthButton ellipsis mediumButton dead-center secondaryButton"
                                                            type="submit"
                                                            disabled={formik.touched.email && formik.errors.email || formik.touched.password && formik.errors.password || formik.isSubmitting}>
                                                            <span><FormattedMessage id="COMPONENTS.LOGIN" /></span>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <GoogleLogin
                                                            clientId={config.googleClientID}
                                                            buttonText={intl.formatMessage({ id: "COMPONENTS.LOGIN.GOOGLE" })}
                                                            onSuccess={this.handleGoogleLogin}
                                                            onFailure={this.handleGoogleLoginFail}
                                                            cookiePolicy={'single_host_origin'}
                                                            className="fullWidthButton ellipsis mediumButton dead-center mt-2"
                                                        />
                                                    </div>
                                                    <p className="registerParaWrapper">
                                                        <span><FormattedMessage id="COMPONENTS.LOGIN.NOTMEMBER" /> <a onClick={() => this.goTo('/signup')} style={{ cursor: 'pointer', color: '#ED254E' }}><span><FormattedMessage id="COMPONENTS.JOIN.PPW" /></span></a>.</span>
                                                    </p>
                                                </div>
                                            </form>
                                        }}
                                    </Formik>
                                </div>
                            </div>
                            <div className="login_modal_rightbar">
                                <img className="login_modal_rightbar_logo" src="/images/logo-white.png" alt="PAYPERWIN" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loginFailed: state.frontend.loginFailed,
});


export default connect(mapStateToProps, frontend.actions)(withRouter(injectIntl(LoginModal)));