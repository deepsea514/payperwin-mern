import React, { PureComponent } from 'react';
import axios from 'axios';
import { setMeta } from '../libs/documentTitleBuilder';
import { withStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core';
import { Form } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DocumentMeta from 'react-document-meta';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

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

class DepositETransfer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            depositSchema: Yup.object().shape({
                amount: Yup.number()
                    .min(0, "Minimum Deposit Amount is 25 CAD.")
                    .max(3000, "Maximum Deposit Amount is 3000 CAD."),
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required"),
                phone: Yup.string()
                    .required("Phone Number is required."),
                method: Yup.string(),
            }),
            depositSuccess: false,
            depositError: null,
            metaData: null
        };
    }

    componentDidMount() {
        const title = 'Deposit with eTransfer';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
    }

    onSubmit = (values, formik) => {
        axios.post(`${serverUrl}/deposit`, values, { withCredentials: true })
            .then(() => {
                this.setState({ depositSuccess: true });
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ depositError: true });
                formik.setSubmitting(false);
            })
    }

    getInputClasses = (formik, fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }
        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }
        return "";
    };

    render() {
        const { classes, user } = this.props;
        const { depositSchema, depositError, depositSuccess, metaData } = this.state;
        const initialValues = {
            amount: 0,
            email: (user ? user.email : ''),
            phone: (user ? user.phone : ''),
            method: 'eTransfer'
        };
        return (
            <div className="col-in">
                {metaData && <DocumentMeta {...metaData} />}
                <h3>Interac e-Transfer Deposit</h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!depositSuccess && <div className={classes.formContent}>
                            <p className="dpsit">Please confirm the information below is correct.</p>
                            {depositError && <p className="text-danger">Can't make deposit. Please try again later</p>}
                            {user && <Formik
                                initialValues={initialValues}
                                validationSchema={depositSchema}
                                onSubmit={this.onSubmit}>
                                {
                                    (formik) => {
                                        return <form onSubmit={formik.handleSubmit}>
                                            <Form.Group>
                                                <Form.Label>Deposit Amount</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="amount"
                                                    placeholder="Enter Deposit Amount"
                                                    required
                                                    className={`form-control ${this.getInputClasses(
                                                        formik,
                                                        "amount"
                                                    )}`}
                                                    {...formik.getFieldProps("amount")}
                                                />
                                                {formik.touched.amount && formik.errors.amount ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.amount}
                                                    </div>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter Email"
                                                    required
                                                    className={`form-control ${this.getInputClasses(
                                                        formik,
                                                        "email"
                                                    )}`}
                                                    {...formik.getFieldProps("email")}
                                                />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.email}
                                                    </div>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Phone Number</Form.Label>
                                                <PhoneInput
                                                    type="text"
                                                    name="phone"
                                                    placeholder="Enter Phone Number"
                                                    containerClass="input-group"
                                                    dropdownClass="input-group-append"
                                                    inputClass={`form-control ${this.getInputClasses(
                                                        formik,
                                                        "phone"
                                                    )}`}
                                                    required
                                                    value={formik.values.phone}
                                                    {...formik.getFieldProps("phone")}
                                                    {...{
                                                        onChange: (phone) => {
                                                            formik.setFieldTouched('phone', true);
                                                            formik.setFieldValue('phone', phone);
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
                            </Formik>}
                        </div>}
                        {depositSuccess && <div>
                            <center><h3>Deposit Pending</h3></center>
                            <p>Your transaction has been sent for processing. please check your email for further information</p>
                        </div>}
                    </div>
                </div>
                <fieldset className="depositFieldset">
                    <legend>Interac E-Tranfer Deposit Limits</legend>
                    <p>Minumum Deposit: CAD 25.00</p>
                    <p>Maximum Deposit: CAD 3,000.00</p>
                </fieldset>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(DepositETransfer));