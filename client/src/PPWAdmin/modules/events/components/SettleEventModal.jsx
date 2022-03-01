import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import { Modal } from "react-bootstrap";

export default class SettleEventModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settleSchema: Yup.object().shape({
                winner: Yup.string().required("Winner is required."),
            }),
            initialValues: {
                winner: '0',
            },
            options: props.event.options
        }
    }

    render() {
        const { settleSchema, initialValues, options } = this.state;
        const { show, onHide, onSubmit } = this.props;
        return (
            <Modal show={show} onHide={onHide}>
                <Formik
                    validationSchema={settleSchema}
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    {(formik) => {
                        const { errors, touched, isSubmitting, getFieldProps } = formik;
                        return <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Settle Bet</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label>Choose Winner <span className="text-danger">*</span></label>
                                    <select name="winner"
                                        className={`form-control ${getInputClasses(formik, "winner")}`}
                                        {...getFieldProps("winner")}
                                    >
                                        {options.map((option, index) => (
                                            <option value={index.toString()} key={index}>{option}</option>
                                        ))}
                                    </select>
                                    {errors && errors.winner && touched && touched.winner && (
                                        <div className="invalid-feedback">
                                            {errors.winner}
                                        </div>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="submit" className="btn btn-primary mr-2" disabled={isSubmitting}>Submit</button>
                                <button onClick={onHide} className="btn btn-secondary">Cancel</button>
                            </Modal.Footer>
                        </Form>
                    }}
                </Formik>
            </Modal>
        )
    }
}