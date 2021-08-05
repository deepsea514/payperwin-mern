import React, { Component } from 'react';
import * as Yup from "yup";
import "../assets/css/pages/login/classic/login-1.css";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import axios from 'axios';
import { getInputClasses } from "../../helpers/getInputClasses";
const config = require('../../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;


const initialValues = {
    email: "",
    password: ""
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            isError: false
        }
    }

    componentDidMount() {
        this.checkUser();
    }

    checkUser = () => {
        const url = `${serverUrl}/user?compress=false`;
        axios.get(url, {
            withCredentials: true,
            cache: {
                exclude: {
                    filter: () => true,
                },
            },
        }).then(({ data: user }) => {
            this.props.history.push("/");
        })
    }

    onSubmit = (values, formik) => {
        formik.setSubmitting(true);
        this.setState({ isError: false });
        axios.post(`${serverUrl}/login`, values, { withCredentials: true })
            .then(({ data }) => {
                localStorage.setItem("admin-token", data.accessToken);
                formik.setSubmitting(false);
                this.props.history.push("/");
            }).catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    render() {
        const { loginSchema, isError } = this.state;
        return (
            <>
                <div className="d-flex flex-column flex-root" style={{ backgroundColor: '#273043' }}>
                    <div className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white">
                        <div className="d-flex flex-column flex-row-fluid position-relative p-7 overflow-hidden">
                            <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
                                <div className="login-form login-signin">
                                    <div className="text-center mb-10 mb-lg-20">
                                        <img src="/media/logos/payperwin-web-dark.png" />
                                        <h3 className="font-size-h1">Sign In</h3>
                                        <p className="text-muted font-weight-bold">Enter your email and password</p>
                                    </div>
                                    <Formik
                                        validationSchema={loginSchema}
                                        initialValues={initialValues}
                                        onSubmit={this.onSubmit}
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
                                                    <button type="submit" id="kt_login_signin_submit" className="btn btn-primary font-weight-bold px-9 py-4 my-3">Sign In</button>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}