import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { withStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core';
import { Form } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FormattedMessage } from 'react-intl';
import { getInputClasses } from "../helpers/getInputClasses";
import { phoneVerify } from '../redux/services';

const useStyles = (theme) => ({
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

class PhoneVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneVerificationSchema: Yup.object().shape({
                phone: Yup.string()
                    .required("Phone Number is required."),
            }),
            status: 'initial',
            values: null,
            verification_code: '',
            msg: '',
            veryfing: false,
        };
    }

    componentDidMount() {
        const title = 'Phone Verification';
        setTitle({ pageTitle: title })
    }

    onSubmit = (values, formik) => {
        this.setState({ values: values });
        this.sendVerificationCode(values, formik);
    }

    sendVerificationCode = (values, formik) => {
        phoneVerify(1, values)
            .then(() => {
                formik ? formik.setSubmitting(false) : null;
                this.setState({
                    status: 'codeSentSuccess',
                    msg: <>
                        <p><FormattedMessage id="PAGES.PHONEVERIFY.SENTNUMBER" />: {values.phone}</p>
                        <p><FormattedMessage id="PAGES.PHONEVERIFY.NOTRECEIVE" /> <a style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.sendVerificationCode(values, formik)}><FormattedMessage id="PAGES.PHONEVERIFY.RESEND" /></a></p>
                    </>
                });
            })
            .catch(() => {
                formik ? formik.setSubmitting(false) : null;
                this.setState({ status: 'codeSentError' });
            })
    }

    verifyCode = () => {
        const { verification_code } = this.state;
        const { getUser } = this.props;
        this.setState({ veryfing: true });

        phoneVerify(2, { verification_code })
            .then(() => {
                getUser();
                this.setState({ status: 'initial', msg: '' });
            })
            .catch(() => {
                this.setState({
                    msg: <>
                        <p><FormattedMessage id="PAGES.PHONEVERIFY.FAILED" /></p>
                        <p><a style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.sendVerificationCode(values, formik)}><FormattedMessage id="PAGES.PHONEVERIFY.RESEND" /></a></p>
                    </>
                });
            })
    }

    render() {
        const { classes, user } = this.props;
        const { phoneVerificationSchema, status, verification_code, msg, veryfing } = this.state;
        const initialValues = {
            phone: (user ? user.phone : ''),
        };
        return (
            <div className="col-in">
                <h3><FormattedMessage id="PAGES.PHONEVERIFY" /></h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        <Link
                            style={{ cursor: 'pointer', fontSize: 16 }}
                            to="/preferences">
                            <strong><i className="fas fa-chevron-left"></i> <FormattedMessage id="PAGES.PHONEVERIFY.BACKTO" /></strong>
                        </Link>
                        {(() => {
                            if (!user)
                                return <></>;
                            if (user.roles.phone_verified)
                                return (<h4 className="mt-2"><FormattedMessage id="PAGES.PHONEVERIFY.VERIFIED" /></h4>)
                            return (
                                <div className={`mt-2 ${classes.formContent}`}>
                                    <p className="dpsit"><FormattedMessage id="PAGES.PHONEVERIFY.CONFIRM" /></p>
                                    {status == 'codeSentError' && <p className="text-danger"><FormattedMessage id="PAGES.PHONEVERIFY.CANNOTSEND" /></p>}
                                    {user && <Formik
                                        initialValues={initialValues}
                                        validationSchema={phoneVerificationSchema}
                                        onSubmit={this.onSubmit}>
                                        {(formik) => {
                                            return <form onSubmit={formik.handleSubmit}>
                                                <Form.Group>
                                                    <Form.Label><FormattedMessage id="PAGES.DEPOSIT.PHONE" /></Form.Label>
                                                    <PhoneInput
                                                        type="text"
                                                        name="phone"
                                                        country="us"
                                                        placeholder="Enter Phone Number"
                                                        containerClass="input-group"
                                                        dropdownClass="input-group-append"
                                                        inputClass={`form-control ${getInputClasses(formik, "phone")}`}
                                                        required
                                                        value={formik.values.phone}
                                                        {...formik.getFieldProps("phone")}
                                                        {...{
                                                            onChange: (value, data, event, formattedValue) => {
                                                                formik.setFieldTouched('phone', true);
                                                                formik.setFieldValue('phone', formattedValue);
                                                            },
                                                            onBlur: () => {
                                                                formik.setFieldTouched('phone', true);
                                                            }
                                                        }}
                                                    />
                                                    {formik.touched.phone && formik.errors.phone ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.phone}
                                                        </div>
                                                    ) : null}
                                                </Form.Group>
                                                <div className={classes.formbutton}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit"
                                                        disabled={formik.isSubmitting}
                                                        className={classes.button}
                                                    >
                                                        Submit
                                                    </Button>
                                                </div>
                                            </form>
                                        }}
                                    </Formik>}

                                    {status != 'initial' && status != 'codeSentError' && <div className="modal confirmation">
                                        <div className="background-closer bg-modal" onClick={() => this.setState({ status: 'initial' })} />
                                        <div className="col-in">
                                            <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ status: 'initial' })} />
                                            <div>
                                                <br />
                                                <b><FormattedMessage id="PAGES.PHONEVERIFY.INPUT" /></b>
                                                <hr />
                                                {msg}
                                                <input
                                                    className="form-control"
                                                    value={verification_code}
                                                    onChange={(evt) => this.setState({ verification_code: evt.target.value })}
                                                />
                                                <div className="text-right">
                                                    <button className="form-button" onClick={this.verifyCode} disabled={veryfing}> <FormattedMessage id="PAGES.PHONEVERIFY.VERIFY" /> </button>
                                                    <button className="form-button ml-2" onClick={() => this.setState({ status: 'initial' })} disabled={veryfing}> <FormattedMessage id="PAGES.TRANSACTIONHISTORY.CANCEL" /> </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            )
                        })()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(PhoneVerification));