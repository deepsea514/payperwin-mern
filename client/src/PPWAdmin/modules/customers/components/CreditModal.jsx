import * as Yup from "yup";
import { Formik } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import config from "../../../../../../config.json";
const PaymentMethod = config.PaymentMethod;
const FinancialStatus = config.FinancialStatus;


export default class CreditModal extends React.Component {
    constructor(props) {
        super(props);
        const { withdrawmax, type } = props;

        if (type == "deposit") {
            this.state = {
                initialValues: {
                    amount: 0,
                    method: "",
                    reason: "",
                    status: '',
                    sendEmail: false
                },
                creditSchema: Yup.object().shape({
                    amount: Yup.number()
                        .min(1, "Amount shouldn't be 0.")
                        .required("Amount field is required."),
                    method: Yup.string()
                        .required("Method field is required"),
                    reason: Yup.string()
                        .required("Reason field is required."),
                    status: Yup.string()
                        .required("Status field is required."),
                    sendEmail: Yup.bool().default(false),
                }),
            }
        }
        else {
            this.state = {
                initialValues: {
                    amount: 0,
                    method: "",
                    status: '',
                },
                creditSchema: Yup.object().shape({
                    amount: Yup.number()
                        .min(1, "Amount shouldn't be 0.")
                        .max(withdrawmax, `Amount shouldn't be bigger than ${withdrawmax}.`)
                        .required("Amount field is required."),
                    method: Yup.string()
                        .required("Method field is required"),
                    status: Yup.string()
                        .required("Status field is required."),
                }),
            }
        }
    }

    renderReasons() {
        const { reasons } = this.props;
        return reasons.map(reason => <option key={reason._id} value={reason._id}>{reason.title}</option>)
    }

    renderMethods = () => {
        return PaymentMethod.map(method => <option key={method} value={method}>{method}</option>)
    }

    renderStatus = () => {
        return Object.keys(FinancialStatus).map(function (key, index) {
            return <option key={FinancialStatus[key]} value={FinancialStatus[key]}>{FinancialStatus[key]}</option>
        });
    }

    render() {
        const { show, onHide, onSubmit, title, type } = this.props;
        const { initialValues, creditSchema } = this.state;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                {show && <Formik
                    initialValues={initialValues}
                    validationSchema={creditSchema}
                    onSubmit={onSubmit}>
                    {
                        (formik) => {
                            return <form onSubmit={formik.handleSubmit}>
                                <Modal.Body>
                                    <div className="form-group">
                                        <label>Amount<span className="text-danger">*</span></label>
                                        <input name="amount" placeholder="Enter Amount"
                                            className={`form-control ${getInputClasses(formik, "amount")}`}
                                            {...formik.getFieldProps("amount")}
                                        />
                                        {formik.touched.amount && formik.errors.amount ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.amount}
                                            </div>
                                        ) : null}
                                    </div>
                                    {type == "deposit" && <div className="form-group">
                                        <label>Reason<span className="text-danger">*</span></label>
                                        <select name="reason" placeholder="Choose Reason"
                                            className={`form-control ${getInputClasses(formik, "reason")}`}
                                            {...formik.getFieldProps("reason")}
                                        >
                                            <option value="">Choose reason ...</option>
                                            {this.renderReasons()}
                                        </select>
                                        {formik.touched.reason && formik.errors.reason ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.reason}
                                            </div>
                                        ) : null}
                                    </div>}
                                    <div className="form-group">
                                        <label>Payment Method<span className="text-danger">*</span></label>
                                        <select name="method" placeholder="Choose payment method"
                                            className={`form-control ${getInputClasses(formik, "method")}`}
                                            {...formik.getFieldProps("method")}
                                        >
                                            <option value="">Choose method ...</option>
                                            {this.renderMethods()}
                                        </select>
                                        {formik.touched.method && formik.errors.method ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.method}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Status<span className="text-danger">*</span></label>
                                        <select name="status" placeholder="Choose status"
                                            className={`form-control ${getInputClasses(formik, "status")}`}
                                            {...formik.getFieldProps("status")}
                                        >
                                            <option value="">Choose status ...</option>
                                            {this.renderStatus()}
                                        </select>
                                        {formik.touched.status && formik.errors.status ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.status}
                                            </div>
                                        ) : null}
                                    </div>
                                    {type == 'deposit' && <div className="form-group">
                                        <input type="checkbox" id="sendEmail" name="sendEmail" {...formik.getFieldProps("sendEmail")} />
                                        <label htmlFor="sendEmail"> &nbsp;&nbsp;Send Notification Email</label>
                                        {formik.touched.sendEmail && formik.errors.sendEmail ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.sendEmail}
                                            </div>
                                        ) : null}
                                    </div>}
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