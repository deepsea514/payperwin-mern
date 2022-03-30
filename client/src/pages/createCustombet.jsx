import React, { Component, useState } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormikWizard } from "formik-wizard-form";
import * as Yup from 'yup';
import { getInputClasses, getInputClassesInObject } from '../helpers/getInputClasses';
import CustomDatePicker from '../components/customDatePicker';
import { createCustomBet } from '../redux/services';
import { showErrorToast, showSuccessToast } from '../libs/toast';
import EventSearchModal from '../components/EventSearchModal';
import { FormControlLabel, Checkbox, Tooltip } from '@material-ui/core';
import dateformat from 'dateformat';
import { Link } from 'react-router-dom';

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

const getDate = (date) => {
    return dateformat(new Date(date), "ddd mmm dd yyyy HH:MM");
}

const AlertDetails = () => {
    return (
        <div style={{ color: 'white', fontSize: '14px', marginTop: '20px' }}>
            <b>How It Works:</b>
            <ol>
                <li>Setup the side bet (bet name, start/end date, maximum risk).</li>
                <li>Set the bet options. All options payout +100 (or 2.0 in decimal odds) for the winners. (add example here)</li>
                <li>After the bet has ended, all bettors can vote for the correct result to determine the winning option.</li>
                <li>Winners are paid out of the bet creator’s wallet minus the Payper Win 5% fee. All bets with the incorrect result will go to the bet creator. </li>
                <li>Submit the side bet for approval by Payper Win.</li>
                <li>Once your side bet is approved, you will be notified by email and your bet will be available for betting.</li>
                <li>Share your bet.</li>
            </ol>
            Ready to create your own bet? Click NEXT.
        </div>
    )
}

const EventDetails = ({ touched, errors, values, setFieldTouched, setFieldValue, getFieldProps }) => {
    const [showEventModal, setShowEventModal] = useState(false);

    return (
        <>
            {showEventModal && <EventSearchModal
                onClose={() => {
                    setShowEventModal(false);
                    setFieldValue('type', 'custom')
                }}
                onProceed={(event) => {
                    if (event) {
                        setFieldValue('name', event.label);
                        setFieldValue('startDate', new Date(event.value.startDate));
                        setShowEventModal(false);
                    }
                }} />}
            <div className="form-group">
                <label><span>Bet Type</span></label>
                <select
                    maxLength="200"
                    type="text"
                    name="type"
                    placeholder=""
                    className={`form-control ${getInputClasses({ touched, errors }, "type")}`}
                    autoComplete="off"
                    {...getFieldProps("type")}
                    onChange={evt => {
                        getFieldProps('type').onChange(evt);
                        if (evt.target.value == 'upcoming_sport') {
                            setShowEventModal(true);
                        }
                    }}>
                    <option value="">Select Bet Type.</option>
                    <option value="upcoming_sport">Major League Side Bet</option>
                    <option value="custom">Other Custom</option>
                </select>
                {errors.type && <div className="form-error">{errors.type}</div>}
            </div>
            <div className="form-group">
                <label><span>Name of Bet</span></label>
                <input
                    maxLength="200"
                    type="text"
                    name="name"
                    placeholder=""
                    className={`form-control ${getInputClasses({ touched, errors }, "name")}`}
                    autoComplete="off"
                    {...getFieldProps("name")}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
                <label><span>Start Time/Date of Event</span></label>
                <CustomDatePicker
                    name="startDate"
                    className={`form-control ${getInputClasses({ touched, errors }, "startDate")}`}
                    showTimeSelect
                    wrapperClassName="input-group"
                    selected={values.startDate}
                    onChange={(val) => {
                        setFieldTouched("startDate", true);
                        setFieldValue("startDate", val);
                        const endDate = new Date(val);
                        setFieldTouched("endDate", true);
                        setFieldValue("endDate", endDate.addHours(5));
                    }}
                    placeholder="Enter Start Date"
                    dateFormat="MMM d, yyyy hh:mm aa"
                    required
                />
                {errors.startDate && <div className="form-error">{errors.startDate}</div>}
            </div>
            <div className="form-group">
                <label><span>End Time/Date of Event</span></label>
                <CustomDatePicker
                    name="endDate"
                    className={`form-control ${getInputClasses({ touched, errors }, "endDate")}`}
                    showTimeSelect
                    wrapperClassName="input-group"
                    selected={values.endDate}
                    onChange={(val) => {
                        setFieldTouched("endDate", true);
                        setFieldValue("endDate", val);
                    }}
                    placeholder="Enter Start Date"
                    dateFormat="MMM d, yyyy hh:mm aa"
                    required
                />
                {errors.endDate && <div className="form-error">{errors.endDate}</div>}
            </div>
            <div className="form-group">
                <label><span>Public bets will be displayed on the website and anyone can place a bet. Only people with a link can place a bet on Private bets</span></label>
                <select
                    maxLength="200"
                    type="text"
                    name="visibility"
                    placeholder=""
                    className={`form-control ${getInputClasses({ touched, errors }, "visibility")}`}
                    autoComplete="off"
                    {...getFieldProps("visibility")}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                {errors.visibility && <div className="form-error">{errors.visibility}</div>}
            </div>
            <div className="form-group">
                <label><span>The maximum amount of money you can win/lose</span></label>
                <input
                    maxLength="200"
                    type="text"
                    name="maximumRisk"
                    placeholder=""
                    className={`form-control ${getInputClasses({ touched, errors }, "maximumRisk")}`}
                    autoComplete="off"
                    {...getFieldProps("maximumRisk")}
                />
                {errors.maximumRisk && <div className="form-error">{errors.maximumRisk}</div>}
            </div>
            <Tooltip
                arrow
                title={<p className='text-white mb-0 p-1'>Allows other to join your bet to share the risk</p>}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.allowAdditional}
                            onChange={(e) => setFieldValue('allowAdditional', e.target.checked)}
                            name="allowAdditional"
                            color="secondary"
                        />
                    }
                    margin="normal"
                    labelPlacement="end"
                    label="Allow Additional High Staker"
                />
            </Tooltip>
        </>
    )
}

const OptionDetails = ({ touched, errors, values, setFieldValue, getFieldProps }) => {
    const deleteOption = (index) => {
        if (values.options.length <= 2) return;
        values.options.splice(index, 1);
        setFieldValue('options', values.options);
    }

    const insertOption = () => {
        values.options.push("");
        setFieldValue('options', values.options);
    }

    return (
        <>
            <p>Enter the bet options. Example, the names of the bridesmaids</p>
            {values.options.map((option, index) => (
                <div className="form-group" key={index}>
                    <label><span>Option {index + 1}</span></label>
                    <div className='input-group'>
                        <input
                            maxLength="200"
                            type="text"
                            name={`options.${index}`}
                            placeholder=""
                            className={`form-control ${getInputClassesInObject({ touched, errors }, "options", index)}`}
                            autoComplete="off"
                            {...getFieldProps(`options.${index}`)}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text cursor-pointer" onClick={() => deleteOption(index)}><i className='fas fa-minus' /></span>
                        </div>
                    </div>
                    {errors.options && errors.options[index] && <div className="form-error">{errors.options[index]}</div>}
                </div>
            ))}
            <button className='form-button' onClick={insertOption}>Add another bet option</button>
        </>
    )
}

const reviewEvent = ({ values }) => {
    return (
        <div className='table-responsive'>
            <table className='table table-striped text-white'>
                <tbody>
                    <tr>
                        <td>Side Bet Name</td>
                        <td>{values.name}</td>
                    </tr>
                    <tr>
                        <td>Start Date</td>
                        <td>{getDate(values.startDate)}</td>
                    </tr>
                    <tr>
                        <td>End Date</td>
                        <td>{getDate(values.endDate)}</td>
                    </tr>
                    <tr>
                        <td>Visiblity</td>
                        <td>{values.visibility}</td>
                    </tr>
                    <tr>
                        <td>Maximum Risk</td>
                        <td>${values.maximumRisk} CAD</td>
                    </tr>
                    <tr>
                        <td>Allow Additional High Staker</td>
                        <td>{values.allowAdditional ? 'Yes' : "No"}</td>
                    </tr>
                    <tr>
                        <td>Options</td>
                        <td>
                            <ul style={{ listStyle: 'initial' }}>
                                {values.options.map((option, index) => (
                                    <li key={index}>{option}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default class CreateCustomBet extends Component {
    componentDidMount() {
        const title = 'Create a Side Bet';
        setTitle({ pageTitle: title });
    }

    onSubmit = (values, formik) => {
        const { history, getUser } = this.props;
        createCustomBet(values)
            .then(({ data }) => {
                const { success, error } = data;
                formik.setSubmitting(false);
                if (success) {
                    showSuccessToast("Successfully created side bet.");
                    getUser();
                    setTimeout(() => {
                        history.push('/side-bet')
                    }, 2000);
                } else {
                    showErrorToast(error);
                }
            })
            .catch(() => {
                showErrorToast("Cannot add side bet. Please try again later.");
                formik.setSubmitting(false);
            })
    }

    render() {
        const { user } = this.props;
        return (
            <div className="col-in px-3">
                <div className="d-flex justify-content-between">
                    <h3>Create a Side Bet</h3>
                </div>
                <br />
                <div>
                    <FormikWizard
                        initialValues={{
                            type: '',
                            name: "",
                            startDate: "",
                            endDate: "",
                            visibility: 'public',
                            maximumRisk: 0,
                            allowAdditional: true,
                            options: ["", ""],
                        }}
                        onSubmit={this.onSubmit}
                        validateOnNext
                        activeStepIndex={0}
                        steps={[
                            { component: AlertDetails, },
                            {
                                component: EventDetails,
                                validationSchema: Yup.object().shape({
                                    type: Yup.string().required("Please select Bet Type"),
                                    name: Yup.string()
                                        .required("Event Name is required.")
                                        .min(5, "Minumum 5 Symbols."),
                                    startDate: Yup.string()
                                        .required("Start Date is required.")
                                        .nullable(),
                                    endDate: Yup.string()
                                        .required("End Date is required.")
                                        .nullable(),
                                    visibility: Yup.string(),
                                    maximumRisk: Yup.number()
                                        .required("Maximum Risk Amount is Required.")
                                        .min(200, "Should be at least 200 CAD.")
                                        .max(user.balance, <>The maximum risk entered exceed your account balance. <Link to='/deposit' target='_blank'>Make a deposit</Link>.</>),
                                    allowAdditional: Yup.boolean(),
                                })
                            },
                            {
                                component: OptionDetails,
                                validationSchema: Yup.object().shape({
                                    options: Yup.array().of(Yup.string().required("Option Value is required.")),
                                })
                            },
                            { component: reviewEvent, }
                        ]}>
                        {({
                            currentStepIndex,
                            renderComponent,
                            handlePrev,
                            handleNext,
                            isNextDisabled,
                            isPrevDisabled,
                            isSubmitting
                        }) => {
                            return (
                                <div>
                                    {renderComponent()}
                                    <div className='d-flex justify-content-between mt-3'>
                                        <button
                                            className="loginButton ellipsis mediumButton dead-center"
                                            onClick={handlePrev}
                                            disabled={isPrevDisabled || isSubmitting}
                                            type="button">
                                            Back
                                        </button>
                                        <button
                                            className={`loginButton ellipsis mediumButton dead-center ${isSubmitting ? 'is-loading' : ''}`}
                                            disabled={isNextDisabled || isSubmitting}
                                            onClick={handleNext}
                                            type="button">
                                            {currentStepIndex === 2 ? "Finish" : "Next"}
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    </FormikWizard>
                </div>
            </div>
        );
    }
}
