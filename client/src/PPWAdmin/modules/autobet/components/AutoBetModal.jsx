import * as Yup from "yup";
import { Formik } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import { searchUsers, searchSports } from "../../customers/redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";
const config = require("../../../../../../config.json");
const AutoBetStatus = config.AutoBetStatus;
const AutoBetPeorid = config.AutoBetPeorid;


export default class AutoBetModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues: props.initialValues ? props.initialValues : {
                user: null,
                budget: 0,
                maxRisk: 0,
                peorid: AutoBetPeorid.daily,
                priority: 0,
                sports: [],
                status: AutoBetStatus.active
            },
            autobetSchema: Yup.object().shape({
                user: Yup.object()
                    .nullable()
                    .required("User field is required."),
                budget: Yup.number()
                    .moreThan(0, "Budget should be more than 0")
                    .required("Budget field is required"),
                maxRisk: Yup.number()
                    .moreThan(0, "Max Risk should be more than 0")
                    .required("Max Risk field is required."),
                peorid: Yup.string()
                    .required("Peorid field is required."),
                priority: Yup.number()
                    .required("Pririty field is required."),
                sports: Yup.array().of(Yup.object())
                    .min(1, "Please choose at least a sport."),
                status: Yup.string()
                    .required("Status field is required."),
            }),
            loadingUser: false,
            loadingSports: false,
        }
    }

    getOptions = (name, cb) => {
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

    renderPeorid = () => {
        return Object.keys(AutoBetPeorid).map(function (key, index) {
            return <option key={AutoBetPeorid[key]} value={AutoBetPeorid[key]}>{AutoBetPeorid[key]}</option>
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
                    {
                        (formik) => {
                            return <form onSubmit={formik.handleSubmit}>
                                <Modal.Body>
                                    <div className="form-group">
                                        <label>User<span className="text-danger">*</span></label>
                                        {!edit && <AsyncSelect
                                            className={`basic-single ${getInputClasses(formik, "user")}`}
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            name="user"
                                            loadOptions={this.getOptions}
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
                                            <label>Peorid<span className="text-danger">*</span></label>
                                            <select name="peorid" placeholder="Choose Peorid"
                                                className={`form-control ${getInputClasses(formik, "peorid")}`}
                                                {...formik.getFieldProps("peorid")}
                                            >
                                                {this.renderPeorid()}
                                            </select>
                                            {formik.touched.peorid && formik.errors.peorid ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.peorid}
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
                                        <label>Sports<span className="text-danger">*</span></label>
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
                        }
                    }
                </Formik>}
            </Modal>
        );
    }

}