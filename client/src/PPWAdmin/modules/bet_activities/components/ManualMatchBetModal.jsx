import * as Yup from "yup";
import { Formik } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import { searchAutobetUsers } from "../../customers/redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class ManualMatchBetModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: {
                user: null,
                amount: 0,
            },
            autobetSchema: Yup.object().shape({
                user: Yup.object()
                    .nullable()
                    .required("User field is required."),
                amount: Yup.number()
                    .moreThan(0, "Amount should be more than 0")
                    .required("Budget field is required"),
            }),
            loadingUser: false,
        }
    }

    getOptions = (name, cb) => {
        this.setState({ loadingUser: true });
        searchAutobetUsers(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingUser: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingUser: false });
        })
    }

    render() {
        const { show, onHide, onSubmit } = this.props;
        const { initialValues, autobetSchema, loadingUser } = this.state;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Manual Match Bet</Modal.Title>
                </Modal.Header>
                {show && <Formik
                    initialValues={initialValues}
                    validationSchema={autobetSchema}
                    onSubmit={onSubmit}>
                    {(formik) => {
                        return <form onSubmit={formik.handleSubmit}>
                            <Modal.Body>
                                <div className="form-group">
                                    <label>User<span className="text-danger">*</span></label>
                                    <AsyncSelect
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
                                    />
                                    {formik.touched.user && formik.errors.user ? (
                                        <div className="invalid-feedback">
                                            {formik.errors.user}
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
                    }}
                </Formik>}
            </Modal>
        );
    }

}