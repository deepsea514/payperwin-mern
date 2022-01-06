import React from "react";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { sendPasswordRecovery } from "../redux/services";

class ForgotPasswordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: {
                email: '',
                password: '',
            },
            forgotSchema: Yup.object().shape({
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required"),
            }),
            errors: {}
        }
    }

    handleSubmit = (values, formik) => {
        const { errors } = this.state;

        sendPasswordRecovery(values.email)
            .then(({ data }) => {
                if (data) {
                    this.setState({ message: data });
                }
                formik.setSubmitting(false);
            }).catch((err) => {
                if (err.response) {
                    const { data } = err.response;
                    if (data.error) {
                        this.setState({ errors: { ...errors, server: data.error } });
                    }
                }
                this.setState({ errors: { ...errors, server: "Can't send request. Please try again." } });
                formik.setSubmitting(false);
            });
    }
    render() {
        const { closeModal, backToLogin } = this.props;
        const { initialValues, forgotSchema, errors, message } = this.state;

        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={closeModal} />
                <div className="dead-center login_modal_container">
                    <div className="contentBlock_modal overflow-hidden dead-center login_modal_content">
                        <div className="login_modal_main">
                            <div className="login_modal_context">
                                <div className="login_modal_leftbar">
                                    <i className="fal fa-times float-right" style={{ cursor: 'pointer', fontSize: '22px' }} onClick={closeModal} />
                                    <h1 className="loginTitle"><span><FormattedMessage id="COMPONENTS.PASSWORD_RECOVERY" /></span></h1>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={forgotSchema}
                                        onSubmit={this.handleSubmit}>
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
                                                                className="formElement"
                                                                autoComplete="off"
                                                                {...formik.getFieldProps("email")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="loginForgotPasswordWrapper">
                                                        <span><FormattedMessage id="PAGES.INBOX.BACKTOLOGIN" values={{ login: <a onClick={backToLogin} style={{ cursor: 'pointer', textDecoration: 'underline' }}><span style={{ textDecoration: 'underline', cursor: 'pointer' }}><span><FormattedMessage id="COMPONENTS.LOGIN" /></span></span></a> }} /></span>
                                                    </p>
                                                    {errors.server ? <div className="form-error">{errors.server}</div>
                                                        : errors.email ? <div className="form-error">{errors.email}</div>
                                                            : null
                                                    }
                                                    {message ? <div className="form-message">{message}</div> : null}
                                                    <div>
                                                        <button
                                                            className="loginButton fullWidthButton ellipsis mediumButton dead-center secondaryButton"
                                                            type="submit"
                                                            disabled={formik.touched.email && formik.errors.email || formik.isSubmitting}>
                                                            <span><FormattedMessage id="COMPONENTS.SUBMIT" /></span>
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

export default connect(null, frontend.actions)(withRouter(injectIntl(ForgotPasswordModal)));