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
import Iframe from 'react-iframe';
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

class DepositTripleA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depositSchema: Yup.object().shape({
                amount: Yup.number()
                    .min(5, "Minimum Deposit Amount is 5 CAD.")
                    .max(50000, "Maximum Deposit Amount is 50,000 CAD."),
                email: Yup.string()
                    .email("Wrong email format")
                    .required("Email is required"),
                phone: Yup.string()
                    .required("Phone Number is required."),
                method: Yup.string(),
            }),
            depositSuccess: false,
            depositError: null,
            hosted_url: null,
        };
    }

    componentDidMount() {
        const { method } = this.props;
        const title = `Deposit with ${method}`;
        setTitle({ pageTitle: title })
    }

    onSubmit = (values, formik) => {
        submitDeposit(values)
            .then(({ data }) => {
                formik.setSubmitting(false);
                this.setState({ depositSuccess: true, hosted_url: data.hosted_url });
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ depositError: true });
            })
    }

    render() {
        const { classes, user, method } = this.props;
        const { depositSchema, depositError, depositSuccess, hosted_url } = this.state;
        const initialValues = {
            amount: 0,
            email: (user ? user.email : ''),
            phone: (user ? user.phone : ''),
            method
        };
        return (
            <div className="col-in">
                <h3>{method} <FormattedMessage id="COMPONENTS.SIDEBAR.DEPOSIT" /></h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!depositSuccess && <div className={classes.formContent}>
                            <p className="dpsit"><FormattedMessage id="PAGES.DEPOSIT.CONFIRMINFORMATION_BTC" /></p>
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
                        {depositSuccess && !hosted_url && <div>
                            <center><h3><FormattedMessage id="PAGES.DEPOSIT.PENDING" /></h3></center>
                            <p><FormattedMessage id="PAGES.DEPOSIT.PENDINGMSG" values={{ email: <b style={{ borderBottom: '1px solid #000' }}>{user.email}</b> }} /></p>
                        </div>}
                        {depositSuccess && hosted_url && <div>
                            <Iframe url={hosted_url}
                                width="100%"
                                height="600px"
                                display="initial"
                                position="relative" />
                        </div>}
                    </div>
                </div>
                <fieldset className="depositFieldset">
                    <legend>{method} Deposit Limits</legend>
                    <p>Minumum Deposit: CAD 5.00</p>
                    <p>Maximum Deposit: CAD 50,000.00</p>
                </fieldset>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(DepositTripleA));