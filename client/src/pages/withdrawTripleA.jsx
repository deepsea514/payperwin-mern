import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Form } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { getInputClasses } from "../helpers/getInputClasses";
import { FormattedMessage } from 'react-intl';
import { checkFreeWithdraw, submitWithdraw } from '../redux/services';

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

class WithdrawTripleA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawSuccess: false,
            withdrawError: null,
            agreeWithdraw: false,
            errMsg: '',
            usedFreeWithdraw: false,
        };
    }

    componentDidMount() {
        const { method, user } = this.props;
        const title = `Withdraw with ${method}`;
        setTitle({ pageTitle: title })
        if (user) {
            this.getFreeWithdraw();
        }
    }

    getFreeWithdraw = () => {
        checkFreeWithdraw()
            .then(({ data }) => {
                this.setState({ usedFreeWithdraw: data.used });
            })
            .catch(() => {
                this.setState({ usedFreeWithdraw: true });
            });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.user && this.props.user) {
            this.getFreeWithdraw();
        }
    }

    onSubmit = (values, formik) => {
        const { getUser } = this.props;
        submitWithdraw(values)
            .then(({ data }) => {
                const { success, message } = data;
                if (success) {
                    this.setState({ withdrawSuccess: true });
                    getUser();
                }
                else {
                    this.setState({ withdrawError: true, errMsg: message });
                }
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ withdrawError: true, errMsg: "Can't make withdraw. Please try again later." });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { classes, user, method } = this.props;
        const { withdrawError, withdrawSuccess, agreeWithdraw, errMsg, usedFreeWithdraw } = this.state;
        const initialValues = {
            amount: 0,
            // wallet: '',
            method: method
        };
        const withdrawSchema = Yup.object().shape({
            amount: Yup.number()
                .min(15, "Minimum Withdraw Amount is 15 CAD.")
                .max(500000, `Maximum Withdraw Amount is 50,000 CAD.`),
            method: Yup.string(),
        });

        return (
            <div className="col-in">
                <h3>{method} Withdraw</h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!withdrawSuccess && <div className={classes.formContent}>
                            {withdrawError && <p className="text-danger" dangerouslySetInnerHTML={{ __html: errMsg }}></p>}
                            {user && <Formik
                                initialValues={initialValues}
                                validationSchema={withdrawSchema}
                                onSubmit={this.onSubmit}>
                                {(formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Withdraw Amount(CAD)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="amount"
                                                placeholder="Enter Withdraw Amount"
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
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={agreeWithdraw}
                                                    onChange={(e) => this.setState({ agreeWithdraw: e.target.checked })}
                                                    name="agreeWithdraw"
                                                    color="secondary"
                                                />
                                            }
                                            margin="normal"
                                            labelPlacement="end"
                                            label={
                                                <span>
                                                    {usedFreeWithdraw ? <FormattedMessage id="PAGES.WITHDRAW.COLLECTFEE" /> : <FormattedMessage id="PAGES.WITHDRAW.FREE" />}<br />
                                                    <FormattedMessage id="You may use any of your authorized withdrawal methods, subject to the specified minimum withdrawal amount." />
                                                </span>
                                            }
                                        />
                                        <div className={classes.formbutton}>
                                            <Link
                                                to={{ pathname: '/withdraw' }}>
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
                                                disabled={formik.isSubmitting || !agreeWithdraw}
                                                className={classes.button}
                                            >
                                                <FormattedMessage id="PAGES.SUBMIT" /> *
                                            </Button>
                                        </div>
                                        <div>
                                            <span className="dpsit"><strong>*<FormattedMessage id="PAGES.WITHDRAW.CLICKONLYONCE" /></strong> <FormattedMessage id="PAGES.WITHDRAW.GOINGBACK" values={{ method: method }} /></span>
                                        </div>
                                    </form>
                                }}
                            </Formik>}
                        </div>}
                        {withdrawSuccess && <div>
                            <center><h3><FormattedMessage id="PAGES.WITHDRAW.PENDING" /></h3></center>
                            <p>
                                <FormattedMessage id="PAGES.WITHDRAW.PENDING_DES" />
                            </p>
                            {/* <p>
                                For more information on withdrawing with {method} please click here
                            </p> */}
                        </div>}
                    </div>
                </div>
                <fieldset className="depositFieldset">
                    <legend><FormattedMessage id="PAGES.WITHDRAW.LIMIT" values={{ method: method }} /></legend>
                    <p><FormattedMessage id="PAGES.WITHDRAW.MINIMUM" />: CAD 25.00</p>
                    <p><FormattedMessage id="PAGES.WITHDRAW.MAXIMUM" />: CAD 50,000.00</p>
                </fieldset>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(WithdrawTripleA));