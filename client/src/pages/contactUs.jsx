import React, { Component, useRef } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { withStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core';
import { Form } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import JoditEditor from "jodit-react";
import { getInputClasses } from "../helpers/getInputClasses";
import { FormattedMessage, injectIntl } from 'react-intl';
import { submitTicket } from '../redux/services';

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

class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketSchema: Yup.object().shape({
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required"),
                phone: Yup.string()
                    .required("Phone Number is required"),
                subject: Yup.string()
                    .required("Subject is required."),
                department: Yup.string()
                    .required("Department is required."),
                description: Yup.string()
                    .required("Description is required."),
                file: Yup.mixed()
            }),
            submitSuccess: false,
            submitError: null,
        };
    }

    componentDidMount() {
        const title = 'Customer Support';
        setTitle({ pageTitle: title })
    }

    onSubmit = (values, formik) => {
        let postData = new FormData();
        if (values.file) {
            postData.append("file", values.file, values.file.name);
        }
        delete values.file;

        const keys = Object.keys(values);
        keys.forEach(key => postData.append(key, values[key]));

        submitTicket(postData)
            .then(() => {
                this.setState({ submitSuccess: true });
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ submitError: true });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { classes, intl } = this.props;
        const { ticketSchema, submitError, submitSuccess } = this.state;
        const initialValues = {
            email: '',
            phone: '',
            subject: '',
            department: '',
            description: '',
            file: null,
        };
        const config = {
            readonly: false,
            height: 250,
            theme: 'custom'
        };
        return (
            <div className="col-in">
                <h3><FormattedMessage id="PAGES.CONTACTUS.CUSTOMER_SERVICE" /></h3>
                <p>
                    <FormattedMessage id="PAGES.CONTACTUS.CUSTOMER_SERVICE" />
                </p>
                <hr />
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!submitSuccess && <div className={classes.formContent}>
                            <h4><FormattedMessage id="PAGES.CONTACTUS.GETINTOUCH" /></h4>
                            <br />
                            {submitError && <p className="text-danger"><FormattedMessage id="PAGES.CONTACTUS.SUBMITFAILED" /></p>}
                            <Formik
                                initialValues={initialValues}
                                validationSchema={ticketSchema}
                                onSubmit={this.onSubmit}>
                                {(formik) => {
                                    const fileRef = useRef();
                                    return <form onSubmit={formik.handleSubmit}>
                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.DEPOSIT.EMAIL" />&nbsp;<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Enter Email"
                                                required
                                                className={`form-control ${getInputClasses(formik, "email")}`}
                                                {...formik.getFieldProps("email")}
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.email}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.DEPOSIT.PHONE" />&nbsp;<span className="text-danger">*</span></Form.Label>
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
                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.CONTACTUS.SUBJECT" />&nbsp;<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subject"
                                                placeholder=""
                                                required
                                                className={`form-control ${getInputClasses(formik, "subject")}`}
                                                {...formik.getFieldProps("subject")}
                                            />
                                            {formik.touched.subject && formik.errors.subject ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.subject}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.CONTACTUS.DEPARTMENT" />&nbsp;<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="department"
                                                placeholder=""
                                                required
                                                className={`form-control ${getInputClasses(formik, "department")}`}
                                                {...formik.getFieldProps("department")}
                                            >
                                                <option value="">...</option>
                                                <option value="My Account">{intl.formatMessage({ id: "PAGES.CONTACTUS.DEPARTMENT.MYACCOUNT" })}</option>
                                                <option value="Betting enquiry">{intl.formatMessage({ id: "PAGES.CONTACTUS.DEPARTMENT.BETTING" })}</option>
                                                <option value="Deposit/Withdrawal">{intl.formatMessage({ id: "PAGES.CONTACTUS.DEPARTMENT.DW" })}</option>
                                                <option value="General Request">{intl.formatMessage({ id: "PAGES.CONTACTUS.DEPARTMENT.GENERAL" })}</option>
                                                <option value="Affilliates">{intl.formatMessage({ id: "PAGES.CONTACTUS.DEPARTMENT.AFFILIATES" })}</option>
                                                <option value="Marketing & Commercial">{intl.formatMessage({ id: "PAGES.CONTACTUS.DEPARTMENT.MARKETING" })}</option>
                                                <option value="Feedback">{intl.formatMessage({ id: "PAGES.CONTACTUS.DEPARTMENT.FEEDBACK" })}</option>
                                            </Form.Control>
                                            {formik.touched.department && formik.errors.department ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.department}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label><FormattedMessage id="PAGES.CONTACTUS.DESCRIPTION" />&nbsp;<span className="text-danger">*</span></Form.Label>
                                            <textarea
                                                name="description"
                                                className={`form-control ${getInputClasses(formik, "department")}`}
                                                {...formik.getFieldProps("description")}
                                                rows={5}
                                                required
                                            />
                                            {formik.touched.description && formik.errors.description ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.description}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label style={{ cursor: 'pointer' }} onClick={() => fileRef.current.click()}>Attach file</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="file"
                                                ref={fileRef}
                                                hidden
                                                accept="image/x-png,image/gif,image/jpeg"
                                                {...{
                                                    onChange: (event) => {
                                                        formik.setFieldError("file", false);
                                                        formik.setFieldTouched("file", true);
                                                        formik.setFieldValue("file", event.target.files[0]);
                                                    }
                                                }}
                                            />
                                            {formik.touched.file && formik.errors.file ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.file}
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
                                                <FormattedMessage id="COMPONENTS.SUBMIT" />
                                            </Button>
                                        </div>
                                    </form>
                                }}
                            </Formik>
                        </div>}
                        {submitSuccess && <div>
                            <center><h3><FormattedMessage id="PAGES.CONTACTUS.THANKS" /></h3></center>
                            <p><FormattedMessage id="PAGES.CONTACTUS.REQUEST_PROCESSING" /></p>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(injectIntl(ContactUs)));