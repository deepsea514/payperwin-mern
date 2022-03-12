import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { connect } from "react-redux";
import { login } from "../redux/services";

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: {
                email: '',
                password: '',
            },
            loginSchema: Yup.object().shape({
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required."),
                password: Yup.string()
                    .required("Password is required"),
            }),
            errors: {},
            passType: 'password',
        }
    }

    handleLogin = (values, formik) => {
        const { getUser, closeModal } = this.props;
        login(values)
            .then(({ data: { success, error, accessToken } }) => {
                if (success) {
                    localStorage.setItem("affiliate-token", accessToken);
                    getUser();
                    closeModal();
                } else {
                    this.setState({ errors: { server: 'Submit Failed.' } })
                }
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ errors: { server: 'Submit Failed.' } })
                formik.setSubmitting(false);
            })
    }

    render() {
        const { closeModal } = this.props;
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
                                    <h1 className="loginTitle"><span>Log in</span></h1>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={loginSchema}
                                        onSubmit={this.handleLogin}>
                                        {(formik) => {
                                            return <form onSubmit={formik.handleSubmit}>
                                                <div className="loginFormWrapper">
                                                    <div className="formField medium primary">
                                                        <label className="formFieldLabel"><span>Email</span></label>
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
                                                        <label className="formFieldLabel"><span>Password</span></label>
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
                                                    {errors.server ? <div className="form-error">{errors.server}</div>
                                                        : errors.email ? <div className="form-error">{errors.email}</div>
                                                            : errors.password ? <div className="form-error">{errors.password}</div> : null
                                                    }
                                                    <div>
                                                        <button
                                                            className="loginButton fullWidthButton ellipsis mediumButton dead-center secondaryButton"
                                                            type="submit"
                                                            disabled={formik.touched.email && formik.errors.email || formik.touched.password && formik.errors.password || formik.isSubmitting}>
                                                            <span>Log in</span>
                                                        </button>
                                                    </div>
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

export default connect(null, null)(LoginModal);