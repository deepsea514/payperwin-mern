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
import { getInputClasses } from "../helpers/getInputClasses";
import { FormattedMessage } from 'react-intl';
import { submitDeposit } from '../redux/services';

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

class DepositETransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depositSchema: Yup.object().shape({
                amount: Yup.number()
                    .min(25, "Minimum Deposit Amount is 25 CAD.")
                    .max(3000, "Maximum Deposit Amount is 3,000 CAD."),
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required"),
                phone: Yup.string()
                    .required("Phone Number is required."),
                method: Yup.string(),
            }),
            depositSuccess: false,
            depositError: null,
        };
    }

    componentDidMount() {
        const title = 'Deposit with eTransfer';
        setTitle({ pageTitle: title })
    }

    onSubmit = (values, formik) => {
        submitDeposit(values)
            .then(() => {
                this.setState({ depositSuccess: true });
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ depositError: true });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { classes, user } = this.props;
        const { depositSchema, depositError, depositSuccess } = this.state;
        const initialValues = {
            amount: 0,
            email: (user ? user.email : ''),
            phone: (user ? user.phone : ''),
            method: 'eTransfer'
        };
        return (
            <div className="col-in">
                <h3><FormattedMessage id="PAGES.DEPOSIT.INTERAC.ETRANSFER.DEPOSIT" /></h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!depositSuccess && <div className={classes.formContent}>
                            <p className="dpsit"><FormattedMessage id="PAGES.DEPOSIT.CONFIRMINFORMATION" /></p>
                            {depositError && <p className="text-danger"><FormattedMessage id="PAGES.DEPOSIT.ERRORMSG" /></p>}
                            {user && <Formik
                                initialValues={initialValues}
                                validationSchema={depositSchema}
                                onSubmit={this.onSubmit}>
                                {
                                    (formik) => {
                                        return <form onSubmit={formik.handleSubmit}>
                                            <Form.Group>
                                                <Form.Label><FormattedMessage id="PAGES.DEPOSIT.AMOUNT" /></Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="amount"
                                                    placeholder="Enter Deposit Amount"
                                                    required
                                                    className={`form-control ${getInputClasses(formik, "amount")}`}
                                                    {...formik.getFieldProps("amount")}
                                                />
                                                {formik.touched.amount && formik.errors.amount ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.amount}
                                                    </div>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label><FormattedMessage id="PAGES.DEPOSIT.EMAIL" /></Form.Label>
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
                                                <Link
                                                    to={{ pathname: '/deposit' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="default"
                                                        className={classes.button}>
                                                        <FormattedMessage id="PAGES.BACK" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    disabled={formik.isSubmitting}
                                                    className={classes.button}
                                                >
                                                    <FormattedMessage id="PAGES.SUBMIT" />
                                                </Button>
                                            </div>
                                        </form>
                                    }
                                }
                            </Formik>}
                        </div>}
                        {depositSuccess && <div>
                            <center><h3><FormattedMessage id="PAGES.DEPOSIT.PENDING" /></h3></center>
                            <p><FormattedMessage id="PAGES.DEPOSIT.PENDINGMSG" values={{ email: <b style={{ borderBottom: '1px solid #000' }}>{user.email}</b> }} /></p>
                            <p>You will soon receive an email from <b>BNA Smart Payment System</b>. Please follow the link in their email to complete the deposit. Be sure to check your spam folder.</p>
                        </div>}
                    </div>
                </div>
                <fieldset className="depositFieldset">
                    <legend><FormattedMessage id="PAGES.DEPOSIT.INTERAC.LIMITS" /></legend>
                    <p><FormattedMessage id="PAGES.DEPOSIT.INTERAC.LIMITS.MIN" /></p>
                    <p><FormattedMessage id="PAGES.DEPOSIT.INTERAC.LIMITS.MAX" /></p>
                </fieldset>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(DepositETransfer));