import React, { Component } from 'react';
import * as Yup from "yup";
import "../assets/css/pages/login/classic/login-1.css";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../helpers/getInputClasses";
import { getUser, login, resend2FA, verify2FA } from '../redux/services';

const initialLoginValues = {
    email: "",
    password: ""
}

const initial2FAValues = {
    _2fa_code: ""
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _2fa_enabled: false,
            loginSchema: Yup.object().shape({
                email: Yup.string()
                    .email("Wrong email format")
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Email is required."),
                password: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Password is required."),
            }),
            _2faSchema: Yup.object().shape({
                _2fa_code: Yup.string()
                    .required("2FA code is required.")
            }),
            isError: false
        }
    }

    componentDidMount() {
        this.checkUser();
    }

    checkUser = () => {
        getUser().then(({ data: user }) => {
            this.props.history.push("/");
        })
    }

    onLoginSubmit = (values, formik) => {
        this.setState({ isError: false });
        login(values)
            .then(({ data: { _2fa_enabled, accessToken } }) => {
                localStorage.setItem("admin-token", accessToken);
                formik.setSubmitting(false);
                if (_2fa_enabled) {
                    this.setState({ _2fa_enabled });
                } else {
                    this.props.history.push("/");
                }
            }).catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    on2FASubmit = (values, formik) => {
        this.setState({ isError: false });

        verify2FA(values)
            .then(({ data: { success, accessToken } }) => {
                formik.setSubmitting(false);
                if (success) {
                    localStorage.setItem("admin-token", accessToken);
                    this.props.history.push("/");
                } else {
                    this.setState({ isError: true });
                }
            }).catch(() => {
                formik.setSubmitting(false);
                this.setState({ _2fa_enabled: false });
            })
    }

    resend2FACode = (formik) => {
        formik.setSubmitting(true);
        resend2FA()
            .then(() => {
                formik.setSubmitting(false);
            }).catch(() => {
                formik.setSubmitting(false);
                this.setState({ _2fa_enabled: false });
            })
    }

    render() {
        const { loginSchema, _2faSchema, isError, _2fa_enabled } = this.state;
        return (
            <>
                <div className="d-flex flex-column flex-root" style={{ backgroundColor: '#273043' }}>
                    <div className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white">
                        <div className="d-flex flex-column flex-row-fluid position-relative p-7 overflow-hidden">
                            <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
                                <div className="login-form login-signin">
                                    <div className="text-center mb-10 mb-lg-20">
                                        <img src="/images/logo-blue.png" />
                                        <h3 className="font-size-h1">Sign In</h3>
                                        {!_2fa_enabled && <p className="text-muted font-weight-bold">Enter your email and password</p>}
                                        {_2fa_enabled && <p className="text-muted font-weight-bold">We sent Two Factor Authorization code to your phone.</p>}
                                    </div>
                                    {!_2fa_enabled && <Formik
                                        validationSchema={loginSchema}
                                        initialValues={initialLoginValues}
                                        onSubmit={this.onLoginSubmit}
                                    >
                                        {(formik) => (
                                            <form onSubmit={formik.handleSubmit}>
                                                {isError && (
                                                    <div
                                                        className="alert alert-custom alert-light-danger fade show mb-10"
                                                        role="alert"
                                                    >
                                                        <div className="alert-icon">
                                                            <span className="svg-icon svg-icon-3x svg-icon-danger">
                                                                <SVG
                                                                    src={"/media/svg/icons/Code/Info-circle.svg"}
                                                                ></SVG>{" "}
                                                            </span>
                                                        </div>
                                                        <div className="alert-text font-weight-bold">
                                                            Invalid Username or Password
                                                        </div>
                                                        <div className="alert-close" onClick={() => this.setState({ isError: false })}>
                                                            <button
                                                                type="button"
                                                                className="close"
                                                                data-dismiss="alert"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">
                                                                    <i className="ki ki-close"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="form-group">
                                                    <input className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(formik, "email")}`}
                                                        {...formik.getFieldProps("email")}
                                                        autoComplete="off"
                                                        type="text" placeholder="email" name="email" />
                                                    {formik.touched.email && formik.errors.email ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.email}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="form-group">
                                                    <input className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(formik, "password")}`}
                                                        {...formik.getFieldProps("password")}
                                                        type="password" placeholder="Password" name="password" autoComplete="off" />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.password}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
                                                    <a href="#" className="text-dark-50 text-hover-primary my-3 mr-2" id="kt_login_forgot"></a>
                                                    <button
                                                        type="submit"
                                                        id="kt_login_signin_submit"
                                                        className="btn btn-primary font-weight-bold px-9 py-4 my-3"
                                                        disabled={formik.isSubmitting}
                                                    >Sign In</button>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>}

                                    {_2fa_enabled && <Formik
                                        validationSchema={_2faSchema}
                                        initialValues={initial2FAValues}
                                        onSubmit={this.on2FASubmit}
                                    >
                                        {(formik) => (
                                            <form onSubmit={formik.handleSubmit}>
                                                {isError && (
                                                    <div
                                                        className="alert alert-custom alert-light-danger fade show mb-10"
                                                        role="alert"
                                                    >
                                                        <div className="alert-icon">
                                                            <span className="svg-icon svg-icon-3x svg-icon-danger">
                                                                <SVG
                                                                    src={"/media/svg/icons/Code/Info-circle.svg"}
                                                                ></SVG>{" "}
                                                            </span>
                                                        </div>
                                                        <div className="alert-text font-weight-bold">
                                                            Invalid Code
                                                        </div>
                                                        <div className="alert-close" onClick={() => this.setState({ isError: false })}>
                                                            <button
                                                                type="button"
                                                                className="close"
                                                                data-dismiss="alert"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">
                                                                    <i className="ki ki-close"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="form-group">
                                                    <input className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(formik, "_2fa_code")}`}
                                                        {...formik.getFieldProps("_2fa_code")}
                                                        autoComplete="off"
                                                        type="text" placeholder="2FA Code" name="_2fa_code" />
                                                    {formik.touched._2fa_code && formik.errors._2fa_code ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors._2fa_code}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="form-group">
                                                    <p>Didn't receive code? <a onClick={() => this.resend2FACode(formik)} className="cursor-pointer text-primary">Resend Code.</a></p>
                                                </div>
                                                <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
                                                    <a href="#" className="text-dark-50 text-hover-primary my-3 mr-2" id="kt_login_forgot"></a>
                                                    <button type="submit"
                                                        id="kt_login_signin_submit"
                                                        className="btn btn-primary font-weight-bold px-9 py-4 my-3"
                                                        disabled={formik.isSubmitting}
                                                    >Submit</button>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}