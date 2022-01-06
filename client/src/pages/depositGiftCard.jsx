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

class DepositGiftCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depositSchema: Yup.object().shape({
                card_number: Yup.string()
                    .required("Card Number is required"),
                method: Yup.string()
            }),
            depositSuccess: false,
            depositError: null,
        };
    }

    componentDidMount() {
        const title = 'Deposit with GiftCard';
        setTitle({ pageTitle: title })
    }

    onSubmit = (values, formik) => {
        const { getUser } = this.props;
        submitDeposit(values)
            .then(({ data }) => {
                const { success, message } = data;
                if (success) {
                    getUser();
                    this.setState({ depositSuccess: message });
                } else {
                    this.setState({ depositError: message });
                }
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ depositError: 'Cannnot redeem gift card. Please try again later.' });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { classes, user } = this.props;
        const { depositSchema, depositError, depositSuccess } = this.state;
        const initialValues = {
            card_number: '',
            method: 'giftcard'
        };
        return (
            <div className="col-in">
                <h3>Use Gift Card</h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!depositSuccess && <div className={classes.formContent}>
                            <p className="dpsit"><FormattedMessage id="PAGES.DEPOSIT.CONFIRMINFORMATION" /></p>
                            {depositError && <p className="text-danger">{depositError}</p>}
                            {user && <Formik
                                initialValues={initialValues}
                                validationSchema={depositSchema}
                                onSubmit={this.onSubmit}>
                                {(formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Card Number</Form.Label>
                                            <Form.Control
                                                type="card_number"
                                                name="card_number"
                                                placeholder="Enter Card Number"
                                                required
                                                className={`form-control ${getInputClasses(formik, "card_number")}`}
                                                {...formik.getFieldProps("card_number")}
                                            />
                                            {formik.touched.card_number && formik.errors.card_number ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.card_number}
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
                                }}
                            </Formik>}
                        </div>}
                        {depositSuccess && <div>
                            <center><h3>{depositSuccess}</h3></center>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(DepositGiftCard));