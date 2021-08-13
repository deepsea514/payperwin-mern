import React from "react";
import SwipeableViews from 'react-swipeable-views';
import CustomDatePicker from "./customDatePicker";
import { FormControl, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import axios from 'axios';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

const WhiteRadio = withStyles({
    root: {
        color: '#FFF',
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

class CreateCustomBetModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            errors: {},
            name: '',
            option_1: '',
            option_2: '',
            startDate: null,
            visiblity: 'public',
            favorite: 'teamA',
            odds: 100,
            wagerAmount: 0,
        }
    }

    handleNext = () => {
        const {
            activeStep,
            name,
            option_1,
            option_2,
            startDate,
            favorite,
            odds,
            wagerAmount,
            visiblity,
            errors
        } = this.state;
        switch (activeStep) {
            case 1:
                registrationValidation.validateFields({ name, option_1, option_2, startDate }, { tags: ['customBets'] })
                    .then((result) => {
                        if (result === true) {
                            this.setState({
                                errors: {
                                    ...errors,
                                    name: undefined,
                                    option_1: undefined,
                                    option_2: undefined,
                                    startDate: undefined
                                },
                                activeStep: activeStep + 1
                            });
                        } else {
                            this.setState({
                                errors: {
                                    ...errors,
                                    ...result
                                },
                            });
                        }
                    })
                    .catch((err) => {
                        this.setState({ errors: err });
                    });
                return;
            case 3:
                registrationValidation.validateFields({ odds: Number(odds) }, { tags: ['customBets'] })
                    .then((result) => {
                        if (result === true) {
                            this.setState({
                                errors: {
                                    ...errors,
                                    odds: undefined,
                                },
                                activeStep: activeStep + 1
                            })
                        } else {
                            this.setState({
                                errors: {
                                    ...errors,
                                    ...result
                                },
                            });
                        }
                    })
                    .catch((err) => {
                        this.setState({ errors: err });
                    });
                return;
            case 4:
                registrationValidation.validateFields({ wagerAmount: Number(wagerAmount) }, { tags: ['customBets'] })
                    .then((result) => {
                        if (result === true) {
                            this.setState({
                                errors: {
                                    ...errors,
                                    wagerAmount: undefined,
                                },
                            })
                            axios.post(
                                `${serverUrl}/customBet`,
                                {
                                    name,
                                    option_1,
                                    option_2,
                                    startDate,
                                    favorite,
                                    odds,
                                    visiblity,
                                    wagerAmount,
                                },
                                { withCredentials: true }
                            )
                                .then(() => {
                                    this.setState({ activeStep: activeStep + 1 })
                                })
                                .catch(() => {
                                    this.setState({
                                        errors: {
                                            ...errors,
                                            wagerAmount: 'Can\'t create Custom Bet'
                                        },
                                    })
                                })
                        } else {
                            this.setState({
                                errors: {
                                    ...errors,
                                    ...result
                                },
                            });
                        }
                    })
                    .catch((err) => {
                        this.setState({ errors: err });
                    });
                return;
            case 0:
            case 2:
            default:
                this.setState({ activeStep: activeStep + 1 })

        }
    };

    handleDirty = (evt) => {
        const { errors } = this.state;
        const { name } = evt.target;
        registrationValidation.validateField(name, this.state, { tags: ['customBets'] }).then((result) => {
            const errorsStateChange = { ...errors, server: undefined };
            if (result === true) {
                errorsStateChange[name] = undefined;
            } else {
                errorsStateChange[name] = result;
            }
            this.setState({ errors: errorsStateChange });
        });
    }

    handleBack = () => {
        const { activeStep } = this.state;
        this.setState({ activeStep: activeStep - 1 });
    };

    handleFieldChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    render() {
        const { closeModal } = this.props;
        const {
            activeStep,
            name,
            option_1,
            option_2,
            startDate,
            visiblity,
            favorite,
            odds,
            wagerAmount,
            errors
        } = this.state;

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
                                        <p style={{ color: 'white', fontSize: '16px', marginTop: '20px' }}>
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
                                                        value={name}
                                                        onChange={this.handleFieldChange}
                                                        onBlur={this.handleDirty}
                                                    />
                                                </div>
                                                {errors.name && <div className="form-error">{errors.name}</div>}
                                            </div>
                                            <div className="formField medium primary">
                                                <div className="row mx-0 px-0">
                                                    <div className="col-md-6 mx-0 pl-0">
                                                        <label className="formFieldLabel"><span>Bet Option 1</span></label>
                                                        <div className="formElementWrap">
                                                            <input
                                                                maxLength="200"
                                                                type="text"
                                                                name="option_1"
                                                                placeholder="Bet Option 1"
                                                                className="formElement"
                                                                autoComplete="off"
                                                                value={option_1}
                                                                onChange={this.handleFieldChange}
                                                                onBlur={this.handleDirty}
                                                            />
                                                        </div>
                                                        {errors.option_1 && <div className="form-error">{errors.option_1}</div>}
                                                    </div>
                                                    <div className="col-md-6 mx-0 pr-0">
                                                        <label className="formFieldLabel"><span>Bet Option 2</span></label>
                                                        <div className="formElementWrap">
                                                            <input
                                                                maxLength="200"
                                                                type="text"
                                                                name="option_2"
                                                                placeholder="Bet Option 2"
                                                                className="formElement"
                                                                autoComplete="off"
                                                                value={option_2}
                                                                onChange={this.handleFieldChange}
                                                                onBlur={this.handleDirty}
                                                            />
                                                        </div>
                                                        {errors.option_2 && <div className="form-error">{errors.option_2}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Closing Date of Bet</span></label>
                                                <div className="formElementWrap">
                                                    <CustomDatePicker
                                                        name="startDate"
                                                        className="form-control formElement"
                                                        wrapperClassName="input-group"
                                                        autoComplete="off"
                                                        showTimeInput
                                                        selected={startDate}
                                                        onChange={(startDate) => {
                                                            this.setState({ startDate })
                                                        }}
                                                        // onBlur={this.handleDirty}
                                                        dateFormat="MM/dd/yyyy h:mm aa"
                                                        required
                                                    />
                                                </div>
                                                {errors.startDate && <div className="form-error">{errors.startDate}</div>}
                                            </div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Visibility</span></label>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        name="visiblity"
                                                        row
                                                        value={visiblity}
                                                        onChange={this.handleFieldChange}
                                                        onBlur={this.handleDirty}
                                                    >
                                                        <FormControlLabel value="public" control={<WhiteRadio />} label="Public" />
                                                        <FormControlLabel value="private" control={<WhiteRadio />} label="Private" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Who is your favorite?</span></label>
                                                <div className="formElementWrap">
                                                    <select
                                                        name="favorite"
                                                        className="formElement"
                                                        value={favorite}
                                                        onChange={this.handleFieldChange}
                                                        onBlur={this.handleDirty}
                                                    >
                                                        <option value="teamA">{option_1}</option>
                                                        <option value="teamB">{option_2}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Odds for Option 1</span></label>
                                                <div className="formElementWrap">
                                                    <div className="leftIcon">
                                                        <i fill="currentColor" style={{ display: 'inline-block' }} className={`fas ${favorite == 'teamA' ? 'fa-plus' : 'fa-minus'}`} />
                                                    </div>
                                                    <input
                                                        maxLength="200"
                                                        type="number"
                                                        step="0.01"
                                                        name="odds"
                                                        min="100"
                                                        placeholder="Odds for Option 1"
                                                        className="formElement"
                                                        autoComplete="off"
                                                        value={odds}
                                                        onChange={this.handleFieldChange}
                                                        onBlur={this.handleDirty}
                                                    />
                                                </div>
                                            </div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Odds for Option 2</span></label>
                                                <div className="formElementWrap">
                                                    <div className="leftIcon">
                                                        <i fill="currentColor" style={{ display: 'inline-block' }} className={`fas ${favorite == 'teamB' ? 'fa-plus' : 'fa-minus'}`} />
                                                    </div>
                                                    <input
                                                        maxLength="200"
                                                        type="number"
                                                        step="0.01"
                                                        name="odds"
                                                        min="100"
                                                        placeholder="Odds for Option 2"
                                                        className="formElement"
                                                        autoComplete="off"
                                                        value={odds}
                                                        onChange={this.handleFieldChange}
                                                        onBlur={this.handleDirty}
                                                    />
                                                </div>
                                                {errors.odds && <div className="form-error">{errors.odds}</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="formField medium primary">
                                                <label className="formFieldLabel"><span>Wager Amount.</span></label>
                                                <div className="formElementWrap">
                                                    <input
                                                        maxLength="200"
                                                        type="number"
                                                        step="0.01"
                                                        name="wagerAmount"
                                                        min="5"
                                                        placeholder="Wager Amount"
                                                        className="formElement"
                                                        autoComplete="off"
                                                        value={wagerAmount}
                                                        onChange={this.handleFieldChange}
                                                        onBlur={this.handleDirty}
                                                    />
                                                </div>
                                                {errors.wagerAmount && <div className="form-error">{errors.wagerAmount}</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ color: 'white', fontSize: '16px', marginTop: '20px' }}>
                                                Congratulation, you have created a custom bet for {name}.  Your submission is pending review and you can start taking bets once it has been approved. Please allow up to 48 hours for an email response.
                                            </p>
                                        </div>
                                    </SwipeableViews>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="loginButton ellipsis mediumButton dead-center"
                                            onClick={this.handleBack}
                                            disabled={activeStep == 0 || activeStep == 6}
                                            type="button"
                                        >
                                            <span>Back</span>
                                        </button>
                                        <button
                                            className="loginButton ellipsis mediumButton dead-center"
                                            onClick={this.handleNext}
                                        >
                                            <span>{activeStep >= 5 ? 'Finish' : 'Next'}</span>
                                        </button>
                                    </div>
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
