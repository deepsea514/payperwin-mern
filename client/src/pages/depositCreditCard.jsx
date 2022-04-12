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
import OnramperWidget from "@onramper/widget";

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

class DepositCreditCard extends Component {
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
        const title = 'Deposit with CreditCard';
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
                this.setState({ depositError: 'Cannnot redeem credit card. Please try again later.' });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { classes, user } = this.props;
        const { depositSchema, depositError, depositSuccess } = this.state;
        
        const wallets = {
            BTC: { address: "btcAddress" },
            BNB: { address: "bnbAddress", memo: "cryptoTag" },
        };
        const apiKey = "pk_test_lwRiuub1xFSDMtNo95rmpoOTEYCMwf4qnpsGy0uV16M0";
        
        return (
            <div className="col-in" style={{width:'400px'}}>
                <h3>Use Credit Card</h3>
                    <div className="deposit-in bg-color-box">
                        {!depositSuccess && <div
                            style={{
                                height: "500px",
                                color:'black',
                            }}
                        >
                            <OnramperWidget
                                API_KEY={apiKey}
                                // color={defaultColor}
                                // fontFamily={fontFamily}
                                defaultAddrs={wallets}
                                // defaultAmount={defaultAmount}
                                // defaultCrypto={defaultCrypto}
                                defaultFiat='CAD'
                                // defaultFiatSoft={defaultFiatSoft}
                                // defaultPaymentMethod={defaultPaymentMethod}
                                // filters={{
                                //     onlyCryptos: onlyCryptos,
                                //     excludeCryptos: excludeCryptos,
                                //     onlyPaymentMethods: onlyPaymentMethods,
                                //     excludePaymentMethods: excludePaymentMethods,
                                //     excludeFiat: excludeFiat,
                                //     onlyGateways: onlyGateways,
                                //     onlyFiat: onlyFiat,
                                // }}
                                isAddressEditable={false}
                                // amountInCrypto={amountInCrypto}
                                // redirectURL={redirectURL}
                                darkMode={true}
                                partnerContext={{
                                    user:'user_id'
                                }}
                            />
                        </div>}
                        {depositSuccess && <div>
                            <center><h3>{depositSuccess}</h3></center>
                        </div>}
                    </div>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(DepositCreditCard));