import React from "react";
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';
import DatePicker from "react-datepicker";

class CreateCustomBetModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 1,
        }
    }

    handleNext = () => {
        const { activeStep } = this.state;
        if (activeStep < tourSteps.length - 1) {
            this.setState({ activeStep: activeStep + 1 });
        } else {
        }
    };

    handleBack = () => {
        const { activeStep } = this.state;
        this.setState({ activeStep: activeStep - 1 });
    };

    render() {
        const { closeModal } = this.props;
        const { activeStep } = this.state;

        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={closeModal} />
                <div className="dead-center create_bet_modal_container">
                    <div className="contentBlock overflow-hidden dead-center create_bet_modal_content">
                        <div className="create_bet_modal_main">
                            <div className="login_modal_rightbar">
                                <img className="login_modal_rightbar_logo" src="/images/logo200.png" alt="PAYPERWIN" />
                            </div>
                            <div className="create_bet_context">
                                <div className="login_modal_leftbar">
                                    <i className="fal fa-times float-right" style={{ cursor: 'pointer', fontSize: '22px' }} onClick={closeModal} />
                                    <h1 className="loginTitle"><span>Create a Custom Bet</span></h1>
                                    <SwipeableViews
                                        axis={'x'}
                                        index={activeStep}
                                    >
                                        <p>
                                            Create a custom bet to challenge your friends. You create the wager and set the odds. To build a custom bet, you’ll need to place a minimum of $10 on one side. We will help you build a custom bet, just click Next.
                                        </p>
                                        <div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Name of Bet</span></label>
                                                <div className="formElementWrap">
                                                    <input
                                                        maxLength="200"
                                                        type="text"
                                                        name="name"
                                                        placeholder="Name of Bet"
                                                        className="formElement"
                                                        autoComplete="off"
                                                    // {...formik.getFieldProps("email")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Bet Option 1</span></label>
                                                <div className="formElementWrap">
                                                    <input
                                                        maxLength="200"
                                                        type="text"
                                                        name="teamA"
                                                        placeholder="Bet Option 1"
                                                        className="formElement"
                                                        autoComplete="off"
                                                    // {...formik.getFieldProps("password")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Bet Option 2</span></label>
                                                <div className="formElementWrap">
                                                    <input
                                                        maxLength="200"
                                                        type="text"
                                                        name="teamB"
                                                        placeholder="Bet Option 2"
                                                        className="formElement"
                                                        autoComplete="off"
                                                    // {...formik.getFieldProps("password")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Bet Option 2</span></label>
                                                <div className="formElementWrap">
                                                    <input
                                                        maxLength="200"
                                                        type="text"
                                                        name="teamB"
                                                        placeholder="Bet Option 2"
                                                        className="formElement"
                                                        autoComplete="off"
                                                    // {...formik.getFieldProps("password")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SwipeableViews>
                                    <button
                                        className="loginButton ellipsis mediumButton dead-center"
                                        onClick={() => this.setState({ activeStep: activeStep - 1 })}
                                    >
                                        <span>Back</span>
                                    </button>
                                    <button
                                        className="loginButton ellipsis mediumButton dead-center"
                                        onClick={() => this.setState({ activeStep: activeStep + 1 })}
                                    >
                                        <span>Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateCustomBetModal;
