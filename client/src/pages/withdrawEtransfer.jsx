import React, { PureComponent } from 'react';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Form } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';

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

class WithdrawETransfer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            withdrawSuccess: false,
            withdrawError: null,
            agreeWithdraw: false,
        };
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Withdraw with eTransfer' });
    }

    onSubmit = (values, formik) => {
        axios.post(`${serverUrl}/withdraw`, values, { withCredentials: true })
            .then(() => {
                this.setState({ withdrawSuccess: true });
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ withdrawError: true });
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
        const { withdrawError, withdrawSuccess, agreeWithdraw } = this.state;
        const initialvalues = {
            amount: 0,
            method: 'eTransfer'
        };
        const balance = Number(user ? user.balance : 0);
        const balanceStr = balance.toFixed(2);
        const withdrawSchema = Yup.object().shape({
            amount: Yup.number()
                .min(0, "Minimum Withdraw Amount is 25 CAD.")
                .max(balance, `Maximum Withdraw Amount is ${balanceStr} CAD.`),
            method: Yup.string(),
        });
        return (
            <div className="col-in">
                <h3>Interac e-Transfer Withdraw</h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!withdrawSuccess && <div className={classes.formContent}>
                            <p className="dpsit mb-2">Please Note</p>
                            <p className="dpsit mt-0">An email will be sent to : {user ? user.email : ''} with instructions on how to claim your funds.</p>
                            {withdrawError && <p className="text-danger">Can't make withdraw. Please try again later</p>}
                            {user && <Formik
                                initialValues={initialvalues}
                                validationSchema={withdrawSchema}
                                onSubmit={this.onSubmit}>
                                {
                                    (formik) => {
                                        return <form onSubmit={formik.handleSubmit}>
                                            <Form.Group>
                                                <Form.Label>Withdraw Amount(CAD)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="amount"
                                                    placeholder="Enter Withdraw Amount"
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
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={agreeWithdraw}
                                                        onChange={(e) => this.setState({ agreeWithdraw: e.target.checked })}
                                                        name="agreeWithdraw"
                                                        color="primary"
                                                    />
                                                }
                                                margin="normal"
                                                labelPlacement="end"
                                                label={
                                                    <span>
                                                        This is your free withdrawal of the calendar month.
                                                        You may use any of your authorized withdrawal methods, subject to the specified minimum withdrawal amount.
                                                        All additional withdrawals during the calendar month, for any amount using any withdrawal method, will incur a fee.
                                                        Do you agree?
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
                                                        Back
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    disabled={formik.isSubmitting || !agreeWithdraw}
                                                    className={classes.button}
                                                >
                                                    Submit *
                                                </Button>
                                            </div>
                                            <div>
                                                <span className="dpsit"><strong>*Click this button only once.</strong> Going back to this page and clicking this button again could result in multiple Interac e-Transfer requests.</span>
                                            </div>
                                        </form>
                                    }
                                }
                            </Formik>}
                        </div>}
                        {withdrawSuccess && <div>
                            <center><h3>Withdraw Pending</h3></center>
                            <p>
                                Your withdrawal request has been sent for manual processing.
                                You will receive an email as verification when the withdrawal is complete.
                                Please contact our Customer Service Department for more information at customerservice@payperwin.com
                            </p>
                            <p>
                                For more information on withdrawing with Interac e-Transfer please click here
                            </p>
                        </div>}
                    </div>
                </div>
                <fieldset className="depositFieldset">
                    <legend>Interac E-Tranfer Withdraw Limits</legend>
                    <p>Minumum Withdraw: CAD 25.00</p>
                    <p>Maximum Withdraw: CAD {balanceStr}</p>
                </fieldset>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(WithdrawETransfer));