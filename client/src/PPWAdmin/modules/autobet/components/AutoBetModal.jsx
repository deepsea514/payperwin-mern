import * as Yup from "yup";
import { Formik } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { searchUsers, searchSports } from "../../customers/redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import config from "../../../../../../config.json";
const AutoBetStatus = config.AutoBetStatus;

const sideOptions = [
    { value: 'Underdog', label: 'Underdog' },
    { value: 'Favorite', label: 'Favorite' },
]

const betTypeOptions = [
    { value: 'Moneyline', label: 'Moneyline' },
    { value: 'Spreads', label: 'Spreads' },
    { value: 'Over/Under', label: 'Over/Under' },
]

export default class AutoBetModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: props.initialValues ? props.initialValues : {
                user: null,
                usersExcluded: [],
                rollOver: false,
                budget: 0,
                sportsbookBudget: 0,
                acceptParlay: false,
                parlayBudget: 0,
                maxRisk: 0,
                priority: 0,
                sports: [],
                side: [],
                betType: [],
                status: AutoBetStatus.active
            },
            autobetSchema: Yup.object().shape({
                user: Yup.object()
                    .nullable()
                    .required("User field is required."),
                usersExcluded: Yup.array().of(Yup.object()),
                rollOver: Yup.boolean().default(false),
                budget: Yup.number()
                    .moreThan(0, "Budget should be more than 0")
                    .required("Budget field is required"),
                sportsbookBudget: Yup.number()
                    .moreThan(0, "HIGH STAKER Budget should be more than 0")
                    .required("HIGH STAKER Budget field is required"),
                acceptParlay: Yup.boolean().default(false),
                parlayBudget: Yup.number()
                    .required("Parlay Budget field is required"),
                maxRisk: Yup.number()
                    .moreThan(0, "Max Risk should be more than 0")
                    .required("Max Risk field is required."),
                priority: Yup.number()
                    .required("Pririty field is required."),
                sports: Yup.array().of(Yup.object()),
                side: Yup.array().of(Yup.object())
                    .min(1, "Please choose at least a Side."),
                betType: Yup.array().of(Yup.object())
                    .min(1, "Please choose at least a Bet Type."),
                status: Yup.string()
                    .required("Status field is required."),
                referral_code: Yup.string().nullable()
            }),
            loadingUser: false,
            loadingSports: false,
        }
    }

    getUsers = (name, cb) => {
        this.setState({ loadingUser: true });
        searchUsers(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingUser: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingUser: false });
        })
    }

    getSports = (name, cb) => {
        this.setState({ loadingSports: true });
        searchSports(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingSports: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingSports: false });
        })
    }

    renderStatus = () => {
        return Object.keys(AutoBetStatus).map(function (key, index) {
            return <option key={AutoBetStatus[key]} value={AutoBetStatus[key]}>{AutoBetStatus[key]}</option>
        });
    }

    render() {
        const { show, onHide, onSubmit, title, edit } = this.props;
        const { initialValues, autobetSchema, loadingUser, loadingSports } = this.state;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                {show && <Formik
                    initialValues={initialValues}
                    validationSchema={autobetSchema}
                    onSubmit={onSubmit}>
                    {(formik) => {
                        return (
                            <form onSubmit={formik.handleSubmit}>
                                <Modal.Body>
                                    <div className="form-group">
                                        <label>User<span className="text-danger">*</span></label>
                                        {!edit && <AsyncSelect
                                            className={`basic-single ${getInputClasses(formik, "user")}`}
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            name="user"
                                            loadOptions={this.getUsers}
                                            noOptionsMessage={() => "No Users"}
                                            value={formik.values.user}
                                            isLoading={loadingUser}
                                            {...formik.getFieldProps("user")}
                                            {...{
                                                onChange: (user) => {
                                                    if (!user) return;
                                                    formik.setFieldValue("user", user);
                                                    formik.setFieldTouched("user", true);
                                                    formik.setFieldError("user", false);
                                                },

                                            }}
                                        />}
                                        {edit && <input name="user"
                                            className={`form-control ${getInputClasses(formik, "user")}`}
                                            readOnly
                                            value={formik.values.user.label}
                                        />}
                                        {formik.touched.user && formik.errors.user ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.user}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Users to Exclude<span className="text-danger">*</span></label>
                                        <AsyncSelect
                                            className={`basic-single ${getInputClasses(formik, "usersExcluded")}`}
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            name="usersExcluded"
                                            loadOptions={this.getUsers}
                                            noOptionsMessage={() => "No Users"}
                                            value={formik.values.usersExcluded}
                                            isLoading={loadingUser}
                                            isMulti
                                            {...formik.getFieldProps("usersExcluded")}
                                            {...{
                                                onChange: (users) => {
                                                    if (!users) return;
                                                    formik.setFieldValue("usersExcluded", users);
                                                    formik.setFieldTouched("usersExcluded", true);
                                                    formik.setFieldError("usersExcluded", false);
                                                },
                                            }}
                                        />
                                        {formik.touched.usersExcluded && formik.errors.usersExcluded ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.usersExcluded}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-row form-group">
                                        <div className="col-md-12">
                                            <input type="checkbox" id="rollOver" name="rollOver"
                                                {...formik.getFieldProps("rollOver")}
                                                checked={formik.values.rollOver}
                                            />
                                            <label htmlFor="rollOver"> &nbsp;&nbsp;Roll over wins into the daily budget</label>
                                            {formik.touched.rollOver && formik.errors.rollOver ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.rollOver}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label>Budget<span className="text-danger">*</span></label>
                                            <input name="budget" placeholder="Enter Budget"
                                                className={`form-control ${getInputClasses(formik, "budget")}`}
                                                {...formik.getFieldProps("budget")}
                                            />
                                            {formik.touched.budget && formik.errors.budget ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.budget}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>HIGH STAKER Budget<span className="text-danger">*</span></label>
                                            <input name="sportsbookBudget" placeholder="Enter HIGH STAKER Budget"
                                                className={`form-control ${getInputClasses(formik, "sportsbookBudget")}`}
                                                {...formik.getFieldProps("sportsbookBudget")}
                                            />
                                            {formik.touched.sportsbookBudget && formik.errors.sportsbookBudget ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.sportsbookBudget}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="checkbox" id="acceptParlay" name="acceptParlay"
                                                {...formik.getFieldProps("acceptParlay")}
                                                checked={formik.values.acceptParlay} />
                                            <label htmlFor="acceptParlay"> &nbsp;&nbsp;Accept Pralay Bets</label>
                                            {formik.touched.acceptParlay && formik.errors.acceptParlay ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.acceptParlay}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Parlay Budget<span className="text-danger">*</span></label>
                                            <input name="parlayBudget" placeholder="Enter Parlay Budget"
                                                className={`form-control ${getInputClasses(formik, "parlayBudget")}`}
                                                {...formik.getFieldProps("parlayBudget")}
                                            />
                                            {formik.touched.parlayBudget && formik.errors.parlayBudget ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.parlayBudget}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label>Priority<span className="text-danger">*</span></label>
                                            <input name="priority" placeholder="Enter Priority"
                                                className={`form-control ${getInputClasses(formik, "priority")}`}
                                                {...formik.getFieldProps("priority")}
                                            />
                                            {formik.touched.priority && formik.errors.priority ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.priority}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Max.Risk<span className="text-danger">*</span></label>
                                            <input name="maxRisk" placeholder="Enter Max.Risk"
                                                className={`form-control ${getInputClasses(formik, "maxRisk")}`}
                                                {...formik.getFieldProps("maxRisk")}
                                            />
                                            {formik.touched.maxRisk && formik.errors.maxRisk ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.maxRisk}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Sports to exclude<span className="text-danger">*</span></label>
                                        <AsyncSelect
                                            className={`basic-single ${getInputClasses(formik, "sports")}`}
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            isMulti
                                            name="sports"
                                            loadOptions={this.getSports}
                                            noOptionsMessage={() => "No Sports"}
                                            value={formik.values.sports}
                                            isLoading={loadingSports}
                                            {...formik.getFieldProps("sports")}
                                            {...{
                                                onChange: (sports) => {
                                                    if (!sports) return;
                                                    formik.setFieldValue("sports", sports);
                                                    formik.setFieldTouched("sports", true);
                                                    formik.setFieldError("sports", false);
                                                },

                                            }}
                                        />
                                        {formik.touched.sports && formik.errors.sports ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.sports}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Side<span className="text-danger">*</span></label>
                                        <Select
                                            className={`basic-single ${getInputClasses(formik, "side")}`}
                                            classNamePrefix="select"
                                            isMulti
                                            name="side"
                                            options={sideOptions}
                                            value={formik.values.side}
                                            {...formik.getFieldProps("side")}
                                            {...{
                                                onChange: (side) => {
                                                    if (!side) return;
                                                    formik.setFieldValue("side", side);
                                                    formik.setFieldTouched("side", true);
                                                    formik.setFieldError("side", false);
                                                },

                                            }}
                                        />
                                        {formik.touched.side && formik.errors.side ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.side}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Bet Type<span className="text-danger">*</span></label>
                                        <Select
                                            className={`basic-single ${getInputClasses(formik, "betType")}`}
                                            classNamePrefix="select"
                                            isMulti
                                            name="betType"
                                            options={betTypeOptions}
                                            value={formik.values.betType}
                                            {...formik.getFieldProps("betType")}
                                            {...{
                                                onChange: (betType) => {
                                                    if (!betType) return;
                                                    formik.setFieldValue("betType", betType);
                                                    formik.setFieldTouched("betType", true);
                                                    formik.setFieldError("betType", false);
                                                },

                                            }}
                                        />
                                        {formik.touched.betType && formik.errors.betType ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.betType}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Status<span className="text-danger">*</span></label>
                                        <select name="status" placeholder="Choose status"
                                            className={`form-control ${getInputClasses(formik, "status")}`}
                                            {...formik.getFieldProps("status")}
                                        >
                                            {this.renderStatus()}
                                        </select>
                                        {formik.touched.status && formik.errors.status ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.status}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Referral Code<span className="text-danger">*</span></label>
                                        <input name="referral_code" placeholder="Enter Referral Code"
                                            className={`form-control ${getInputClasses(formik, "referral_code")}`}
                                            {...formik.getFieldProps("referral_code")}
                                        />
                                        {formik.touched.referral_code && formik.errors.referral_code ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.referral_code}
                                            </div>
                                        ) : null}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="light-primary" onClick={onHide}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </form>
                        )
                    }}
                </Formik>}
            </Modal>
        );
    }

}