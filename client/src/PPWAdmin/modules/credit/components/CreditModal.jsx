import * as Yup from "yup";
import { Formik } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import { searchUsers } from "../../customers/redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class CreditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: props.initialValues ? props.initialValues : {
                user: null,
                type: 'issue',
                amount: 0,
            },
            creditSchema: Yup.object().shape({
                user: Yup.object()
                    .nullable()
                    .required("User field is required."),
                type: Yup.string().required("Type field is required."),
                amount: Yup.number()
                    .moreThan(0, "Budget should be more than 0")
                    .required("Budget field is required"),
            }),
            loadingUser: false,
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


    render() {
        const { show, onHide, onSubmit, title, edit, type } = this.props;
        const { initialValues, creditSchema, loadingUser } = this.state;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                {show && <Formik
                    initialValues={initialValues}
                    validationSchema={creditSchema}
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
                                        <label>Type<span className="text-danger">*</span></label>
                                        {!edit && <input name="type"
                                            className={`form-control`}
                                            readOnly
                                            value="Issue Credit"
                                        />}
                                        {edit && <select name="type"
                                            className={`form-control ${getInputClasses(formik, "type")}`}
                                            {...formik.getFieldProps("type")}>
                                            <option value="">Choose Type ...</option>
                                            <option value="issue">Issue Credit</option>
                                            <option value="debit">Debit Line</option>
                                            <option value="transfer-in">Transfer In</option>
                                            <option value="transfer-out">Transfer Out</option>
                                        </select>}
                                        {formik.touched.type && formik.errors.type ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.type}
                                            </div>
                                        ) : null}
                                    </div>
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