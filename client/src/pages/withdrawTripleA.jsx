import React, { PureComponent } from 'react';
import axios from 'axios';
import { setMeta } from '../libs/documentTitleBuilder';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Form } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import DocumentMeta from 'react-document-meta';
import { getInputClasses } from "../helpers/getInputClasses";

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

class WithdrawTripleA extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            withdrawSuccess: false,
            withdrawError: null,
            agreeWithdraw: false,
            errMsg: '',
            metaData: null
        };
    }

    componentDidMount() {
        const { method } = this.props;
        const title = `Withdraw with ${method}`;
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
    }

    onSubmit = (values, formik) => {
        axios.post(`${serverUrl}/withdraw`, values, { withCredentials: true })
            .then(({ data }) => {
                const { success, message } = data;
                if (success) {
                    this.setState({ withdrawSuccess: true });
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
        const { withdrawError, withdrawSuccess, agreeWithdraw, errMsg, metaData } = this.state;
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
                {metaData && <DocumentMeta {...metaData} />}
                <h3>{method} Withdraw</h3>
                <div className="main-cnt">
                    <div className="deposit-in bg-color-box pad10">
                        {!withdrawSuccess && <div className={classes.formContent}>
                            {withdrawError && <p className="text-danger">{errMsg}</p>}
                            {user && <Formik
                                initialValues={initialValues}
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
                                                    className={`form-control ${getInputClasses(                                                        formik,                                                        "amount"                                                    )}`}
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
                                                <span className="dpsit"><strong>*Click this button only once.</strong> Going back to this page and clicking this button again could result in multiple Withdraw requests.</span>
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
                                Please contact our Customer Service Department for more information at support@payperwin.ca
                            </p>
                            <p>
                                For more information on withdrawing with {method} please click here
                            </p>
                        </div>}
                    </div>
                </div>
                <fieldset className="depositFieldset">
                    <legend>{method} Withdraw Limits</legend>
                    <p>Minumum Withdraw: CAD 25.00</p>
                    <p>Maximum Withdraw: CAD 50,000.00</p>
                </fieldset>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(WithdrawTripleA));