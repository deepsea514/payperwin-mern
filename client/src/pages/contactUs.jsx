import React, { PureComponent, useRef } from 'react';
import axios from 'axios';
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

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

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

class ContactUs extends PureComponent {
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

        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            withCredentials: true,
        }

        axios.post(`${serverUrl}/submitticket`, postData, config)
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
        const { classes } = this.props;
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
            height: 250
        };
        return (
            <div className="col-in">
                <h3>Customer services</h3>
                <p>
                    The Customer Services email address is the primary contact for all Account, Betting and Payment related questions or issues.
                    Our customer service representatives are available to assist you by email 24 hours a day, 7 days a week.
                    If you are already a member, remember to use the email address registered to your PayperWin account, and to include your Phone Number.
                    You can also contact us by sending an email to: <a href="mailto:support@payperwin.co">support@payperwin.co</a>
                </p>
                <hr />
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!submitSuccess && <div className={classes.formContent}>
                            <h4>Get in touch with us</h4>
                            <br />
                            {submitError && <p className="text-danger">Submit failed. Please try again later</p>}
                            <Formik
                                initialValues={initialValues}
                                validationSchema={ticketSchema}
                                onSubmit={this.onSubmit}>
                                {
                                    (formik) => {
                                        const fileRef = useRef();
                                        return <form onSubmit={formik.handleSubmit}>
                                            <Form.Group>
                                                <Form.Label>Email address&nbsp;<span className="text-danger">*</span></Form.Label>
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
                                                <Form.Label>Phone Number&nbsp;<span className="text-danger">*</span></Form.Label>
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
                                                <Form.Label>Subject&nbsp;<span className="text-danger">*</span></Form.Label>
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
                                                <Form.Label>Department&nbsp;<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="department"
                                                    placeholder=""
                                                    required
                                                    className={`form-control ${getInputClasses(formik, "department")}`}
                                                    {...formik.getFieldProps("department")}
                                                >
                                                    <option value="">...</option>
                                                    <option>My Account</option>
                                                    <option>Betting enquiry</option>
                                                    <option>Deposit/Withdrawal</option>
                                                    <option>General Request</option>
                                                    <option>Affilliates</option>
                                                    <option>Marketing & Commercial</option>
                                                    <option>Feedback</option>
                                                </Form.Control>
                                                {formik.touched.department && formik.errors.department ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.department}
                                                    </div>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Description&nbsp;<span className="text-danger">*</span></Form.Label>
                                                <JoditEditor
                                                    config={config}
                                                    name="description"
                                                    tabIndex={1} // tabIndex of textarea
                                                    {...formik.getFieldProps("description")}
                                                    {...{
                                                        onChange: (description) => {
                                                            formik.setFieldError("description", false);
                                                            formik.setFieldTouched("description", true);
                                                            formik.setFieldValue("description", description);
                                                        },
                                                        onBlur: (description) => {
                                                            formik.setFieldError("description", false);
                                                            formik.setFieldTouched("description", true);
                                                            // formik.setFieldValue("description", description);
                                                        }
                                                    }}
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
                                                <Link
                                                    to={{ pathname: '/deposit' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="default"
                                                        className={classes.button}>
                                                        Back
                                                    </Button>
                                                </Link>
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
                                    }
                                }
                            </Formik>
                        </div>}
                        {submitSuccess && <div>
                            <center><h3>Thanks for contacting us!</h3></center>
                            <p>Your request has been sent for processing. please check your email for further information.</p>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(ContactUs));